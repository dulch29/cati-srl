# Cati SRL System Architecture

> **Hackathon**: Next Byte Hacks V5  
> **Product**: Cati SRL (AI Self-Regulated Learning Companion)  
> **Core Architecture**: Typed Server-Driven Learning Loop with Deterministic Mastery Engine & Resilience Layer

---

## 1. High-Level System Architecture Diagram

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                         |
|  Next.js 16 App Router (React 19, TypeScript strict, Tailwind CSS, Lucide Icons)        |
|                                                                                         |
|  - /                     (Landing page & SRL philosophy overview)                       |
|  - /login                (Supabase Auth & 1-click Demo session access)                  |
|  - /dashboard            (Today Command Center: Streak, XP, Due Reviews, Active Quest)  |
|  - /journal/new          (Reflection editor with 1-5 confidence slider & demo prefill)  |
|  - /insights/[id]        (AI Metacognitive calibration, concept breakdown & evidence)   |
|  - /review               (Adaptive 3-question SRS session with real-time AI grading)    |
|  - /knowledge-map        (Interactive concept graph visualizer with color-coded mastery)|
|  - /quests/[questId]     (Micro-quest checklist, progress bar, & XP claim flow)        |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            v  HTTPS / Server Actions / REST
+-------------------------------------------+---------------------------------------------+
|                                NEXT.JS API ROUTE HANDLERS                               |
|  - POST /api/analyze-journal   (Concept extraction, quote evidence, gap classification) |
|  - POST /api/generate-review   (Prerequisite-targeted 3-question adaptive quiz)         |
|  - POST /api/evaluate-review   (Conceptual answer evaluation & deterministic mastery)   |
|  - GET  /api/quests/active     (Fetches or auto-generates active targeted micro-quest)  |
|  - POST /api/complete-quest    (Task checklist tracking, anti-cheat & XP reward)        |
|  - GET  /api/dashboard         (Aggregated stats: streak, XP, reviews count, quest)     |
|                                                                                         |
|  Validation & Security: Zod Input/Output schemas, sanitized text, server-side env vars  |
+---------------------+---------------------------------------------+---------------------+
                      |                                             |
                      v                                             v
+---------------------+-----------------------+   +-----------------+---------------------+
|        PRIMARY DATABASE (Supabase)          |   |            AI ENGINE                  |
|  PostgreSQL 15 with Row Level Security (RLS)|   |  Google Gemini API                    |
|                                             |   |  - Models: gemini-2.5-flash /         |
|  - auth.users (Supabase Auth sessions)      |   |            gemini-3.8-flash           |
|  - users_profile (XP, streak, last_active)  |   |  - Metacognitive Gap Analysis         |
|  - journal_entries (raw reflection text)    |   |  - Concept & Misconception Extraction |
|  - ai_analyses (parsed JSON results)        |   |  - Adaptive Question Generation       |
|  - concepts (global concept registry)       |   |  - Conceptual Answer Evaluation       |
|  - learner_concepts (user mastery & SRS)    |   |  - Micro-Quest Task Generation        |
|  - concept_relations (prerequisite graph)   |   |                                       |
|  - reviews & review_items                   |   |  Safety: Temperature 0.2, strict JSON |
|  - quests (task checklist, status, XP)      |   |  enforcement, Zod parse validation    |
+---------------------+-----------------------+   +---------------------------------------+
                      |
                      v (Automatic Zero-Config Fallback)
+---------------------+-------------------------------------------------------------------+
|                           LOCAL PERSISTENCE LAYER (Fail-Safe)                           |
|  In-Memory & Browser Local Storage mirror for demo resilience:                          |
|  - Maintains complete user profile, journal entries, analyses, and concepts offline    |
|  - Allows judges to evaluate full system functionality without setting up Supabase keys |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Core Subsystems

### A. Metacognitive Calibration Pipeline
The student submits a learning journal with a self-assessed confidence score ($1 \le C_{self} \le 5$). 
1. The server passes the reflection to Gemini along with explicit pedagogical instructions.
2. The model extracts concepts and assigns an **inferred confidence** ($1 \le C_{inferred} \le 5$) based on concrete evidence in the text.
3. The gap is classified:
   - **Aligned**: $|C_{self} - C_{inferred}| \le 1$
   - **Overconfident**: $C_{self} - C_{inferred} \ge 2$
   - **Underconfident**: $C_{inferred} - C_{self} \ge 2$
4. Any detected misconception must reference a verbatim quote from the student's journal before it is accepted.

### B. Knowledge Graph & Prerequisite Engine
- **Concepts Table**: Stores canonical concept names, normalized slugs, and subjects.
- **Learner Concepts Table**: Tracks per-user mastery ($M \in [0.0, 1.0]$), status (`new`, `weak`, `developing`, `mastered`), review intervals, and due dates.
- **Concept Relations Table**: Directed acyclic graph (DAG) tracking prerequisite dependencies (`requires`, `related_to`).

### C. Deterministic Spaced Repetition & Mastery Engine
Rather than relying on non-deterministic AI for progression calculations, the learning engine uses explicit pedagogical rules:
- **Correct Answer**: $\Delta M = +0.15$, Interval $\times 2.0$ (up to 30 days)
- **Partially Correct**: $\Delta M = +0.08$, Interval maintained
- **Incorrect Answer**: $\Delta M = -0.10$, Interval reset to 1 day (lapse handling)
- **Bounds**: Clamped strictly between $0.00$ and $1.00$.

### D. Targeted Micro-Quest System
- **1 Active Quest Rule**: Prevents cognitive overload by limiting the student to one active quest at a time.
- **Time Boxing**: Quests are calibrated for 5–15 minutes.
- **Task Types**: `read`, `practice`, `explain`, `review`.
- **Anti-Cheat & Reward Integrity**: Quests verify that all task IDs match before awarding XP. Duplicate submissions for already-completed quests do not reward extra XP.

---

## 3. Database Schema Overview

```sql
-- Concepts & Knowledge Graph
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  normalized_name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT
);

CREATE TABLE learner_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  mastery NUMERIC(3, 2) DEFAULT 0.20,
  status TEXT DEFAULT 'new', -- new, weak, developing, mastered
  review_due TIMESTAMPTZ DEFAULT NOW(),
  review_interval_days INT DEFAULT 1,
  UNIQUE(user_id, concept_id)
);

CREATE TABLE concept_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_concept_id UUID REFERENCES concepts(id),
  target_concept_id UUID REFERENCES concepts(id),
  relation_type TEXT DEFAULT 'requires' -- requires, related_to
);

-- Quests
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reason TEXT,
  estimated_time TEXT DEFAULT '10 mins',
  tasks JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Security & Privacy Guarantees

1. **Row Level Security (RLS)**: Every user table has RLS enabled with `USING (auth.uid() = user_id)`.
2. **Server-Side Credentials**: Gemini API keys and Supabase Service Role keys are never exposed in browser bundles or client code.
3. **Zod Boundary Validation**: Every incoming request body and AI output is strictly validated against TypeScript Zod schemas before being processed or persisted.
