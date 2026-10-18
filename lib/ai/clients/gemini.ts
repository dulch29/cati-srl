import { GoogleGenAI } from "@google/genai";

let geminiClientInstance: GoogleGenAI | null = null;

/**
 * Returns a singleton instance of the official Google GenAI client.
 * Strictly runs on the server; never import or call from client components.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please supply a valid Google Gemini API key in your environment variables (.env.local)."
    );
  }

  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({ apiKey: apiKey.trim() });
  }

  return geminiClientInstance;
}

/**
 * Strips markdown code blocks (e.g. ```json ... ```) to extract raw JSON
 */
export function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Calls the Gemini API to analyze a student's learning reflection.
 * Uses strict JSON generation and graceful fallback across available Gemini models.
 */
export async function callGeminiForAnalysis(prompt: string): Promise<string> {
  const client = getGeminiClient();

  // Primary model preference, configurable via GEMINI_MODEL
  const primaryModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fallbackModels = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.8-flash"];

  const candidateModels = [
    primaryModel,
    ...fallbackModels.filter((m) => m !== primaryModel),
  ];

  let lastError: unknown = null;

  for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1, // Low temperature for consistent metacognitive calibration
        },
      });

      const responseText = response.text;
      if (!responseText || responseText.trim().length === 0) {
        throw new Error(`Empty response returned from Gemini model: ${model}`);
      }

      return cleanJsonText(responseText);
    } catch (err: unknown) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini Client] Execution failed on model ${model}:`, errMsg);

      // If key is invalid or unauthorized, stop attempting other models immediately
      if (
        errMsg.toLowerCase().includes("api key") ||
        errMsg.toLowerCase().includes("unauthorized") ||
        errMsg.includes("401") ||
        errMsg.includes("403")
      ) {
        throw new Error(
          `Gemini API authentication rejected. Please check your GEMINI_API_KEY in .env.local (${errMsg})`
        );
      }
    }
  }

  throw new Error(
    `Gemini API service error: ${lastError instanceof Error ? lastError.message : String(lastError)}`
  );
}
