export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          academic_achievements: string | null
          additional_comments: string | null
          admission_number: string | null
          admission_year: number
          advice_to_current: string | null
          canteen_memories: string | null
          career_achievements: string | null
          chapel_memories: string | null
          class_teacher_names: string | null
          club_leader_details: string | null
          clubs_societies: string[] | null
          created_at: string
          cultural_events: string | null
          current_location: string | null
          current_profession: string | null
          daily_routine_memories: string | null
          deputy_headmaster_name: string | null
          dining_memories: string | null
          dormitory_memories: string | null
          dormitory_name: string | null
          email: string | null
          entertainment_memories: string | null
          favorite_meals: string | null
          favorite_teachers: string | null
          full_name: string
          funny_stories: string | null
          games_and_hobbies: string | null
          graduation_year: number
          has_photos_to_share: boolean | null
          headmaster_name: string | null
          house: string
          house_captain_name: string | null
          house_colours_description: string | null
          housemaster_name: string | null
          id: string
          inter_house_competitions: string | null
          legacy_note: string | null
          memorable_events: string | null
          notability: string | null
          opening_closing_day: string | null
          phone: string | null
          prefect_names_during_time: string | null
          prefect_position: string | null
          punishments_memories: string | null
          religious_life: string | null
          rivalry_memories: string | null
          school_captain_name: string | null
          school_connection: string | null
          school_nickname: string | null
          signature_contribution: string | null
          significant_changes: string | null
          sports_achievements: string | null
          sports_captain_details: string | null
          sports_participated: string[] | null
          subjects_taken: string[] | null
          swimming_pool_memories: string | null
          timetable_description: string | null
          traditions_remembered: string | null
          uniform_memories: string | null
          updated_at: string
          uploaded_files: string[] | null
          visiting_days_memories: string | null
          was_club_leader: boolean | null
          was_prefect: boolean | null
          was_sports_captain: boolean | null
          weekend_activities: string | null
          willing_to_be_interviewed: boolean | null
        }
        Insert: {
          academic_achievements?: string | null
          additional_comments?: string | null
          admission_number?: string | null
          admission_year: number
          advice_to_current?: string | null
          canteen_memories?: string | null
          career_achievements?: string | null
          chapel_memories?: string | null
          class_teacher_names?: string | null
          club_leader_details?: string | null
          clubs_societies?: string[] | null
          created_at?: string
          cultural_events?: string | null
          current_location?: string | null
          current_profession?: string | null
          daily_routine_memories?: string | null
          deputy_headmaster_name?: string | null
          dining_memories?: string | null
          dormitory_memories?: string | null
          dormitory_name?: string | null
          email?: string | null
          entertainment_memories?: string | null
          favorite_meals?: string | null
          favorite_teachers?: string | null
          full_name: string
          funny_stories?: string | null
          games_and_hobbies?: string | null
          graduation_year: number
          has_photos_to_share?: boolean | null
          headmaster_name?: string | null
          house: string
          house_captain_name?: string | null
          house_colours_description?: string | null
          housemaster_name?: string | null
          id?: string
          inter_house_competitions?: string | null
          legacy_note?: string | null
          memorable_events?: string | null
          notability?: string | null
          opening_closing_day?: string | null
          phone?: string | null
          prefect_names_during_time?: string | null
          prefect_position?: string | null
          punishments_memories?: string | null
          religious_life?: string | null
          rivalry_memories?: string | null
          school_captain_name?: string | null
          school_connection?: string | null
          school_nickname?: string | null
          signature_contribution?: string | null
          significant_changes?: string | null
          sports_achievements?: string | null
          sports_captain_details?: string | null
          sports_participated?: string[] | null
          subjects_taken?: string[] | null
          swimming_pool_memories?: string | null
          timetable_description?: string | null
          traditions_remembered?: string | null
          uniform_memories?: string | null
          updated_at?: string
          uploaded_files?: string[] | null
          visiting_days_memories?: string | null
          was_club_leader?: boolean | null
          was_prefect?: boolean | null
          was_sports_captain?: boolean | null
          weekend_activities?: string | null
          willing_to_be_interviewed?: boolean | null
        }
        Update: {
          academic_achievements?: string | null
          additional_comments?: string | null
          admission_number?: string | null
          admission_year?: number
          advice_to_current?: string | null
          canteen_memories?: string | null
          career_achievements?: string | null
          chapel_memories?: string | null
          class_teacher_names?: string | null
          club_leader_details?: string | null
          clubs_societies?: string[] | null
          created_at?: string
          cultural_events?: string | null
          current_location?: string | null
          current_profession?: string | null
          daily_routine_memories?: string | null
          deputy_headmaster_name?: string | null
          dining_memories?: string | null
          dormitory_memories?: string | null
          dormitory_name?: string | null
          email?: string | null
          entertainment_memories?: string | null
          favorite_meals?: string | null
          favorite_teachers?: string | null
          full_name?: string
          funny_stories?: string | null
          games_and_hobbies?: string | null
          graduation_year?: number
          has_photos_to_share?: boolean | null
          headmaster_name?: string | null
          house?: string
          house_captain_name?: string | null
          house_colours_description?: string | null
          housemaster_name?: string | null
          id?: string
          inter_house_competitions?: string | null
          legacy_note?: string | null
          memorable_events?: string | null
          notability?: string | null
          opening_closing_day?: string | null
          phone?: string | null
          prefect_names_during_time?: string | null
          prefect_position?: string | null
          punishments_memories?: string | null
          religious_life?: string | null
          rivalry_memories?: string | null
          school_captain_name?: string | null
          school_connection?: string | null
          school_nickname?: string | null
          signature_contribution?: string | null
          significant_changes?: string | null
          sports_achievements?: string | null
          sports_captain_details?: string | null
          sports_participated?: string[] | null
          subjects_taken?: string[] | null
          swimming_pool_memories?: string | null
          timetable_description?: string | null
          traditions_remembered?: string | null
          uniform_memories?: string | null
          updated_at?: string
          uploaded_files?: string[] | null
          visiting_days_memories?: string | null
          was_club_leader?: boolean | null
          was_prefect?: boolean | null
          was_sports_captain?: boolean | null
          weekend_activities?: string | null
          willing_to_be_interviewed?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
