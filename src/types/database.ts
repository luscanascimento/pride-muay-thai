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
  email?: string | null;
  role?: 'super_admin' | 'admin' | string;
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
  price?: string | null;
  show_pix?: boolean;
  pix_key?: string | null;
  show_instagram?: boolean;
  show_youtube?: boolean;
  graduation_registration_enabled?: boolean;
  graduation_registration_deadline?: string | null;
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

export type GraduationPaymentStatus = 'pending' | 'paid';

export interface DbGraduationRegistration {
  id: string;
  event_id: string;
  student_id: string | null;
  full_name: string;
  current_khan_at_registration: number | null;
  target_khan: number;
  payment_status: GraduationPaymentStatus;
  paid_at: string | null;
  paid_by: string | null;
  created_at: string;
  updated_at: string;
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
          summary?: string;
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
          price?: string | null;
          show_pix?: boolean;
          pix_key?: string | null;
          show_instagram?: boolean;
          show_youtube?: boolean;
          graduation_registration_enabled?: boolean;
          graduation_registration_deadline?: string | null;
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
          price?: string | null;
          show_pix?: boolean;
          pix_key?: string | null;
          show_instagram?: boolean;
          show_youtube?: boolean;
          graduation_registration_enabled?: boolean;
          graduation_registration_deadline?: string | null;
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
      graduation_registrations: {
        Row: DbGraduationRegistration;
        Insert: {
          id?: string;
          event_id: string;
          student_id?: string | null;
          full_name: string;
          current_khan_at_registration?: number | null;
          target_khan: number;
          payment_status?: GraduationPaymentStatus;
          paid_at?: string | null;
          paid_by?: string | null;
          created_at?: string;
          updated_at?: string;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          event_id?: string;
          student_id?: string | null;
          full_name?: string;
          current_khan_at_registration?: number | null;
          target_khan?: number;
          payment_status?: GraduationPaymentStatus;
          paid_at?: string | null;
          paid_by?: string | null;
          created_at?: string;
          updated_at?: string;
          [key: string]: unknown;
        };
        Relationships: [
          {
            foreignKeyName: "graduation_registrations_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "graduation_registrations_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          }
        ];
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
      admin_create_user: {
        Args: {
          new_email: string;
          new_password: string;
          new_display_name: string;
          new_role?: string;
          [key: string]: unknown;
        };
        Returns: {
          user_id: string;
          email: string;
          display_name: string;
        };
      };
      admin_reset_user_password: {
        Args: {
          target_user_id: string;
          new_password: string;
          [key: string]: unknown;
        };
        Returns: boolean;
      };
      admin_delete_user: {
        Args: {
          target_user_id: string;
          [key: string]: unknown;
        };
        Returns: boolean;
      };
      submit_graduation_registration: {
        Args: {
          p_event_id: string;
          p_target_khan: number;
          p_student_id?: string | null;
          p_manual_name?: string | null;
        };
        Returns: string;
      };
      set_graduation_registration_paid: {
        Args: {
          p_registration_id: string;
          p_is_paid: boolean;
        };
        Returns: boolean;
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
