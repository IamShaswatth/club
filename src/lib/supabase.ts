import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

if (isSupabaseConfigured) {
  console.log('✅ Supabase configured - using real database');
} else {
  console.log('⚠️ Supabase not configured - using localStorage fallback');
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Database schemas for TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          student_id: string | null
          role: 'admin' | 'student'
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          student_id?: string | null
          role?: 'admin' | 'student'
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          student_id?: string | null
          role?: 'admin' | 'student'
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      clubs: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          organizing_club_id: string
          venue: string
          date: string
          time: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          organizing_club_id: string
          venue: string
          date: string
          time: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          organizing_club_id?: string
          venue?: string
          date?: string
          time?: string
          created_by?: string
          created_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          user_id: string
          event_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          registered_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          registered_at?: string
        }
      }
      club_registrations: {
        Row: {
          id: string
          user_id: string
          club_id: string
          status: 'pending' | 'approved' | 'rejected'
          requested_at: string
          approved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          club_id: string
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          approved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          club_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          approved_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}