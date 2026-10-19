# Cati SRL: AI Self-Regulated Learning Companion
### Next Byte Hacks V5 Project Submission

---

## 1. Inspiration

Most students don't struggle because they lack study materials—they struggle because of the **illusion of competence**. 

When a student highlights a textbook, re-reads lecture slides, or watches a 20-minute tutorial, their brain mistakes familiarity for genuine understanding. Later on, when they sit down for an exam or try to write code from scratch, critical misconceptions surface too late.

To make matters worse, typical AI study tools act like passive answer vending machines. They write the essay, solve the code, or spit out instant summaries. While convenient, this bypasses the essential cognitive friction needed for neuroplastic retention. Students are left with high confidence, shallow mastery, and no metacognitive awareness of how they actually learn.

We built **Cati SRL** to flip this paradigm: instead of an AI that does the thinking for you, Cati acts as an objective metacognitive mirror. It helps learners evaluate their own reflections, flags where confidence diverges from reasoning, tracks concepts on a personalized knowledge graph, and delivers targeted micro-practice to fix weak prerequisites before moving forward.

---

## 2. What It Does

Cati SRL implements a complete, closed-loop **Self-Regulated Learning (SRL)** cycle:

1. **Daily Study Reflection (`/journal/new`)**:
   After a study session, the student spends 2 minutes logging what they studied, what clicked, where they got stuck, and their self-assessed confidence level (1 to 5).
2. **AI Metacognitive Calibration (`/insights/[entryId]`)**:
   Powered by Google Gemini and structured Zod schemas, Cati decomposes the reflection into granular concepts, isolates specific misconceptions backed by direct quote evidence, and classifies the student's metacognitive alignment (`aligned`, `overconfident`, or `underconfident`).
3. **Personal Knowledge Graph (`/knowledge-map`)**:
   Each concept is maintained as a node in an interactive graph with prerequisite edges. Mastery is visually color-coded:
   - 🟢 **Green (Mastered / 0.75+)**
   - 🟡 **Yellow (Developing / 0.40–0.74)**
   - 🔴 **Red (Weak / < 0.40)**
   - ⚪ **Gray (New / Unassessed)**
4. **Adaptive Review (`/review`)**:
   Rather than asking generic quiz questions, Cati identifies the student's weakest prerequisite concepts and generates 3 targeted review questions with escalating cognitive challenge (easy, medium, hard).
5. **Deterministic Mastery Recalibration**:
   Student answers are evaluated for conceptual correctness (+0.15 for correct, +0.08 for partially correct, -0.10 for incorrect). Future review intervals adjust deterministically based on spaced repetition principles.
6. **Actionable Micro-Quests (`/quests/[questId]`)**:
   Based on the latest weak concept, Cati assigns a single 5–15 minute micro-quest consisting of 2–4 actionable steps (e.g., *Read*, *Practice*, *Explain*, *Review*). Completing quests awards XP and maintains daily streaks.

---

## 3. How We Built It

We designed Cati SRL with a production-ready, typed modern stack:

- **Frontend & App Framework**: Next.js 16 (App Router), React 19, TypeScript strict mode, and Tailwind CSS.
- **Visual Design**: High-contrast dark theme, accessible typography, dynamic SVG knowledge graph, and smooth micro-animations.
- **Backend & APIs**: Next.js Server Actions and Route Handlers with secure session cookies and validation pipelines.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies and Supabase Auth.
- **AI Engine**: Google Gemini API (`gemini-2.5-flash` / `gemini-3.8-flash`) using `@google/genai` with strict JSON schema enforcement via Zod.
- **Resilience & Local Fallback**: Built-in in-memory / local storage fallback allowing judges to test 100% of the application features even without active Supabase credentials or when offline.

---

## 4. Challenges We Ran Into

1. **Eliminating AI Hallucinations in Pedagogical Feedback**:
   Early prompts frequently produced generic feedback ("Study harder", "Good job!"). We solved this by enforcing strict prompt contracts requiring the model to cite exact verbatim quotes from the student's journal as evidence before registering a misconception.
2. **Deterministic vs. Generative Balance**:
   We deliberately separated generative tasks (concept extraction, question generation, and explanation grading) from deterministic tasks (spaced repetition intervals, mastery deltas, XP awards, and streak tracking). This ensures the learner's progression is always transparent, predictable, and fair.
3. **Graph Prerequisite Ordering**:
   Establishing realistic dependency hierarchies (e.g., *base case* ➔ *recursion* ➔ *tree traversal*) required multi-hop concept relation mapping and topological sorting in TypeScript to ensure foundational concepts are remediated first.

---

## 5. Accomplishments That We Are Proud Of

- **True Metacognitive Calibration**: Watching Cati accurately detect that a student who rated themselves 4/5 was actually struggling with a base case error, and seeing the app isolate that exact prerequisite without human intervention.
- **Zero Friction Judge Onboarding**: Creating a 1-click demo button that pre-populates a realistic STEM reflection and allows anyone to experience the full 5-step loop in under 2 minutes.
- **Zero Exposed Secrets & Strict Security**: All AI keys and service credentials stay strictly on the server side; database records are protected by RLS.
- **Robust Fail-Safe Architecture**: The app runs seamlessly in full Supabase mode, local fallback mode, or demo mode without crashing or throwing unhandled errors.

---

## 6. What We Learned

- Self-Regulated Learning principles (Zimmerman's SRL model) can be effectively augmented with modern LLMs when the AI is constrained to act as a diagnostic mirror rather than an answer oracle.
- Enforcing structured output with Zod validation at every network boundary prevents unexpected runtime bugs and makes AI pipelines predictable enough for educational software.
- Visualizing knowledge as an interconnected prerequisite map motivates learners far more than abstract percentage scores.

---

## 7. What’s Next for Cati SRL

- **FSRS-5 Spaced Repetition**: Integrating the Free Spaced Repetition Scheduler algorithm for mathematically optimal review intervals.
- **Voice Journaling**: Allowing students to verbalize their reflections aloud after study sessions with instant transcript calibration.
- **Course Syllabus Knowledge Graph Ingestion**: Enabling students to upload course syllabi or markdown lecture notes to auto-generate custom concept trees.
- **Metacognitive Peer Review**: Enabling anonymous, calibrated peer-review of explanations to deepen conceptual retention.
