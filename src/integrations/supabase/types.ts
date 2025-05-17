export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: string | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
          user_name?: string
          user_role?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          report_id: string
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          report_id: string
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          report_id?: string
          user_id?: string
          user_name?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "misconduct_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      misconduct_reports: {
        Row: {
          attachment_url: string | null
          bus_route: string
          created_at: string | null
          description: string
          driver_id: string
          driver_name: string
          id: string
          incident_date: string | null
          school_id: string
          school_name: string
          status: string
          student_name: string
        }
        Insert: {
          attachment_url?: string | null
          bus_route: string
          created_at?: string | null
          description: string
          driver_id: string
          driver_name: string
          id?: string
          incident_date?: string | null
          school_id: string
          school_name: string
          status: string
          student_name: string
        }
        Update: {
          attachment_url?: string | null
          bus_route?: string
          created_at?: string | null
          description?: string
          driver_id?: string
          driver_name?: string
          id?: string
          incident_date?: string | null
          school_id?: string
          school_name?: string
          status?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "misconduct_reports_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          school_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
          school_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          id: string
          name: string
          phone: string | null
          state: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          zip?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_school_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
