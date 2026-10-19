import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/database";
import { EvaluationResult } from "@/lib/ai/schemas/review";
import {
  isSupabaseConfigured,
  getLocalUserProfile,
  updateLocalUserProfile,
} from "@/lib/supabase/local-store";

export interface XpStreakResult {
  xpAwarded: number;
  newTotalXp: number;
  currentStreak: number;
  isNewDayActive: boolean;
}

/**
 * Calculates XP points for an answer:
 * - correct: +15 XP
 * - partially_correct: +8 XP
 * - incorrect: +3 XP
 * - isSessionCompletion: +10 bonus XP
 */
export function calculateXpGain(
  result: EvaluationResult,
  isSessionCompletion = false
): number {
  let xp = 0;
  if (result === "correct") {
    xp = 15;
  } else if (result === "partially_correct") {
    xp = 8;
  } else if (result === "incorrect") {
    xp = 3;
  }

  if (isSessionCompletion) {
    xp += 10;
  }

  return xp;
}

/**
 * Updates a user's XP and calculates daily streak according to SRL rules.
 */
export async function awardXpAndCalibrateStreak(
  supabase: SupabaseClient<Database>,
  userId: string,
  result: EvaluationResult,
  isSessionCompletion = false
): Promise<XpStreakResult> {
  const xpAwarded = calculateXpGain(result, isSessionCompletion);

  // Today and yesterday strings (YYYY-MM-DD)
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const yestDate = new Date();
  yestDate.setDate(yestDate.getDate() - 1);
  const yesterday = yestDate.toISOString().split("T")[0];

  let currentXp = 275;
  let currentStreak = 1;
  let lastActiveDate: string | null = null;

  // 1. Fetch profile from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: profile } = await supabase
        .from("users_profile")
        .select("xp, streak, last_active_date")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        currentXp = Number(profile.xp) || 0;
        currentStreak = Number(profile.streak) || 0;
        lastActiveDate = profile.last_active_date;
      }
    } catch {
      // fallback
    }
  } else {
    const localProfile = getLocalUserProfile(userId);
    currentXp = localProfile.xp;
    currentStreak = localProfile.streak;
    lastActiveDate = localProfile.last_active_date;
  }

  // 2. Calibrate streak:
  // - If last_active_date is yesterday: streak += 1
  // - If last_active_date is today: keep streak unchanged
  // - Otherwise: reset streak to 1
  let newStreak = currentStreak;
  let isNewDayActive = false;

  if (lastActiveDate === today) {
    newStreak = currentStreak === 0 ? 1 : currentStreak;
  } else if (lastActiveDate === yesterday) {
    newStreak = currentStreak + 1;
    isNewDayActive = true;
  } else {
    // missed a day or initial
    newStreak = 1;
    isNewDayActive = true;
  }

  const newTotalXp = currentXp + xpAwarded;

  // 3. Save to Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("users_profile")
        .update({
          xp: newTotalXp,
          streak: newStreak,
          last_active_date: today,
        })
        .eq("id", userId);
    } catch (err) {
      console.warn("[XP Streak] Failed updating Supabase profile:", err);
    }
  }

  // 4. Mirror to local store
  updateLocalUserProfile(userId, {
    xp: newTotalXp,
    streak: newStreak,
    last_active_date: today,
  });

  return {
    xpAwarded,
    newTotalXp,
    currentStreak: newStreak,
    isNewDayActive,
  };
}

/**
 * Directly awards a specific XP amount and calibrates streak on activity (e.g., Quest completion).
 */
export async function awardDirectXpAndCalibrateStreak(
  supabase: SupabaseClient<Database>,
  userId: string,
  xpAmount: number
): Promise<XpStreakResult> {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const yestDate = new Date();
  yestDate.setDate(yestDate.getDate() - 1);
  const yesterday = yestDate.toISOString().split("T")[0];

  let currentXp = 275;
  let currentStreak = 1;
  let lastActiveDate: string | null = null;

  if (isSupabaseConfigured()) {
    try {
      const { data: profile } = await supabase
        .from("users_profile")
        .select("xp, streak, last_active_date")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        currentXp = Number(profile.xp) || 0;
        currentStreak = Number(profile.streak) || 0;
        lastActiveDate = profile.last_active_date;
      }
    } catch {
      // fallback
    }
  } else {
    const localProfile = getLocalUserProfile(userId);
    currentXp = localProfile.xp;
    currentStreak = localProfile.streak;
    lastActiveDate = localProfile.last_active_date;
  }

  let newStreak = currentStreak;
  let isNewDayActive = false;

  if (lastActiveDate === today) {
    newStreak = currentStreak === 0 ? 1 : currentStreak;
  } else if (lastActiveDate === yesterday) {
    newStreak = currentStreak + 1;
    isNewDayActive = true;
  } else {
    newStreak = 1;
    isNewDayActive = true;
  }

  const newTotalXp = currentXp + xpAmount;

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("users_profile")
        .update({
          xp: newTotalXp,
          streak: newStreak,
          last_active_date: today,
        })
        .eq("id", userId);
    } catch (err) {
      console.warn("[XP Streak] Failed updating Supabase profile:", err);
    }
  }

  updateLocalUserProfile(userId, {
    xp: newTotalXp,
    streak: newStreak,
    last_active_date: today,
  });

  return {
    xpAwarded: xpAmount,
    newTotalXp,
    currentStreak: newStreak,
    isNewDayActive,
  };
}
