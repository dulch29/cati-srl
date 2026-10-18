/**
 * Cati SRL: Supabase PostgreSQL Database Types
 */

import { JournalAnalysis } from "./ai";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface UsersProfile {
  id: string;
  display_name: string | null;
  xp: number;
  streak: number;
  last_active_date: string | null; // ISO Date YYYY-MM-DD
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  content: string;
  self_confidence: number; // 1 to 5
  created_at: string;
}

export interface AiAnalysis {
  id: string;
  journal_entry_id: string;
  main_topic: string | null;
  analysis: JournalAnalysis | Json;
  created_at: string;
}

export interface Concept {
  id: string;
  name: string;
  normalized_name: string;
  subject: string;
  created_at: string;
}

export interface LearnerConcept {
  id: string;
  user_id: string;
  concept_id: string;
  mastery: number; // 0.0 to 1.0
  status: "new" | "understood" | "confused" | "attempted" | "unknown" | string;
  review_due: string | null; // ISO Date YYYY-MM-DD
  last_reviewed_at: string | null;
  created_at: string;
  // Joined fields
  concept?: Concept;
}

export interface ConceptRelation {
  id: string;
  from_concept_id: string;
  to_concept_id: string;
  relation_type: "requires" | "related_to" | string;
  created_at: string;
  // Joined fields
  from_concept?: Concept;
  to_concept?: Concept;
}

export interface Review {
  id: string;
  user_id: string;
  concept_id: string;
  question: string;
  expected_answer: string | null;
  explanation: string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  student_answer: string | null;
  result: "correct" | "partial" | "incorrect" | null;
  created_at: string;
  // Joined fields
  concept?: Concept;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  reason: string | null;
  estimated_time: string | null;
  tasks: Json; // QuestTask[]
  status: "pending" | "in_progress" | "completed";
  created_at: string;
}

/**
 * Supabase Database interface for typed Supabase clients
 */
export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: UsersProfile;
        Insert: Partial<UsersProfile> & { id: string };
        Update: Partial<UsersProfile>;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: Omit<JournalEntry, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<JournalEntry, "id" | "created_at">>;
      };
      ai_analyses: {
        Row: AiAnalysis;
        Insert: Omit<AiAnalysis, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AiAnalysis, "id" | "created_at">>;
      };
      concepts: {
        Row: Concept;
        Insert: Omit<Concept, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Concept, "id" | "created_at">>;
      };
      learner_concepts: {
        Row: LearnerConcept;
        Insert: Omit<LearnerConcept, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<LearnerConcept, "id" | "created_at">>;
      };
      concept_relations: {
        Row: ConceptRelation;
        Insert: Omit<ConceptRelation, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ConceptRelation, "id" | "created_at">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Review, "id" | "created_at">>;
      };
      quests: {
        Row: Quest;
        Insert: Omit<Quest, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Quest, "id" | "created_at">>;
      };
    };
  };
}
