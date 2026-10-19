export interface QuestPromptInput {
  targetConcept: {
    name: string;
    mastery: number;
    status: string;
    recentMisconception?: string | null;
    prerequisites?: string[];
  };
  subject?: string;
  recentTopic?: string;
}

/**
 * Builds the AI prompt for generating a personalized, actionable micro-quest.
 */
export function buildGenerateQuestPrompt(input: QuestPromptInput): string {
  const { targetConcept, subject = "General", recentTopic } = input;

  return `You are Cati SRL, an intelligent AI self-regulated learning companion.
Your role is to design a single bite-sized, highly targeted learning quest (micro-quest) to help a high school or introductory college student overcome a specific conceptual weakness or misconception.

TARGET CONCEPT CONTEXT:
- Subject: ${subject}
- Target Concept: "${targetConcept.name}"
- Current Mastery: ${(targetConcept.mastery * 100).toFixed(0)}% (${targetConcept.status})
${recentTopic ? `- Recent Study Topic: "${recentTopic}"` : ""}
${
  targetConcept.recentMisconception
    ? `- Diagnosed Misconception: "${targetConcept.recentMisconception}"`
    : ""
}
${
  targetConcept.prerequisites && targetConcept.prerequisites.length > 0
    ? `- Prerequisite Concepts: ${targetConcept.prerequisites.join(", ")}`
    : ""
}

QUEST DESIGN REQUIREMENTS:
1. Focus specifically on the target concept ("${targetConcept.name}") and any diagnosed misconception.
2. The quest must be completable in 5 to 15 minutes. Set "estimated_time" accordingly (e.g. "10 mins" or "15 mins").
3. Include between 2 and 4 specific, actionable tasks.
4. Each task must belong to one of four pedagogical types:
   - "read": active reading or tracing code / definitions.
   - "practice": hands-on execution (e.g. writing a guard clause, solving a concrete sample).
   - "explain": self-explanation or verbalizing the "why" to detect subtle gaps.
   - "review": testing understanding or checking edge cases.
5. DO NOT generate generic tasks such as "Study more", "Review your notes", or "Watch a video".
   If the target concept is "Base case" in recursion, the tasks must specifically guide identifying, explaining, and implementing base case guardrails (e.g., placing the stopping condition before any self-call).
6. Set "difficulty" to "easy", "medium", or "hard" (recommend "easy" or "medium" for weak concepts).
7. Set "reward_xp" to an integer between 50 and 100 XP (e.g. 75 or 100).
8. Return ONLY a valid JSON object matching the schema below. Do not wrap in markdown \`\`\`json code fences. Do not output any preamble or closing remarks.

REQUIRED JSON FORMAT:
{
  "title": "string (motivating, specific quest title)",
  "reason": "string (clear metacognitive explanation of why this quest matters)",
  "estimated_time": "10 mins",
  "difficulty": "medium",
  "tasks": [
    {
      "id": "task-1",
      "text": "string (concrete action item)",
      "type": "read"
    },
    {
      "id": "task-2",
      "text": "string (concrete action item)",
      "type": "practice"
    },
    {
      "id": "task-3",
      "text": "string (concrete action item)",
      "type": "explain"
    }
  ],
  "reward_xp": 75
}`;
}
