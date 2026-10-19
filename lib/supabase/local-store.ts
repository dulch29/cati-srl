// Cati SRL Local Data Store for demo and offline persistence
import fs from "fs";
import path from "path";
import { JournalAnalysis } from "@/lib/ai/schemas/journal-analysis";

export interface StoredJournalEntry {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  content: string;
  self_confidence: number;
  created_at: string;
}

export interface StoredAiAnalysis {
  id: string;
  journal_entry_id: string;
  main_topic: string | null;
  analysis: JournalAnalysis;
  created_at: string;
}

export interface StoredConcept {
  id: string;
  name: string;
  normalized_name: string;
  subject: string;
  created_at: string;
}

export interface StoredLearnerConcept {
  id: string;
  user_id: string;
  concept_id: string;
  mastery: number;
  status: "strong" | "developing" | "weak" | "new" | string;
  review_due: string | null;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface StoredConceptRelation {
  id: string;
  from_concept_id: string;
  to_concept_id: string;
  relation_type: string;
  created_at: string;
}

export interface StoredReview {
  id: string;
  user_id: string;
  concept_id: string;
  question: string;
  expected_answer: string | null;
  explanation: string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  student_answer: string | null;
  result: "pending" | "correct" | "partially_correct" | "incorrect" | null;
  created_at: string;
}

export interface StoredQuestTask {
  id: string;
  text: string;
  type: "read" | "practice" | "explain" | "review";
  completed: boolean;
}

export interface StoredQuest {
  id: string;
  user_id: string;
  title: string;
  reason: string;
  estimated_time: string;
  difficulty: "easy" | "medium" | "hard";
  tasks: StoredQuestTask[];
  reward_xp: number;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  completed_at?: string | null;
}

export interface StoredUserProfile {
  id: string;
  display_name: string | null;
  xp: number;
  streak: number;
  last_active_date: string | null;
  created_at: string;
}

interface LocalStoreData {
  users_profile: Record<string, StoredUserProfile>;
  journal_entries: Record<string, StoredJournalEntry>;
  ai_analyses: Record<string, StoredAiAnalysis>;
  concepts: Record<string, StoredConcept>;
  learner_concepts: Record<string, StoredLearnerConcept>;
  concept_relations: Record<string, StoredConceptRelation>;
  reviews: Record<string, StoredReview>;
  quests: Record<string, StoredQuest>;
}

const CACHE_FILE = path.join(process.cwd(), ".next", "cati-demo-store.json");

function readStore(): LocalStoreData {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf8");
      const parsed = JSON.parse(raw);
      return {
        users_profile: parsed.users_profile || {},
        journal_entries: parsed.journal_entries || {},
        ai_analyses: parsed.ai_analyses || {},
        concepts: parsed.concepts || {},
        learner_concepts: parsed.learner_concepts || {},
        concept_relations: parsed.concept_relations || {},
        reviews: parsed.reviews || {},
        quests: parsed.quests || {},
      };
    }
  } catch {
    // fallback to empty store
  }
  return {
    users_profile: {},
    journal_entries: {},
    ai_analyses: {},
    concepts: {},
    learner_concepts: {},
    concept_relations: {},
    reviews: {},
    quests: {},
  };
}

function writeStore(data: LocalStoreData): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("[Local Store] Failed to write cache file:", err);
  }
}

/**
 * Checks whether Supabase has been configured with a real, reachable host
 * instead of the default placeholder URL.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (
    !url ||
    url.includes("placeholder-project") ||
    url.includes("your-project") ||
    !anonKey ||
    anonKey.includes("placeholder")
  ) {
    return false;
  }

  return true;
}

// ================= User Profile =================
export function getLocalUserProfile(userId: string): StoredUserProfile {
  const store = readStore();
  if (store.users_profile[userId]) {
    return store.users_profile[userId];
  }
  const defaultProfile: StoredUserProfile = {
    id: userId,
    display_name: "Alex Chen (Demo)",
    xp: 275,
    streak: 3,
    last_active_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  };
  store.users_profile[userId] = defaultProfile;
  writeStore(store);
  return defaultProfile;
}

export function updateLocalUserProfile(
  userId: string,
  updates: Partial<StoredUserProfile>
): StoredUserProfile {
  const store = readStore();
  const current = getLocalUserProfile(userId);
  const updated = { ...current, ...updates };
  store.users_profile[userId] = updated;
  writeStore(store);
  return updated;
}

// ================= Journal Entries =================
export function saveLocalJournalEntry(entry: StoredJournalEntry): void {
  const store = readStore();
  store.journal_entries[entry.id] = entry;
  writeStore(store);
}

export function getLocalJournalEntry(id: string): StoredJournalEntry | null {
  const store = readStore();
  return store.journal_entries[id] || null;
}

export function getLocalJournalEntries(
  userId?: string
): StoredJournalEntry[] {
  const store = readStore();
  const entries = Object.values(store.journal_entries);
  if (userId) {
    return entries
      .filter((e) => e.user_id === userId)
      .sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
  }
  return entries.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
}

// ================= AI Analyses =================
export function saveLocalAiAnalysis(analysisRecord: StoredAiAnalysis): void {
  const store = readStore();
  store.ai_analyses[analysisRecord.journal_entry_id] = analysisRecord;
  writeStore(store);
}

export function getLocalAiAnalysis(
  journalEntryId: string
): StoredAiAnalysis | null {
  const store = readStore();
  return store.ai_analyses[journalEntryId] || null;
}

export function getAllLocalAiAnalyses(): StoredAiAnalysis[] {
  const store = readStore();
  return Object.values(store.ai_analyses).sort((a, b) =>
    b.created_at > a.created_at ? 1 : -1
  );
}

// ================= Concepts =================
export function saveLocalConcept(concept: StoredConcept): void {
  const store = readStore();
  store.concepts[concept.id] = concept;
  writeStore(store);
}

export function getLocalConcept(id: string): StoredConcept | null {
  const store = readStore();
  return store.concepts[id] || null;
}

export function findLocalConceptByName(
  normalizedName: string
): StoredConcept | null {
  const store = readStore();
  for (const c of Object.values(store.concepts)) {
    if (c.normalized_name === normalizedName) {
      return c;
    }
  }
  return null;
}

export function getAllLocalConcepts(): StoredConcept[] {
  const store = readStore();
  return Object.values(store.concepts);
}

// ================= Learner Concepts =================
export function saveLocalLearnerConcept(lc: StoredLearnerConcept): void {
  const store = readStore();
  // key by concept_id + user_id
  const key = `${lc.user_id}:${lc.concept_id}`;
  store.learner_concepts[key] = lc;
  writeStore(store);
}

export function getLocalLearnerConcepts(
  userId: string
): (StoredLearnerConcept & { concept?: StoredConcept })[] {
  const store = readStore();
  const result: (StoredLearnerConcept & { concept?: StoredConcept })[] = [];
  for (const lc of Object.values(store.learner_concepts)) {
    if (lc.user_id === userId) {
      const concept = store.concepts[lc.concept_id];
      result.push({ ...lc, concept });
    }
  }
  return result;
}

export function getLocalLearnerConcept(
  userId: string,
  conceptId: string
): StoredLearnerConcept | null {
  const store = readStore();
  const key = `${userId}:${conceptId}`;
  return store.learner_concepts[key] || null;
}

// ================= Concept Relations =================
export function saveLocalConceptRelation(rel: StoredConceptRelation): void {
  const store = readStore();
  store.concept_relations[rel.id] = rel;
  writeStore(store);
}

export function getAllLocalConceptRelations(): StoredConceptRelation[] {
  const store = readStore();
  return Object.values(store.concept_relations);
}

// ================= Reviews =================
export function saveLocalReview(review: StoredReview): void {
  const store = readStore();
  store.reviews[review.id] = review;
  writeStore(store);
}

export function getLocalReviewById(reviewId: string): StoredReview | null {
  const store = readStore();
  return store.reviews[reviewId] || null;
}

export function getLocalReviews(
  userId: string
): (StoredReview & { concept?: StoredConcept })[] {
  const store = readStore();
  return Object.values(store.reviews)
    .filter((r) => r.user_id === userId)
    .map((r) => ({ ...r, concept: store.concepts[r.concept_id] }))
    .sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
}

export function updateLocalReview(
  reviewId: string,
  updates: Partial<StoredReview>
): StoredReview | null {
  const store = readStore();
  const current = store.reviews[reviewId];
  if (!current) return null;
  const updated = { ...current, ...updates };
  store.reviews[reviewId] = updated;
  writeStore(store);
  return updated;
}

// ================= Quests =================
export function saveLocalQuest(quest: StoredQuest): void {
  const store = readStore();
  store.quests[quest.id] = quest;
  writeStore(store);
}

export function getLocalQuestById(questId: string): StoredQuest | null {
  const store = readStore();
  return store.quests[questId] || null;
}

export function getActiveLocalQuest(userId: string): StoredQuest | null {
  const store = readStore();
  const userQuests = Object.values(store.quests)
    .filter((q) => q.user_id === userId && (q.status === "pending" || q.status === "in_progress"))
    .sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
  return userQuests[0] || null;
}

export function getLocalQuests(userId: string): StoredQuest[] {
  const store = readStore();
  return Object.values(store.quests)
    .filter((q) => q.user_id === userId)
    .sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
}

export function updateLocalQuest(
  questId: string,
  updates: Partial<StoredQuest>
): StoredQuest | null {
  const store = readStore();
  const current = store.quests[questId];
  if (!current) return null;
  const updated = { ...current, ...updates };
  store.quests[questId] = updated;
  writeStore(store);
  return updated;
}

