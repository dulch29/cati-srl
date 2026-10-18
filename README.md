# Cati SRL: AI Self-Regulated Learning Companion

> **Next Byte Hacks V5 Hackathon Project**  
> An intelligent educational companion turning daily study reflections into personalized, adaptive learning actions, calibrated metacognition, and personal knowledge graphs.

---

## 🌟 Product Overview

**Cati SRL** helps students understand _how_ they learn, not just _what_ they learn. After studying, a student writes a brief 2-minute learning reflection and rates their confidence. Cati analyzes the reflection to extract core concepts, detect underlying misconceptions, compare self-reported confidence against evidence (metacognitive calibration), update a personal knowledge graph, and recommend immediate learning actions through 3-question adaptive reviews and micro-quests.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) App Router with [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a calm, dark-mode-first aesthetic
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **SSR Client**: `@supabase/ssr` & `@supabase/supabase-js`
- **Deployment Target**: [Vercel](https://vercel.com/)
- **Code Quality**: ESLint, Prettier

---

## 📁 Project Architecture & Structure

```
cati-srl/
├─ app/
│  ├─ layout.tsx                  # Root HTML layout with dark theme & typography
│  ├─ page.tsx                    # Landing / Hero page
│  ├─ login/page.tsx              # Supabase Auth (Sign In, Sign Up, & 1-Click Demo)
│  ├─ dashboard/page.tsx          # "Today" dashboard (Streak, XP, Quests, Recent topics)
│  ├─ journal/new/page.tsx        # Daily reflection form with 1-5 confidence slider
│  ├─ insights/[entryId]/page.tsx # Metacognitive insight report & calibration radar
│  ├─ review/page.tsx             # Adaptive 3-question spaced repetition session
│  └─ knowledge-map/page.tsx      # Learner Knowledge Graph with mastery color coding
├─ components/
│  ├─ ui/
│  │  ├─ card.tsx                 # Card, Header, Title, Content, Footer
│  │  ├─ button.tsx               # Primary, secondary, outline, ghost, loading states
│  │  ├─ input.tsx                # Accessible text inputs with labels & errors
│  │  ├─ textarea.tsx             # Auto-resizing reflection textareas
│  │  ├─ select.tsx               # Styled subject dropdowns
│  │  ├─ loading.tsx              # Skeletons, spinners, and full-card loaders
│  │  └─ empty-state.tsx          # Reusable zero-state displays
│  ├─ layout/
│  │  ├─ app-shell.tsx            # Unified layout shell for desktop & mobile
│  │  ├─ sidebar.tsx              # Desktop navigation with user profile & stats
│  │  ├─ bottom-nav.tsx           # Mobile navigation bar
│  │  └─ cati-logo.tsx            # Refined geometric Cati mascot logo
│  └─ journal/
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts                # Browser Supabase client (@supabase/ssr)
│  │  ├─ server.ts                # Server Supabase client with async cookies
│  │  └─ middleware.ts            # Route protection & session refresh logic
│  ├─ types/
│  │  ├─ database.ts              # Full PostgreSQL database types & schemas
│  │  └─ ai.ts                    # AI analysis & metacognition interfaces
│  └─ utils.ts                    # Utility helpers (cn classname merging)
├─ supabase/
│  └─ migrations/
│     └─ 0001_initial_schema.sql  # DDL with tables, indexes, RLS, and triggers
├─ docs/
│  ├─ architecture.md             # System architecture & data flow diagrams
│  └─ product-vision.md           # Product philosophy, core loop, and scope
├─ middleware.ts                  # Next.js route protection middleware
├─ .env.example                   # Environment configuration template
└─ README.md
```

---

## ⚡ Local Setup Instructions

### Prerequisites

- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/cati-srl.git
cd cati-srl
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials (available in your Supabase dashboard under **Project Settings > API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

_(Note: The app includes a built-in 1-Click Demo Mode on `/login` that allows reviewing the entire UI shell even before connecting Supabase)._

### 3. Run the Supabase Database Migration

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql).
2. Copy the contents of `supabase/migrations/0001_initial_schema.sql`.
3. Click **Run** to provision the 8 tables, indexes, RLS policies, and user creation trigger.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Scope Breakdown

### Current Phase 1 Scope (Completed)

- Next.js 15 App Router scaffold with TypeScript strict mode and Tailwind CSS.
- Complete Supabase database schema (`supabase/migrations/0001_initial_schema.sql`) with tables (`users_profile`, `journal_entries`, `ai_analyses`, `concepts`, `learner_concepts`, `concept_relations`, `reviews`, `quests`), constraints, performance indexes, and strict Row Level Security (RLS).
- Supabase SSR authentication client, server client, and Next.js middleware with route protection.
- Reusable UI component library (`Card`, `Button`, `Input`, `Textarea`, `Select`, `LoadingState`, `EmptyState`).
- Responsive AppShell with desktop sidebar and mobile bottom navigation.
- All core application pages (`/`, `/login`, `/dashboard`, `/journal/new`, `/insights/[entryId]`, `/review`, `/knowledge-map`).

---

## 🧠 Phase 2: AI Learning Analysis (Completed)

Phase 2 connects the daily journal reflection form to an end-to-end AI metacognitive evaluation pipeline powered by the Google Gemini API with strict Zod schema validation and automatic learner knowledge graph calibration.

### Core Loop Architecture

```
Student Journal Form (/journal/new)
       │
       ▼ (POST /api/analyze-journal)
[Auth Check & Save Raw Journal] (journal_entries)
       │
       ▼
[Gemini AI Analysis Engine] (lib/ai/clients/gemini.ts)
       │
       ▼
[Strict Zod Schema Validation] (lib/ai/schemas/journal-analysis.ts)
       │
       ├─► [Persist Validated Analysis] (ai_analyses)
       │
       ▼
[Update Learner Knowledge Graph] (lib/ai/knowledge-graph.ts)
       ├─► Normalize & Upsert Global Concepts (concepts)
       ├─► Calibrate Mastery & Review Dates (learner_concepts)
       ├─► Flag Misconceptions as Weak & Due Tomorrow
       └─► Infer Prerequisite Relations (concept_relations)
       │
       ▼
Student Insights Dashboard (/insights/[entryId])
```

### Key API & Pipeline Components

- **Endpoint**: `POST /api/analyze-journal`
  - Validates request payload using Zod.
  - Requires authenticated session or active demo session.
  - Persists the raw reflection before invoking the AI model.
  - Invokes Google Gemini (`gemini-2.5-flash` with automatic fallback to `gemini-2.0-flash` / `gemini-1.5-flash`).
  - Validates output with `JournalAnalysisSchema` (HTTP 422 on schema failure; invalid data is rejected).
  - Returns `{ success: true, journalEntryId: "uuid" }`.
- **Knowledge Graph Updates**:
  - **Normalization**: Concept names are trimmed, lowercased, and stripped of punctuation for global deduplication.
  - **Initial Mastery**: `understood` (0.65), `attempted` (0.45), `confused` (0.30), `unknown` (0.20).
  - **Mastery Calibration**: `understood` (+0.05), `attempted` (+0.02), `confused` (-0.05).
  - **Review Scheduling**: `weak` (due tomorrow), `developing` (in 3 days), `strong` (in 7 days), `new` (in 3 days).
  - **Misconception Detection**: Flags related concept as `weak`, lowers mastery by 0.05, and sets review due date to tomorrow.
  - **Concept Relations**: Infers `requires` and `related_to` edges from the main topic to sub-concepts.
- **Insights View (`/insights/[entryId]`)**:
  - Displays original reflection and self-reported rating.
  - Color-coded concept badges (Green: understood/strong, Yellow: attempted/developing, Red: confused/weak, Gray: unknown/new).
  - Diagnosed misconceptions with grounded evidence quotes from the student's writing.
  - Metacognitive calibration comparison (Self-reported vs Inferred confidence) and gap explanation.
  - Targeted next action with clear CTA linking to `/review`.

---

## 🧪 Short Testing Guide

You can easily test the entire Phase 2 AI pipeline using the built-in test button or manual entry:

### Step 1: Ensure Your Environment Variables are Configured
In `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### Step 2: Open the Reflection Form
1. Run `npm run dev` and navigate to [http://localhost:3000/journal/new](http://localhost:3000/journal/new).
2. Click the **"Auto-fill Test Sample"** button in the header (or paste the sample below):
   - **Subject**: `Computer Science`
   - **Topic**: `Python Recursion`
   - **Content**: 
     > *"Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error."*
   - **Confidence**: Set slider to `4 - Confident` (or `5 - Very confident`).

### Step 3: Analyze Reflection
1. Click **"Analyze Reflection"**.
2. Notice the loading spinner state while Gemini processes the metacognitive analysis.
3. You will be automatically redirected to `/insights/[entryId]`.

### Expected Results on the Insights Page:
- **Main Topic**: `Recursion` or `Python Recursion`
- **Extracted Concepts**:
  - `recursion`: Status `understood` (or `attempted`)
  - `base case`: Status `confused` (Red badge)
  - `factorial`: Status `attempted`
- **Misconception**:
  - Concept: `Base case`
  - Evidence quote: mentions *"got confused about where to put the base case"* or *"tried factorial and got an error"*.
- **Confidence Calibration**:
  - Self-reported: `4 / 5`
  - Inferred: `2 / 5`
  - Gap: `Calibration Gap: Overconfident` (highlighted in amber)
- **Targeted Next Action**:
  - Recommends practicing where to position base cases to prevent recursion errors.
- **CTA**: "Start Review" button linking to `/review`.
---

## 💡 What Cati SRL Demonstrates

1. **Metacognitive Calibration over Chatbot Answers**: Rather than an AI answering questions for the student, Cati acts as an intelligent mirror that detects whether a student is overconfident or underconfident relative to their actual comprehension.
2. **Concept-Level Knowledge Graphs**: Instead of treating course material as disjointed flashcards, Cati maps knowledge into prerequisite trees where weak foundations trigger proactive remediation.
3. **Self-Regulated Learning (SRL) Discipline**: Encourages daily active recall and reflection through clear, non-punitive gamification (XP, streaks, and bite-sized 15-minute quests).

---

## 🚀 Future Roadmap

- **Phase 3**: Long-term calibration trend analytics (visualizing how a student's metacognitive self-accuracy evolves over time).
- **Phase 4**: Automated prerequisite graph extraction for custom student syllabi.
- **Phase 5**: Anki deck export and Canvas / Moodle LMS synchronization.

---

## 📄 License

MIT License • Created for the Next Byte Hacks V5 Hackathon.
