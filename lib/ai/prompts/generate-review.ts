import { SelectedReviewConcept } from "@/lib/knowledge-graph/select-review-concepts";

interface BuildReviewPromptParams {
  concepts: SelectedReviewConcept[];
}

/**
 * Builds the AI prompt for generating 3 adaptive review questions.
 */
export function buildGenerateReviewPrompt({
  concepts,
}: BuildReviewPromptParams): string {
  const conceptDescriptions = concepts
    .map(
      (c, i) =>
        `${i + 1}. Concept: "${c.name}" (Current Mastery: ${Math.round(c.mastery * 100)}%, Status: "${c.status}"${
          c.recentMisconception
            ? `, Recent Misconception: "${c.recentMisconception}"`
            : ""
        })`
    )
    .join("\n");

  return `You are Cati SRL, an intelligent self-regulated learning (SRL) coach for students.
Your goal is to generate an adaptive 3-question review session targeting the student's weakest or due concepts.

### TARGET CONCEPTS:
${conceptDescriptions}

---

### STRICT JSON SCHEMA:
{
  "questions": [
    {
      "concept": "string (Must exactly match one of the target concepts listed above)",
      "question": "string (Clear, engaging question testing understanding, application, or reasoning)",
      "difficulty": "easy | medium | hard",
      "expected_answer": "string (Concise reference explanation of what a correct answer contains)",
      "explanation": "string (Helpful pedagogical explanation connecting mechanics to the underlying concept)"
    }
  ]
}

---

### CRITICAL RULES:
1. **Exactly 3 Questions**: The "questions" array MUST contain exactly 3 items.
2. **Concept Alignment**: Distribute the 3 questions across the target concepts provided above. If fewer than 3 concepts were provided, allocate multiple questions to the weakest or misconception-flagged concepts.
3. **No Invented Concepts**: Do NOT introduce new concepts outside the target list.
4. **Pedagogical Quality**:
   - Test conceptual understanding, practical application, debugging, or reasoning (e.g. "What happens if a recursive function lacks a base case?", "Why does factorial(-1) trigger a stack overflow?").
   - AVOID trivial rote memorization (e.g. "What year was Python invented?").
   - Use clear language suitable for high-school / introductory university students.
5. **Calibrated Difficulty**:
   - For concepts with mastery < 0.4 or recent misconceptions: use "easy" or "medium" to rebuild foundational confidence.
   - For developing concepts: use "medium" or "hard".
6. **Strict JSON**: Return ONLY the JSON object. Do not include markdown code fences, preambles, or postscripts. Start with { and end with }.`;
}
