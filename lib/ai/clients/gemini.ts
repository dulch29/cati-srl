import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

let geminiClientInstance: GoogleGenAI | null = null;

function resolveGeminiApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    return process.env.GEMINI_API_KEY.trim();
  }
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
      if (match && match[1] && match[1].trim() !== "" && match[1].trim() !== "your-gemini-api-key-here") {
        return match[1].trim();
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

/**
 * Returns a singleton instance of the official Google GenAI client.
 * Strictly runs on the server; never import or call from client components.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = resolveGeminiApiKey();

  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please supply a valid Google Gemini API key in your environment variables (.env.local)."
    );
  }

  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({ apiKey });
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
  const primaryModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const fallbackModels = ["gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

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
