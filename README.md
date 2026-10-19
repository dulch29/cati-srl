# Cati SRL: AI Self-Regulated Learning Companion

> **Hackathon**: Next Byte Hacks V5  
> **Tagline**: Turning daily study reflections into personalized, adaptive learning actions, calibrated metacognition, and dynamic knowledge graphs.

---

## 1. 📌 Problem Statement

Students spend hundreds of hours studying, yet fail exams or struggle on projects due to the **illusion of competence**. When reviewing lecture slides or watching coding tutorials, the human brain confuses passive familiarity with deep conceptual understanding. Students enter exams with inflated confidence, only to discover fatal misunderstandings too late.

Furthermore, conventional generative AI tools act like **passive answer dispensers**: they generate code or write essays for the student, bypassing the productive cognitive friction required to actually learn. Students are left dependent on chatbots, with no understanding of *how* they learn or where their foundational gaps lie.

---

## 2. 💡 Solution

**Cati SRL** is an intelligent AI companion designed around **Self-Regulated Learning (SRL)** principles. Instead of doing homework for the student, Cati acts as an objective metacognitive mirror.

Through a tight, closed-loop learning cycle:
1. **Reflect**: The student logs a 2-minute reflection on what they studied and rates their confidence (1–5).
2. **Calibrate**: Google Gemini analyzes the text, extracts granular concepts, detects misconceptions with verbatim quotes, and flags metacognitive gaps (`aligned`, `overconfident`, `underconfident`).
3. **Visualize**: Concepts are placed on an interactive personal **Knowledge Map** with prerequisite dependencies and color-coded mastery.
4. **Adaptive Review**: The system generates 3 targeted practice questions focused directly on the weakest prerequisite.
5. **Micro-Quest**: Cati delivers a single 5–15 minute actionable quest to cement understanding before the student moves forward.
6. **Progress**: Mastery updates deterministically (+0.15 / -0.10), awarding XP and advancing daily streaks.

---

## 3. ✨ Key Features

- **Daily Reflection Journal (`/journal/new`)**: Clean interface with STEM subject tagging, structured prompts, a 1–5 confidence slider, and a 1-click demo button.
- **AI Metacognitive Calibration (`/insights/[entryId]`)**: Deep analysis detecting overconfidence and underconfidence, with exact quotes cited as evidence.
- **Interactive Knowledge Map (`/knowledge-map`)**: Dynamic SVG graph with prerequisite directed edges and mastery status (Green = Mastered, Yellow = Developing, Red = Weak, Gray = New).
- **Adaptive Spaced Review (`/review`)**: 3-question micro-reviews targeting the weakest prerequisites with instant conceptual AI evaluation.
- **Deterministic Mastery Engine**: Spaced repetition schedule recalculation based on explicit pedagogical rules (+0.15 correct, +0.08 partial, -0.10 incorrect).
- **Targeted Micro-Quests (`/quests/[questId]`)**: Personalized 5–15 minute quests with actionable task checklists (Read, Practice, Explain, Review) and anti-duplicate XP safeguards.
- **Command Center Dashboard (`/dashboard`)**: Metacognitive snapshot featuring active quest cards, review backlogs, streak counters, and recent reflections.
- **Lightweight Onboarding Tour**: 3-step introduction modal explaining the SRL loop with persistent local storage dismissals.
- **Zero-Config Demo Mode**: 100% testable out-of-the-box without requiring external database setup.

---

## 4. 🧠 AI Architecture

```
[Student Reflection + Confidence Rating]
                    │
                    ▼
[Next.js Server API: /api/analyze-journal]
                    │
                    ▼
[Google Gemini API (gemini-2.5-flash / gemini-3.8-flash)]
  - System Prompt: Metacognitive SRL Specialist
  - Strict JSON Mode Output
  - Schema Constraints: Extracted Concepts, Misconceptions, Evidence Quotes, Inferred Confidence
                    │
                    ▼
[Zod Schema Validation & Sanitization]
                    │
                    ▼
[Knowledge Graph Upsert & Mastery Engine]
  - PostgreSQL concepts, learner_concepts, concept_relations
  - Local Storage Resilience Mirror
                    │
                    ▼
[Adaptive Review Generation: /api/generate-review]
  - Selects lowest mastery prerequisite
  - Generates 3 tiered questions (Easy, Medium, Hard)
                    │
                    ▼
[Micro-Quest Generator: /api/quests/active]
  - Formulates 2-4 actionable micro-tasks (read, practice, explain, review)
  - Enforces 1 active quest rule
```

---

## 5. 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Validation**: [Zod v4](https://zod.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **AI Models**: Google Gemini via `@google/genai`
- **Hosting & Deployment**: [Vercel](https://vercel.com/)

---

## 6. 🚀 Local Setup Instructions

### Prerequisites
- Node.js 20+ installed
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/dulch29/cati-srl.git
cd cati-srl

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 7. 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

> **Note on Demo Resiliency**: If external credentials are not supplied, Cati SRL automatically falls back to its internal in-memory and local-storage mirror. All features—including journal analysis, knowledge graph visualization, adaptive review, and quest completion—remain fully interactive.

---

## 8. 🎬 2-Minute Demo Walkthrough

Use the canonical test reflection to demonstrate Cati SRL:

1. **Start**: Navigate to `/journal/new`.
2. **1-Click Auto-Fill**: Click **"Auto-fill Demo Case (Python Recursion)"** (or open `/journal/new?sample=recursion`).
   - *Content*: *"Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error."*
   - *Confidence Slider*: Set to **4 / 5**.
3. **Analyze**: Click **"Analyze Reflection"**.
   - Note the **Metacognitive Gap Badge**: `Misaligned (Overconfident)`.
   - Note the detected misconception: *"Uncertainty regarding where to place the base case."*
4. **Knowledge Map**: Click **"View Knowledge Map"** (`/knowledge-map`).
   - Observe `base case` highlighted in **Red** as a weak prerequisite to `recursion`.
5. **Adaptive Review**: Click **"Start Review"** (`/review`).
   - Answer 3 targeted questions on base cases.
   - Observe instant conceptual feedback and mastery increase from Red to Yellow.
6. **Micro-Quest**: Open **Dashboard** (`/dashboard`) and click into the active quest: *"Tame the Base Case"*.
   - Check off the actionable tasks and click **"Claim XP & Complete Quest"**.
   - Confirm XP award (+75 XP) and streak increment.

---

## 9. 💡 What Cati SRL Demonstrates

1. **Metacognitive Calibration over Chatbot Answers**: Rather than solving problems for the student, Cati acts as an intelligent mirror detecting overconfidence and underconfidence relative to actual comprehension.
2. **Dynamic Knowledge Graphs**: Instead of treating subjects as disjointed flashcards, Cati organizes knowledge into prerequisite trees where weak foundations trigger proactive remediation.
3. **Actionable Micro-Interventions**: Converts abstract study guilt into specific 10-minute micro-quests with clear completion criteria.

---

## 10. 🗺️ Future Roadmap

- **FSRS-5 Spaced Repetition**: Replace fixed-interval scheduling with the Free Spaced Repetition Scheduler algorithm.
- **Syllabus & Lecture Ingestion**: Auto-generate personalized Knowledge Maps from uploaded PDF course outlines.
- **Voice Metacognition**: Multimodal voice reflections using Gemini Live to analyze acoustic confidence and hesitation markers.
- **Peer Explanation Exchange**: Students validate their mastery by teaching and critiquing peer explanations anonymously.

---

## 11. 🏆 Hackathon Submission Notes

- **Submission Documents**: Comprehensive submission assets are located in [`docs/submission/`](docs/submission/):
  - [`devpost-description.md`](docs/submission/devpost-description.md)
  - [`demo-script.md`](docs/submission/demo-script.md)
  - [`architecture.md`](docs/submission/architecture.md)
  - [`features.md`](docs/submission/features.md)
  - [`future-roadmap.md`](docs/submission/future-roadmap.md)
  - [`testing-notes.md`](docs/submission/testing-notes.md)
- **Zero Exposed Secrets**: All API keys and database service keys are strictly server-side.
- **Type Safety**: Verified clean compilation with `npx tsc --noEmit` and `npm run lint`.

---

## 📄 License

MIT License • Built for the Next Byte Hacks V5 Hackathon.
