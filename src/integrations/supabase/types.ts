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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abonnements_sport: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          montant: number
          nom_abonne: string
          notes: string | null
          salle_id: string
          statut: string
          telephone: string | null
          type_abonnement: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_debut?: string
          date_fin: string
          id?: string
          montant?: number
          nom_abonne: string
          notes?: string | null
          salle_id: string
          statut?: string
          telephone?: string | null
          type_abonnement?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          montant?: number
          nom_abonne?: string
          notes?: string | null
          salle_id?: string
          statut?: string
          telephone?: string | null
          type_abonnement?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "abonnements_sport_salle_id_fkey"
            columns: ["salle_id"]
            isOneToOne: false
            referencedRelation: "salles_sport"
            referencedColumns: ["id"]
          },
        ]
      }
      depenses: {
        Row: {
          categorie: string
          created_at: string
          date_depense: string
          id: string
          justificatif_url: string | null
          libelle: string
          mode_paiement: string
          montant: number
          notes: string | null
          reference: string | null
          statut: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          categorie: string
          created_at?: string
          date_depense?: string
          id?: string
          justificatif_url?: string | null
          libelle: string
          mode_paiement?: string
          montant: number
          notes?: string | null
          reference?: string | null
          statut?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          categorie?: string
          created_at?: string
          date_depense?: string
          id?: string
          justificatif_url?: string | null
          libelle?: string
          mode_paiement?: string
          montant?: number
          notes?: string | null
          reference?: string | null
          statut?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      journal_caisse: {
        Row: {
          created_at: string
          date_journal: string
          id: string
          observations: string | null
          solde_cloture: number
          solde_ouverture: number
          statut: string
          total_depenses: number
          total_recettes: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date_journal: string
          id?: string
          observations?: string | null
          solde_cloture?: number
          solde_ouverture?: number
          statut?: string
          total_depenses?: number
          total_recettes?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date_journal?: string
          id?: string
          observations?: string | null
          solde_cloture?: number
          solde_ouverture?: number
          statut?: string
          total_depenses?: number
          total_recettes?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recettes: {
        Row: {
          categorie: string
          created_at: string
          date_recette: string
          id: string
          libelle: string
          mode_paiement: string
          montant: number
          notes: string | null
          reference: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          categorie: string
          created_at?: string
          date_recette?: string
          id?: string
          libelle: string
          mode_paiement?: string
          montant: number
          notes?: string | null
          reference?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          categorie?: string
          created_at?: string
          date_recette?: string
          id?: string
          libelle?: string
          mode_paiement?: string
          montant?: number
          notes?: string | null
          reference?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      salles_sport: {
        Row: {
          capacite: number
          created_at: string
          description: string | null
          id: string
          nom: string
          occupees: number
          revenu_mensuel: number
          statut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          capacite?: number
          created_at?: string
          description?: string | null
          id?: string
          nom: string
          occupees?: number
          revenu_mensuel?: number
          statut?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          capacite?: number
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
          occupees?: number
          revenu_mensuel?: number
          statut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seances_sport: {
        Row: {
          created_at: string
          date_seance: string
          heure_debut: string
          heure_fin: string
          id: string
          notes: string | null
          participants: number
          salle_id: string
          type_seance: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_seance?: string
          heure_debut: string
          heure_fin: string
          id?: string
          notes?: string | null
          participants?: number
          salle_id: string
          type_seance?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_seance?: string
          heure_debut?: string
          heure_fin?: string
          id?: string
          notes?: string | null
          participants?: number
          salle_id?: string
          type_seance?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seances_sport_salle_id_fkey"
            columns: ["salle_id"]
            isOneToOne: false
            referencedRelation: "salles_sport"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role:
        | "admin"
        | "directeur"
        | "comptable"
        | "resp_sport"
        | "resp_evenement"
        | "resp_immobilier"
        | "caissier"
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
      app_role: [
        "admin",
        "directeur",
        "comptable",
        "resp_sport",
        "resp_evenement",
        "resp_immobilier",
        "caissier",
      ],
    },
  },
} as const
