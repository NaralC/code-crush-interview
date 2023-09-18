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
          name: string | null
          participants: Json | null
          room_id: string
          type: Database["public"]["Enums"]["room_type"] | null
        }
        Insert: {
          code_state?: Json | null
          created_at?: string | null
          description?: string | null
          finished: boolean
          name?: string | null
          participants?: Json | null
          room_id: string
          type?: Database["public"]["Enums"]["room_type"] | null
        }
        Update: {
          code_state?: Json | null
          created_at?: string | null
          description?: string | null
          finished?: boolean
          name?: string | null
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
        }
        Insert: {
          body?: Json | null
          hints?: string | null
          id?: number
          solution?: string | null
          title?: string | null
        }
        Update: {
          body?: Json | null
          hints?: string | null
          id?: number
          solution?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      room_type: "front_end" | "ds_algo" | "behavioral"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
