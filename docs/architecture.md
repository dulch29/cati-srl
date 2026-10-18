# Cati SRL System Architecture

```
+-------------------------------------------------------------------------+
|                                CLIENT                                   |
|  Next.js 15 App Router (React 19, TypeScript, Tailwind CSS, Lucide)     |
|                                                                         |
|  - /login           (Supabase Auth & 1-click Demo mode)                 |
|  - /dashboard       (Today's command center: Streak, XP, Quests)        |
|  - /journal/new     (Reflection editor + Confidence slider 1-5)         |
|  - /insights/[id]   (Metacognitive calibration & Concept breakdown)     |
|  - /review          (Adaptive 3-question SRS practice session)          |
|  - /knowledge-map   (Interactive concept graph colored by mastery)      |
+------------------------------------+------------------------------------+
                                     |
                                     v  HTTPS / Server Actions
+------------------------------------+------------------------------------+
|                             NEXT.JS API                                 |
|  - POST /api/analyze-journal  (Extracts concepts & detects misconceptions)
|  - POST /api/generate-review  (Creates 3 targeted questions from weakest)
|  - POST /api/evaluate-review  (Computes mastery deltas: +0.15/-0.10)   |
|  - Zod Input & Output Schema Validation Layer                           |
+---------------------+------------------------------+--------------------+
                      |                              |
                      v                              v
+---------------------+-------------+  +-------------+--------------------+
|           SUPABASE / POSTGRES     |  |           AI SERVICE             |
|  - auth.users (Supabase Auth)     |  |  - Google Gemini API / OpenAI    |
|  - users_profile (XP, Streak)     |  |  - Strict JSON Mode Output       |
|  - journal_entries                |  |  - Metacognitive Calibration     |
|  - ai_analyses                    |  |    (Inferred vs Self-Reported)   |
|  - concepts                       |  |  - Concept Extraction            |
|  - learner_concepts (Mastery/SRS) |  |  - Misconception Detection       |
|  - concept_relations (Edges)      |  +----------------------------------+
|  - reviews                        |
|  - quests                         |
|  - Row Level Security (RLS)       |
+---------------------+-------------+
                      |
                      v
+---------------------+---------------------------------------------------+
|                        KNOWLEDGE GRAPH                                  |
|  Nodes: Concepts (Recursion, Base case, Call stack, Functions...)      |
|  Edges: Relationships (requires, related_to)                            |
|  Dynamic Node State: Colored by Mastery                                 |
|    - Red (< 0.4): Weak / Immediate practice needed                      |
|    - Yellow (0.4 - 0.7): Developing                                     |
|    - Green (> 0.7): Strong / Mastered                                   |
+-------------------------------------------------------------------------+
```

## Data Flow Summary

1. **Student Reflection**: Student submits a daily study journal with a self-confidence rating (1 to 5).
2. **AI Analysis Pipeline**: The server validates the journal text and prompts the AI model to extract structured concepts, detect misconceptions with verbatim quotes, assess inferred confidence, and determine the confidence gap.
3. **Knowledge Graph Update**: The concepts and relationships are upserted into PostgreSQL. Each learner-concept pair is tracked with a mastery score (0.0 to 1.0) and spaced review schedule (`review_due`).
4. **Adaptive Practice**: The spaced repetition engine selects the student's 3 weakest concepts and generates adaptive review questions.
5. **Mastery Feedback**: Answers update mastery (+0.15 for correct, +0.05 for partial, -0.10 for incorrect), adjust next review intervals, grant XP, and update streaks.
6. **Targeted Quests**: The system generates actionable micro-quests focused on resolving the student's primary misconception.
