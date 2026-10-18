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
- All core application pages:
  - `/` (Product landing hero)
  - `/login` (Email/password authentication + 1-Click Demo mode)
  - `/dashboard` (Today's streak, XP, review count, recommended quest, and recent topics)
  - `/journal/new` (Reflection editor with 1-5 confidence slider)
  - `/insights/[entryId]` (Metacognitive insight report preview)
  - `/review` (Adaptive 3-question practice preview)
  - `/knowledge-map` (Concept graph with mastery color-coding and node inspector)
- Comprehensive documentation (`docs/architecture.md`, `docs/product-vision.md`).

### Planned Phase 2 Scope (Next Phase)

- Implement `POST /api/analyze-journal` powered by Google Gemini API / OpenAI with strict Zod JSON schema validation.
- Compute confidence gap (`aligned`, `overconfident`, `underconfident`) by comparing student self-confidence to extracted reasoning.
- Implement `POST /api/generate-review` to dynamically generate 3 adaptive questions from the student's weakest prerequisite concepts.
- Implement the deterministic mastery engine (+0.15 correct, +0.05 partial, -0.10 incorrect, -0.05 overdue decay).
- Dynamic SVG/Canvas Knowledge Map rendering directly from Supabase `learner_concepts` and `concept_relations`.

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
