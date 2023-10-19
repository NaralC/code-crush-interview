type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

interface Database {
  public: {
    Tables: {
      interview_rooms: {
        Row: {
          code_state: Json | null
          created_at: string | null
          description: string | null
          finished: boolean
          front_end_type:
            | Database["public"]["Enums"]["front_end_frameworks"]
            | null
          name: string | null
          note_state: Json | null
          participants: Json | null
          room_id: string
          type: Database["public"]["Enums"]["room_type"] | null
        }
        Insert: {
          code_state?: Json | null
          created_at?: string | null
          description?: string | null
          finished: boolean
          front_end_type?:
            | Database["public"]["Enums"]["front_end_frameworks"]
            | null
          name?: string | null
          note_state?: Json | null
          participants?: Json | null
          room_id: string
          type?: Database["public"]["Enums"]["room_type"] | null
        }
        Update: {
          code_state?: Json | null
          created_at?: string | null
          description?: string | null
          finished?: boolean
          front_end_type?:
            | Database["public"]["Enums"]["front_end_frameworks"]
            | null
          name?: string | null
          note_state?: Json | null
          participants?: Json | null
          room_id?: string
          type?: Database["public"]["Enums"]["room_type"] | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          body: Json | null
          hints: string | null
          id: number
          solution: string | null
          title: string | null
          type: Database["public"]["Enums"]["room_type"]
        }
        Insert: {
          body?: Json | null
          hints?: string | null
          id?: number
          solution?: string | null
          title?: string | null
          type: Database["public"]["Enums"]["room_type"]
        }
        Update: {
          body?: Json | null
          hints?: string | null
          id?: number
          solution?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["room_type"]
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: string
        }
        Insert: {
          email?: string | null
          id: string
        }
        Update: {
          email?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      front_end_frameworks: "react" | "angular" | "vue"
      room_type: "front_end" | "ds_algo" | "behavioral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
