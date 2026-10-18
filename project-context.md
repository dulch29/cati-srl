# Project Context

## Overview
- **Project**: Cati SRL
- **Purpose**: AI self-regulated learning companion for students.
- **Core Loop**: `Journal` → `AI Analysis` → `Knowledge Graph` → `Adaptive Review` → `Quest`

---

## MVP Tech Stack
- **Framework**: Next.js App Router (v15+)
- **Language**: TypeScript (Strict Mode enabled)
- **Styling**: Tailwind CSS
- **Backend / Database**: Supabase (PostgreSQL with Row Level Security)
- **AI Engine**: Gemini / OpenAI API
- **Hosting & Deployment**: Vercel

---

## MVP Guardrails & Exclusions
To maintain focus and ship a complete, reliable MVP, **DO NOT** add the following features during this phase:
- ❌ Camera detection / computer vision
- ❌ AR pets / 3D virtual pets
- ❌ Social feeds / public timelines
- ❌ Global leaderboards / competitive rankings
- ❌ Native mobile app features (focus exclusively on responsive web)

---

## Core Engineering Principles
1. **TypeScript Strict Mode**: Always adhere to strict type checking across all files (`tsconfig.json` strict mode). Avoid `any` types.
2. **AI Response Validation**: Always validate and parse structured AI JSON responses (e.g., using Zod or strict runtime validation schemas) before writing to the database.
3. **Database Security (Supabase RLS)**:
   - Ensure Row Level Security (RLS) is enabled and enforced on all tables.
   - **Never** expose the Supabase `SUPABASE_SERVICE_ROLE_KEY` to the client or browser-facing code.
   - Only use the service role key in secure server-side API routes or background workers when elevated access is strictly necessary.
4. **MVP Prioritization**: Always prioritize a rock-solid, fully functioning end-to-end core loop over auxiliary or scope-creep features.
