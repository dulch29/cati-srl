# Cati SRL Future Roadmap

> **Product**: Cati SRL (AI Self-Regulated Learning Companion)  
> **Mission**: Transforming passive studying into metacognitively calibrated, self-directed mastery.

---

## 1. Near-Term Horizon (Next 3–6 Months)

### A. FSRS-5 Spaced Repetition Algorithm
- Transition from the current 3-tier deterministic interval model (+0.15 / -0.10) to the **Free Spaced Repetition Scheduler (FSRS-5)**.
- Models stability ($S$), difficulty ($D$), and retrievability ($R$) per concept node to compute mathematically optimal review intervals for each student's unique forgetting curve.

### B. Course Syllabus & Notes Ingestion
- Allow students to upload PDF or Markdown course syllabi, lecture slides, or textbook chapter outlines.
- Automatically extract domain-specific concept dependency trees (DAGs) and seed custom Knowledge Maps tailored to their exact university or high-school courses.

### C. Voice Journaling & Audio Metacognition
- Support 60-second spoken reflections at the end of study sessions using Gemini Live / multimodal audio.
- Detect cognitive hesitation, uncertainty markers, and vocal confidence to further calibrate metacognitive gap analysis.

---

## 2. Mid-Term Horizon (6–12 Months)

### A. Calibrated Peer-Explanation Exchange
- Students who master a concept (e.g., base cases) review anonymized short explanations submitted by peers struggling with the same concept.
- Promotes the **Protege Effect** (learning by teaching) and validates conceptual grasp through collaborative critique.

### B. Multi-Modal Code & Diagram Reasoning
- Support uploading handwritten diagrams (e.g., call stack drawings, recursion trees, memory layout sketches) during journal entries and review questions.
- Gemini 2.5/3.8 multimodal analysis to diagnose visual and structural misunderstandings in student sketches.

### C. IDE & Editor Plugins (VS Code, Cursor, JetBrains)
- Lightweight extension that prompts for a 60-second reflection when closing an IDE workspace or completing a coding assignment.
- Directly connects real coding behavior to the student's personal Knowledge Map.

---

## 3. Long-Term Vision (Beyond 1 Year)

### A. Lifelong Metacognitive Portfolio
- An open, exportable Knowledge Graph representing a learner's verified conceptual understanding across their entire academic and professional career.
- Replace static resumes with dynamic, evidence-backed proof of conceptual mastery.

### B. Institutional & Educator Analytics (Opt-In)
- Aggregated, anonymized cohort insight reports for teachers showing class-wide prerequisite bottlenecks (e.g., *"78% of students studying Recursion are stalled on Base Case placement"*), enabling professors to adjust lecture time dynamically.

---

## What We Deliberately Will NOT Build
To preserve user trust and psychological safety, Cati SRL will never implement:
- ❌ **Webcam surveillance or gaze tracking**
- ❌ **Public high-score leaderboards that induce toxic anxiety**
- ❌ **Passive AI essay or code generation that bypasses student learning**
