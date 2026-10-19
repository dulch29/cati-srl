# Cati SRL Feature Directory

> **Product**: Cati SRL (AI Self-Regulated Learning Companion)  
> **Hackathon Track**: AI in Education / Next Byte Hacks V5  
> **Philosophy**: Self-Regulated Learning (SRL) — Helping students understand *how* they learn, not just *what* they learn.

---

## 1. Daily Study Reflection (`/journal/new`)

- **Structured Metacognitive Prompts**: Guided text area helping students express what they studied, what clicked, and where they experienced confusion.
- **Subject & Topic Tagging**: Clean dropdowns and inputs for organizing reflections across STEM subjects.
- **1–5 Confidence Calibration Slider**: Visual rating from *"Completely Lost"* (1) to *"Can Teach This to Others"* (5) to capture self-perception before AI calibration.
- **1-Click Demo Pre-Fill**: Single-click button allowing judges to instantly populate the canonical Python Recursion test case without typing.
- **Real-Time Client Validation**: Character counters and validation ensuring non-trivial, meaningful reflections.

---

## 2. AI Metacognitive Calibration & Insights (`/insights/[entryId]`)

- **Concept Decomposition**: Automatically extracts core concepts from free-form reflection text and maps them to canonical subject areas.
- **Verbatim Misconception Detection**: Flags specific conceptual misunderstandings and validates them against verbatim quotes from the student's own writing.
- **Metacognitive Gap Analysis**:
  - Compares self-assessed confidence with evidence-backed inferred confidence.
  - Classifies alignment as **Aligned**, **Misaligned (Overconfident)**, or **Misaligned (Underconfident)**.
- **Actionable Next Best Step**: Recommends immediate remedial actions (e.g., *"Focus on Base Case before continuing Tree Traversals"*).
- **Direct Navigation CTAs**: Direct buttons to *"Start Adaptive Review"* and *"View Knowledge Map"*.

---

## 3. Interactive Knowledge Map (`/knowledge-map`)

- **Dynamic Visual Graph**: SVG and CSS rendered network of concept nodes with directed prerequisite arrows.
- **Mastery Color Hierarchy**:
  - 🟢 **Green (Mastered / $\ge 0.75$)**: Solid conceptual understanding with low review urgency.
  - 🟡 **Yellow (Developing / $0.40 - 0.74$)**: Emerging understanding; needs reinforcement.
  - 🔴 **Red (Weak / $< 0.40$)**: Active misconception or failed prerequisite; priority review target.
  - ⚪ **Gray (New / Unassessed)**: Recently introduced concepts.
- **Interactive Concept Inspector**: Clicking any node opens a side panel displaying current mastery percentage, prerequisite dependencies, review status, and direct practice links.
- **Prerequisite Dependency Validation**: Graph topology ensures foundational bottlenecks (e.g., *base cases*) are highlighted when higher-level concepts (e.g., *recursion*) struggle.

---

## 4. Adaptive Spaced Review Engine (`/review`)

- **Weakest Prerequisite Targeting**: Prioritizes concepts with the lowest mastery scores or overdue review schedules.
- **3-Question Micro-Sessions**: Keeps review sessions tight, low-friction, and cognitively manageable (under 5 minutes).
- **Graded Cognitive Difficulty**: Progressive question sequence (Easy ➔ Medium ➔ Hard) testing recall, code comprehension, and conceptual explanation.
- **Instant AI Conceptual Evaluation**: Evaluates answers for conceptual soundness rather than brittle string matching, providing constructive, encouraging feedback.
- **Deterministic Mastery Recalibration**:
  - **Correct**: $+0.15$ mastery delta, review interval doubled.
  - **Partially Correct**: $+0.08$ mastery delta, interval maintained.
  - **Incorrect**: $-0.10$ mastery delta, review interval reset to 1 day.
- **Session Summary Screen**: Displays updated concept masteries, XP earned, and links back to the Knowledge Map and Quests.

---

## 5. Micro-Quest System (`/quests/[questId]`)

- **Personalized Generation**: Automatically generates a targeted quest based on the student's weakest concept or detected misconception.
- **1 Active Quest Rule**: Prevents cognitive overload by allowing only one active quest at a time.
- **Time-Boxed Design**: Completable in 5–15 minutes.
- **Actionable Task Types**:
  - 📖 **Read**: Review targeted reference material or documentation.
  - 💻 **Practice**: Implement a specific code snippet or trace an execution path.
  - 🗣️ **Explain**: Verbalize or write down the reasoning behind a concept.
  - 🔄 **Review**: Verify understanding through active recall.
- **Interactive Checklist**: Real-time progress bar that dynamically updates as tasks are checked off.
- **Anti-Cheat & Reward Engine**: Validates task completion before awarding XP, preventing duplicate XP claims on repeat submissions.

---

## 6. Progression, XP & Daily Streaks

- **XP Progression**: Points awarded for completing journal reflections, answering review questions, and finishing quests.
- **Daily Streak Tracking**: Calendar-aware streak counter encouraging consistent daily reflection habits.
- **Level Calibration**: Dynamic level calculation based on cumulative XP earned.

---

## 7. Command Center Dashboard (`/dashboard`)

- **Metacognitive Snapshot**: Displays current daily streak, total XP, and due review count.
- **Active Quest Card**: Highlights today's quest with difficulty badge, estimated time, reward XP, progress bar, and a direct "Continue Quest" button.
- **Empty State Guidance**: Clear instructions ("Complete a journal entry or review to unlock your next quest") with direct CTAs.
- **Recent Journal History**: Quick access to past reflections and metacognitive insights.

---

## 8. Onboarding & Demo Resilience

- **3-Step Introduction Modal**: Minimalist guide explaining:
  1. *Write a short study journal after studying.*
  2. *Cati identifies what's clear and flags confidence blindspots.*
  3. *Complete adaptive reviews and quests to strengthen weak concepts.*
- **Zero-Setup Demo Mode**: Allows judges to evaluate all features with full simulated auth, AI analyses, and knowledge graph updates even without connecting external database credentials.
