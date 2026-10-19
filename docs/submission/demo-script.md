# Cati SRL: 2-Minute Demo Script

> **Hackathon**: Next Byte Hacks V5  
> **Target Video / Pitch Length**: 2 Minutes (120 Seconds)  
> **Core Theme**: Self-Regulated Learning (SRL) — Moving from passive chatbot answering to active metacognitive calibration.

---

## Script Timeline & Screen Actions

```
[0:00 - 0:15] The Metacognitive Problem
[0:15 - 0:35] The Solution: Cati SRL Closed Loop
[0:35 - 1:10] Step 1: Journal → AI Metacognitive Calibration → Knowledge Map
[1:10 - 1:40] Step 2: Adaptive Review & Deterministic Mastery Recalibration
[1:40 - 2:00] Step 3: Actionable Micro-Quest, XP Progression & Vision
```

---

### [0:00 – 0:15] Act I: The Problem (Hook)

**Screen**: Camera on presenter or landing page of Cati SRL (`/`).

**Spoken Dialogue**:
> "Students spend hundreds of hours studying, yet fail exams because of the **illusion of competence**: re-reading notes makes them feel confident, even when critical misconceptions remain hidden.  
> Meanwhile, generic AI chatbots act as answer dispensers—feeding students shortcuts that bypass the actual cognitive effort required to learn."

---

### [0:15 – 0:35] Act II: The Solution & The SRL Loop

**Screen**: Fast cut to Cati SRL Dashboard (`/dashboard`). Point out the **Streak Counter**, **Active Quest**, and **Review Backlog**.

**Spoken Dialogue**:
> "Meet **Cati SRL**—an AI Self-Regulated Learning companion.  
> Cati doesn't do your homework for you. Instead, it mirrors how you think.  
> Through a tight 5-step loop—**Journal reflection**, **metacognitive AI analysis**, **a personal Knowledge Graph**, **adaptive spaced review**, and **actionable quests**—Cati turns daily reflections into measurable mastery."

---

### [0:35 – 1:10] Act III: Journal Reflection → AI Insight → Knowledge Map

**Screen**:
1. Click **"New Reflection"** (`/journal/new`).
2. Click **"Auto-fill Demo Case (Python Recursion)"** or paste:
   - *Subject*: Computer Science
   - *Topic*: Python Recursion
   - *Reflection*: *"Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error."*
   - *Confidence Slider*: Set to **4 / 5**.
3. Click **"Analyze Reflection"**. (Show smooth loading state with reassuring status text).
4. Land on **Insights Page** (`/insights/[entryId]`). Highlight the **Metacognitive Gap Badge**: `Misaligned (Overconfident)`.
   - Point to the detected misconception: *"Confusion regarding placement and role of base case in recursion."*
5. Click **"View Knowledge Map"** (`/knowledge-map`).
   - Show the dynamic interactive graph:
     - `recursion` node (Yellow / Developing)
     - `base case` node (Red / Needs Attention)
     - Prerequisite relation: `base case` ➔ prerequisite to `recursion`.

**Spoken Dialogue**:
> "Let's test our demo student. They rate their confidence as 4 out of 5 on Python recursion, but admit their factorial code crashed because they weren't sure where to place the base case.  
> Instantly, Gemini AI detects a **metacognitive misalignment**: the student is overconfident! Cati isolates the exact bottleneck: **Base Case**.  
> Opening the Knowledge Map, Cati shows 'base case' in red as a critical unmastered prerequisite. The student's blindspot is now completely visible."

---

### [1:10 – 1:40] Act IV: Adaptive Review & Mastery Recalibration

**Screen**:
1. Navigate to **Adaptive Review** (`/review`).
2. The system serves exactly 3 questions targeted directly at the weakest prerequisite (`base case` in recursion):
   - Question 1 (Easy): Identifying the base case condition.
   - Type an explanation: *"The base case is `if n <= 1: return 1` to prevent infinite recursion."*
   - Click **Submit Answer**. Instant AI evaluation shows **Correct (+15 XP)** with constructive feedback.
   - Question 2 & 3: Submit answers.
3. Complete session. Note the updated mastery scores: `base case` shifts from 0.20 to 0.50 (Yellow).
4. Show XP gain and daily streak increment notification.

**Spoken Dialogue**:
> "Cati immediately generates an adaptive 3-question review targeting that exact prerequisite.  
> As we answer, Cati's deterministic mastery engine updates: correct answers increase concept mastery by +0.15, while incorrect answers penalize and schedule earlier spaced repetition intervals.  
> No generic quizzes—every question directly repairs the student's identified misconception."

---

### [1:40 – 2:00] Act V: Micro-Quest, XP Progression & Future Vision

**Screen**:
1. Click **"Continue to Quest & Dashboard"** (`/dashboard`).
2. Show the newly unlocked personalized quest card:
   - *Title*: *"Tame the Base Case"*
   - *Estimated Time*: 10 minutes | *Reward*: +75 XP
   - *Tasks*: Read base-case documentation, trace factorial call stack, explain termination criteria.
3. Click into **Quest Detail** (`/quests/[questId]`). Check off tasks, click **"Claim XP & Complete Quest"**.
4. Show celebration state, +75 XP award, and updated level/streak.

**Spoken Dialogue**:
> "Finally, Cati generates a 10-minute micro-quest: actionable, bite-sized tasks to solidify the base case. Completing tasks awards XP, boosts streaks, and schedules the next review.  
> By bridging reflection, metacognitive calibration, and adaptive practice, Cati SRL transforms study anxiety into true mastery.  
> Thank you!"

---

## Judge Demo Checklist (Under 2 Minutes)

- [ ] **Clean state**: Fresh login or pre-seeded demo user with 0 or 1 journal entry.
- [ ] **1-Click Demo Input**: Use `/journal/new?sample=recursion` or the top banner button.
- [ ] **Visual Clarity**: High-contrast dark mode, clear typography, no visual clutter.
- [ ] **Deterministic Results**: Weak concept ("base case") appears red on the map, review questions focus on base cases, quest focuses on base cases.
- [ ] **No Dead Ends**: Every screen offers an explicit "What to do next" action button.
