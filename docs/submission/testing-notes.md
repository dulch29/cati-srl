# Cati SRL Testing Notes & Verification Guide

> **For Hackathon Judges & Evaluators**  
> **Hackathon**: Next Byte Hacks V5  
> **Tested On**: Node.js v20+, Next.js 16 (App Router), Windows 11 / macOS / Linux

---

## 1. Quick Start Guide (Zero-Config Demo)

Cati SRL is designed to be **instantly testable** with zero friction:

### Option A: 1-Click Demo Mode (Fastest)
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.
4. Click **"Try Demo Mode"** on the landing page or login page. This creates a demo session immediately without requiring Supabase or sign-up.

---

## 2. Environment Variables (Full Cloud Mode)

To enable live Google Gemini AI calls and Supabase cloud persistence, configure `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key
```

> **Note on Resiliency**: If any external API keys are missing or experience rate limits, Cati SRL's fail-safe local store automatically activates. The application will never crash or show broken UI during your evaluation.

---

## 3. The 2-Minute Judge Evaluation Walkthrough

Follow these steps to experience the complete Self-Regulated Learning loop:

### Step 1: Guided Onboarding
- Upon entering the app, observe the 3-step introduction modal explaining the SRL philosophy:
  1. *Daily study reflection*
  2. *Metacognitive calibration*
  3. *Adaptive review and micro-quests*
- Click **"Get Started"** to land on `/journal/new`.

### Step 2: The Canonical Test Reflection
- Click the top purple button: **"Auto-fill Demo Case (Python Recursion)"** or navigate to `http://localhost:3000/journal/new?sample=recursion`.
- Observe the pre-filled reflection:
  > *"Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error."*
- Notice the **Confidence Slider** is pre-set to **4 / 5**.
- Click **"Analyze Reflection"**.

### Step 3: Metacognitive Calibration (`/insights/[id]`)
- Verify the following diagnostic results:
  - **Metacognitive Gap Badge**: Displays `Misaligned (Overconfident)`.
  - **Detected Misconception**: Flags placement/role of the base case in recursion with verbatim quote evidence.
  - **Identified Concepts**: Recursion (developing) and Base Case (weak).
- Click **"View Knowledge Map"**.

### Step 4: Knowledge Map Verification (`/knowledge-map`)
- Observe the interactive visual graph:
  - `Base case` node is highlighted in **Red** (Mastery < 0.40).
  - `Recursion` node is in **Yellow** (Mastery 0.50).
  - A directed dependency arrow indicates `Base case` is a prerequisite to `Recursion`.
- Click on the `Base case` node to view its drawer and details.

### Step 5: Adaptive Review (`/review`)
- Click **"Start Review"** in the top navigation or from the Knowledge Map.
- Answer the 3 targeted questions focusing directly on the base case:
  - Type in your answer or test with: *"The base case terminates recursion to prevent infinite loops."*
- Notice instant conceptual AI feedback (+15 XP for correct answers).
- Complete the review to see the concept mastery increase to **Yellow**.

### Step 6: Micro-Quest Completion (`/quests/[questId]`)
- Return to the **Dashboard** (`/dashboard`).
- View the **Active Quest Card**: *"Tame the Base Case"* (+75 XP).
- Click **"Continue Quest"** to open `/quests/[questId]`.
- Check off the actionable tasks (Read, Practice, Explain, Review).
- Click **"Claim XP & Complete Quest"**.
- Confirm that:
  - Total XP increases by +75 XP.
  - Streak increments.
  - A celebration screen appears with links to the next study cycle.

---

## 4. Code Quality & Verification Commands

You can verify code quality and type safety using the standard npm scripts:

### TypeScript Check
```bash
npx tsc --noEmit
```
*Expected result: 0 errors.*

### ESLint Check
```bash
npm run lint
```
*Expected result: 0 errors, 0 warnings.*

---

## 5. Security & Edge Case Handling Verified

- [x] **No hardcoded secrets**: All API keys are loaded via server-side environment variables.
- [x] **Strict Input/Output validation**: All API endpoints enforce Zod parsing on requests and responses.
- [x] **Anti-duplicate XP exploit**: Quests cannot be repeatedly completed for infinite XP.
- [x] **Safe empty states**: Dashboard and Review gracefully handle zero-data scenarios.
- [x] **Mobile responsive**: Layout and graph scale smoothly to smartphone and tablet screens.
