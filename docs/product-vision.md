# Cati SRL: Product Vision

## 1. The Problem

Most students know **what** they need to study, but they don't know **how they actually learn**.

Current educational technology suffers from two major flaws:

1. **Generic AI Chatbots**: Large language models act as answer dispensers rather than educational coaches. They produce instant answers that give students an illusion of competence without promoting genuine cognitive retention or self-regulation.
2. **The Illusion of Competence (Metacognitive Blindspots)**: Students frequently rate their understanding as high simply because they re-read notes or watched a video, only to discover severe misconceptions during exams. They lack an objective mirror comparing what they _think_ they know against the evidence of their reasoning.

## 2. Target User

- **High-school and early university students** studying STEM subjects (such as Computer Science, Mathematics, and Physics) who study independently.
- Independent learners seeking to build consistency, genuine mastery, and structured study habits without burning out.

## 3. The Core Loop

Cati SRL transforms the passive study routine into an adaptive, self-regulated cycle:

```
[1. Study Session]
       │
       ▼
[2. Daily Journal Reflection] ──► Student logs concepts and rates confidence (1-5)
       │
       ▼
[3. AI Metacognitive Calibration] ──► Compares self-rating vs. evidence; extracts concepts
       │
       ▼
[4. Knowledge Graph Update] ──► Real-time mastery scores (Red / Yellow / Green)
       │
       ▼
[5. Adaptive Spaced Review] ──► Exactly 3 targeted questions on weakest prerequisites
       │
       ▼
[6. Mastery & Quest Reward] ──► Mastery adjustment, XP gain, streak maintenance, micro-quest
```

## 4. MVP Scope (Next Byte Hacks V5)

### Included in MVP:

- **Supabase Authentication**: Secure email/password login and sign-up with Row Level Security.
- **"Today" Command Center**: Real-time streak tracking, XP counter, review backlog count, and today's recommended quest.
- **New Journal Reflection**: Subject, topic, structured reflection prompt, and 1-5 confidence slider.
- **AI Metacognitive Analysis**: Strict JSON extraction of concepts, misconceptions with evidence, and confidence gap classification (`aligned`, `overconfident`, `underconfident`).
- **Learner Knowledge Graph**: Nodes representing concepts, directed edges representing prerequisite relations, and color-coded mastery.
- **Adaptive 3-Question Practice**: Progressive difficulty targeted at the weakest prerequisites.
- **Deterministic Mastery Engine**: Spaced repetition rules (+0.15 correct, -0.10 incorrect, lapse decay) and interval recalculation.
- **Micro-Quest System**: Actionable 15-minute quests with checklist tasks.

### Explicitly Excluded (Out of Scope for MVP):

- Camera-based distraction or gaze detection
- 3D / AR pets or heavy virtual worlds
- Public social networks or competitive leaderboards
- Google Classroom or LMS syncing
- Voice input / speech processing
- Multi-tenant school administration portals

## 5. Future Roadmap

- **Phase 2**: Activation of live AI streaming endpoints (`@google/genai` Gemini 2.5 Flash), automated knowledge graph sync, and instant quiz grading.
- **Phase 3**: Metacognitive growth trends and calibration history graphs (tracking how a student's self-accuracy improves over time).
- **Phase 4**: Intelligent prerequisite tree auto-discovery (AI automatically generates prerequisite relationship graphs for any new subject).
- **Phase 5**: Canvas LMS and Anki export integrations for advanced spaced repetition power users.
