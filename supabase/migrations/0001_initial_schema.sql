-- ==============================================================================
-- Cati SRL: Initial Database Schema Migration
-- Migration: 0001_initial_schema.sql
-- Description: Core tables, foreign keys, constraints, RLS policies, indexes, and triggers
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. users_profile Table
-- ------------------------------------------------------------------------------
create table if not exists public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  xp integer not null default 0,
  streak integer not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 2. journal_entries Table
-- ------------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile(id) on delete cascade,
  subject text not null,
  topic text not null,
  content text not null,
  self_confidence integer not null check (self_confidence between 1 and 5),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 3. ai_analyses Table
-- ------------------------------------------------------------------------------
create table if not exists public.ai_analyses (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  main_topic text,
  analysis jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 4. concepts Table
-- ------------------------------------------------------------------------------
create table if not exists public.concepts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text not null unique,
  subject text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. learner_concepts Table
-- ------------------------------------------------------------------------------
create table if not exists public.learner_concepts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile(id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  mastery numeric not null default 0.3 check (mastery >= 0 and mastery <= 1),
  status text not null default 'new',
  review_due date,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint unique_user_concept unique (user_id, concept_id)
);

-- ------------------------------------------------------------------------------
-- 6. concept_relations Table
-- ------------------------------------------------------------------------------
create table if not exists public.concept_relations (
  id uuid primary key default gen_random_uuid(),
  from_concept_id uuid not null references public.concepts(id) on delete cascade,
  to_concept_id uuid not null references public.concepts(id) on delete cascade,
  relation_type text not null, -- e.g. 'requires', 'related_to'
  created_at timestamptz not null default now(),
  constraint unique_concept_relation unique (from_concept_id, to_concept_id, relation_type)
);

-- ------------------------------------------------------------------------------
-- 7. reviews Table
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile(id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  question text not null,
  expected_answer text,
  explanation text,
  difficulty text, -- 'easy', 'medium', 'hard'
  student_answer text,
  result text, -- 'correct', 'partial', 'incorrect'
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 8. quests Table
-- ------------------------------------------------------------------------------
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile(id) on delete cascade,
  title text not null,
  reason text,
  estimated_time text,
  tasks jsonb not null default '[]'::jsonb,
  status text not null default 'pending', -- 'pending', 'in_progress', 'completed'
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- Performance Indexes
-- ------------------------------------------------------------------------------
create index if not exists idx_journal_entries_user_id on public.journal_entries(user_id);
create index if not exists idx_journal_entries_created_at on public.journal_entries(created_at desc);

create index if not exists idx_ai_analyses_journal_entry_id on public.ai_analyses(journal_entry_id);

create index if not exists idx_concepts_normalized_name on public.concepts(normalized_name);
create index if not exists idx_concepts_subject on public.concepts(subject);

create index if not exists idx_learner_concepts_user_id on public.learner_concepts(user_id);
create index if not exists idx_learner_concepts_concept_id on public.learner_concepts(concept_id);
create index if not exists idx_learner_concepts_review_due on public.learner_concepts(review_due);

create index if not exists idx_concept_relations_from on public.concept_relations(from_concept_id);
create index if not exists idx_concept_relations_to on public.concept_relations(to_concept_id);

create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_reviews_concept_id on public.reviews(concept_id);

create index if not exists idx_quests_user_id on public.quests(user_id);
create index if not exists idx_quests_status on public.quests(status);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.users_profile enable row level security;
alter table public.journal_entries enable row level security;
alter table public.ai_analyses enable row level security;
alter table public.concepts enable row level security;
alter table public.learner_concepts enable row level security;
alter table public.concept_relations enable row level security;
alter table public.reviews enable row level security;
alter table public.quests enable row level security;

-- 1. users_profile Policies
create policy "Users can view own profile"
  on public.users_profile for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users_profile for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users_profile for insert
  with check (auth.uid() = id);

-- 2. journal_entries Policies
create policy "Users can view own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- 3. ai_analyses Policies
create policy "Users can view own AI analyses"
  on public.ai_analyses for select
  using (
    exists (
      select 1 from public.journal_entries j
      where j.id = ai_analyses.journal_entry_id
        and j.user_id = auth.uid()
    )
  );

create policy "Users can insert AI analyses for own journals"
  on public.ai_analyses for insert
  with check (
    exists (
      select 1 from public.journal_entries j
      where j.id = ai_analyses.journal_entry_id
        and j.user_id = auth.uid()
    )
  );

-- 4. concepts Policies (Shared knowledge base)
create policy "Authenticated users can read concepts"
  on public.concepts for select
  to authenticated
  using (true);

create policy "Authenticated users can insert concepts"
  on public.concepts for insert
  to authenticated
  with check (true);

-- 5. learner_concepts Policies
create policy "Users can view own learner concepts"
  on public.learner_concepts for select
  using (auth.uid() = user_id);

create policy "Users can insert own learner concepts"
  on public.learner_concepts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own learner concepts"
  on public.learner_concepts for update
  using (auth.uid() = user_id);

create policy "Users can delete own learner concepts"
  on public.learner_concepts for delete
  using (auth.uid() = user_id);

-- 6. concept_relations Policies
create policy "Authenticated users can read concept relations"
  on public.concept_relations for select
  to authenticated
  using (true);

create policy "Authenticated users can insert concept relations"
  on public.concept_relations for insert
  to authenticated
  with check (true);

-- 7. reviews Policies
create policy "Users can view own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "Users can insert own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- 8. quests Policies
create policy "Users can view own quests"
  on public.quests for select
  using (auth.uid() = user_id);

create policy "Users can insert own quests"
  on public.quests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quests"
  on public.quests for update
  using (auth.uid() = user_id);

create policy "Users can delete own quests"
  on public.quests for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Automatic Profile Creation Trigger
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users_profile (id, display_name, xp, streak, last_active_date)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    0,
    0,
    null
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run handle_new_user after a new auth.users row is inserted
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
