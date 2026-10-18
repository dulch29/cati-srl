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

export type UsersProfile = {
  id: string;
  display_name: string | null;
  xp: number;
  streak: number;
  last_active_date: string | null; // ISO Date YYYY-MM-DD
  created_at: string;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  content: string;
  self_confidence: number; // 1 to 5
  created_at: string;
};

export type AiAnalysis = {
  id: string;
  journal_entry_id: string;
  main_topic: string | null;
  analysis: JournalAnalysis | Json;
  created_at: string;
};

export type Concept = {
  id: string;
  name: string;
  normalized_name: string;
  subject: string;
  created_at: string;
};

export type LearnerConcept = {
  id: string;
  user_id: string;
  concept_id: string;
  mastery: number; // 0.0 to 1.0
  status: "strong" | "developing" | "weak" | "new" | string;
  review_due: string | null; // ISO Date YYYY-MM-DD
  last_reviewed_at: string | null;
  created_at: string;
  concept?: Concept;
};

export type ConceptRelation = {
  id: string;
  from_concept_id: string;
  to_concept_id: string;
  relation_type: "requires" | "related_to" | string;
  created_at: string;
  from_concept?: Concept;
  to_concept?: Concept;
};

export type Review = {
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
  concept?: Concept;
};

export type Quest = {
  id: string;
  user_id: string;
  title: string;
  reason: string | null;
  estimated_time: string | null;
  tasks: Json; // QuestTask[]
  status: "pending" | "in_progress" | "completed";
  created_at: string;
};

/**
 * Supabase Database interface for typed Supabase clients
 */
export type Database = {
  public: {
    Tables: {
      users_profile: {
        Row: UsersProfile;
        Insert: {
          id: string;
          display_name?: string | null;
          xp?: number;
          streak?: number;
          last_active_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          xp?: number;
          streak?: number;
          last_active_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          content: string;
          self_confidence: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          content?: string;
          self_confidence?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_analyses: {
        Row: AiAnalysis;
        Insert: {
          id?: string;
          journal_entry_id: string;
          main_topic?: string | null;
          analysis?: JournalAnalysis | Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          journal_entry_id?: string;
          main_topic?: string | null;
          analysis?: JournalAnalysis | Json;
          created_at?: string;
        };
        Relationships: [];
      };
      concepts: {
        Row: Concept;
        Insert: {
          id?: string;
          name: string;
          normalized_name: string;
          subject: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          normalized_name?: string;
          subject?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      learner_concepts: {
        Row: LearnerConcept;
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          mastery?: number;
          status?: "strong" | "developing" | "weak" | "new" | string;
          review_due?: string | null;
          last_reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          concept_id?: string;
          mastery?: number;
          status?: "strong" | "developing" | "weak" | "new" | string;
          review_due?: string | null;
          last_reviewed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      concept_relations: {
        Row: ConceptRelation;
        Insert: {
          id?: string;
          from_concept_id: string;
          to_concept_id: string;
          relation_type: "requires" | "related_to" | string;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_concept_id?: string;
          to_concept_id?: string;
          relation_type?: "requires" | "related_to" | string;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          question: string;
          expected_answer?: string | null;
          explanation?: string | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          student_answer?: string | null;
          result?: "correct" | "partial" | "incorrect" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          concept_id?: string;
          question?: string;
          expected_answer?: string | null;
          explanation?: string | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          student_answer?: string | null;
          result?: "correct" | "partial" | "incorrect" | null;
          created_at?: string;
        };
        Relationships: [];
      };
      quests: {
        Row: Quest;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          reason?: string | null;
          estimated_time?: string | null;
          tasks?: Json;
          status?: "pending" | "in_progress" | "completed";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          reason?: string | null;
          estimated_time?: string | null;
          tasks?: Json;
          status?: "pending" | "in_progress" | "completed";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
