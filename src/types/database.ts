export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EventCategory =
  | 'competition'
  | 'graduation'
  | 'seminar'
  | 'special_training'
  | 'other';

export type EventStatus = 'draft' | 'published' | 'cancelled';

export interface DbAdminUser {
  user_id: string;
  display_name: string;
  created_at: string;
  [key: string]: unknown;
}

export interface DbEvent {
  id: string;
  slug: string;
  category: EventCategory;
  title: string;
  summary: string;
  description: string;
  event_date: string;
  end_date: string | null;
  location: string;
  requirements: string | null;
  registration_info: string | null;
  registration_url: string | null;
  contact: string | null;
  status: EventStatus;
  published_at: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  [key: string]: unknown;
}

export interface DbStudent {
  id: string;
  name: string;
  slug: string;
  current_khan: number;
  is_active: boolean;
  is_published: boolean;
  image_url: string | null;
  gym_ids?: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  [key: string]: unknown;
}

export interface DbStudentGraduation {
  id: string;
  student_id: string;
  khan_level: number;
  achieved_at: string | null;
  created_at: string;
  created_by: string | null;
  [key: string]: unknown;
}

export type { DbEventBracket, BracketRound, BracketMatch, BracketType, BracketWinner } from './brackets';
import type { DbEventBracket } from './brackets';

export interface GenericRelationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: DbAdminUser;
        Insert: {
          user_id: string;
          display_name: string;
          created_at?: string;
          [key: string]: unknown;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          created_at?: string;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
      events: {
        Row: DbEvent;
        Insert: {
          id?: string;
          slug: string;
          category: EventCategory;
          title: string;
          summary: string;
          description: string;
          event_date: string;
          end_date?: string | null;
          location: string;
          requirements?: string | null;
          registration_info?: string | null;
          registration_url?: string | null;
          contact?: string | null;
          status?: EventStatus;
          published_at?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          slug?: string;
          category?: EventCategory;
          title?: string;
          summary?: string;
          description?: string;
          event_date?: string;
          end_date?: string | null;
          location?: string;
          requirements?: string | null;
          registration_info?: string | null;
          registration_url?: string | null;
          contact?: string | null;
          status?: EventStatus;
          published_at?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
      students: {
        Row: DbStudent;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          current_khan?: number;
          is_active?: boolean;
          is_published?: boolean;
          image_url?: string | null;
          gym_ids?: string[];
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          current_khan?: number;
          is_active?: boolean;
          is_published?: boolean;
          image_url?: string | null;
          gym_ids?: string[];
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
      student_graduations: {
        Row: DbStudentGraduation;
        Insert: {
          id?: string;
          student_id: string;
          khan_level: number;
          achieved_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          student_id?: string;
          khan_level?: number;
          achieved_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
      event_brackets: {
        Row: DbEventBracket;
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          category_name?: string | null;
          bracket_type?: string;
          rounds?: unknown;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          category_name?: string | null;
          bracket_type?: string;
          rounds?: unknown;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      set_student_khan: {
        Args: {
          target_student_id: string;
          target_khan: number;
          achieved_at_date?: string | null;
          correction_mode?: boolean;
          [key: string]: unknown;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
