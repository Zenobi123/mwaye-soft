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
      app_settings: {
        Row: {
          cnps_employee_rate: number
          cnps_employer_rate: number
          complex_name: string
          created_at: string
          currency: string
          default_event_hall_price: number
          default_hammam_price: number
          default_sport_price: number
          id: string
          late_fee_rate: number
          locale: string
          notification_email: string | null
          tva_rate: number
          updated_at: string
        }
        Insert: {
          cnps_employee_rate?: number
          cnps_employer_rate?: number
          complex_name?: string
          created_at?: string
          currency?: string
          default_event_hall_price?: number
          default_hammam_price?: number
          default_sport_price?: number
          id?: string
          late_fee_rate?: number
          locale?: string
          notification_email?: string | null
          tva_rate?: number
          updated_at?: string
        }
        Update: {
          cnps_employee_rate?: number
          cnps_employer_rate?: number
          complex_name?: string
          created_at?: string
          currency?: string
          default_event_hall_price?: number
          default_hammam_price?: number
          default_sport_price?: number
          id?: string
          late_fee_rate?: number
          locale?: string
          notification_email?: string | null
          tva_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      appartements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          locataire: string | null
          loyer: number
          nombre_pieces: number
          numero: string
          paye: boolean
          statut: string
          type_appartement: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          locataire?: string | null
          loyer?: number
          nombre_pieces?: number
          numero: string
          paye?: boolean
          statut?: string
          type_appartement?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          locataire?: string | null
          loyer?: number
          nombre_pieces?: number
          numero?: string
          paye?: boolean
          statut?: string
          type_appartement?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      articles_stock: {
        Row: {
          categorie: string
          created_at: string
          description: string | null
          emplacement: string | null
          id: string
          nom: string
          pmp: number
          prix_unitaire: number
          quantite: number
          quantite_min: number
          unite: string
          updated_at: string
          user_id: string
          valeur_stock: number
        }
        Insert: {
          categorie?: string
          created_at?: string
          description?: string | null
          emplacement?: string | null
          id?: string
          nom: string
          pmp?: number
          prix_unitaire?: number
          quantite?: number
          quantite_min?: number
          unite?: string
          updated_at?: string
          user_id: string
          valeur_stock?: number
        }
        Update: {
          categorie?: string
          created_at?: string
          description?: string | null
          emplacement?: string | null
          id?: string
          nom?: string
          pmp?: number
          prix_unitaire?: number
          quantite?: number
          quantite_min?: number
          unite?: string
          updated_at?: string
          user_id?: string
          valeur_stock?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_label: string | null
          entity_type: string
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_label?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_label?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      bilans_mensuels: {
        Row: {
          benefice: number
          created_at: string
          detail_depenses: Json
          detail_recettes: Json
          genere_par: string | null
          id: string
          marge_nette: number
          mois: string
          nb_depenses: number
          nb_recettes: number
          statut: string
          total_depenses: number
          total_recettes: number
          updated_at: string
        }
        Insert: {
          benefice?: number
          created_at?: string
          detail_depenses?: Json
          detail_recettes?: Json
          genere_par?: string | null
          id?: string
          marge_nette?: number
          mois: string
          nb_depenses?: number
          nb_recettes?: number
          statut?: string
          total_depenses?: number
          total_recettes?: number
          updated_at?: string
        }
        Update: {
          benefice?: number
          created_at?: string
          detail_depenses?: Json
          detail_recettes?: Json
          genere_par?: string | null
          id?: string
          marge_nette?: number
          mois?: string
          nb_depenses?: number
          nb_recettes?: number
          statut?: string
          total_depenses?: number
          total_recettes?: number
          updated_at?: string
        }
        Relationships: []
      }
      bulletins_paie: {
        Row: {
          autres_retenues: number
          cnps_employe: number
          cnps_employeur: number
          cout_total_employeur: number
          created_at: string
          date_paiement: string | null
          depense_id: string | null
          employe_id: string
          heures_sup: number
          id: string
          irpp: number
          mode_paiement: string | null
          mois: string
          notes: string | null
          numero: string
          prime: number
          salaire_brut: number
          salaire_net: number
          statut: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          autres_retenues?: number
          cnps_employe?: number
          cnps_employeur?: number
          cout_total_employeur?: number
          created_at?: string
          date_paiement?: string | null
          depense_id?: string | null
          employe_id: string
          heures_sup?: number
          id?: string
          irpp?: number
          mode_paiement?: string | null
          mois: string
          notes?: string | null
          numero: string
          prime?: number
          salaire_brut?: number
          salaire_net?: number
          statut?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          autres_retenues?: number
          cnps_employe?: number
          cnps_employeur?: number
          cout_total_employeur?: number
          created_at?: string
          date_paiement?: string | null
          depense_id?: string | null
          employe_id?: string
          heures_sup?: number
          id?: string
          irpp?: number
          mode_paiement?: string | null
          mois?: string
          notes?: string | null
          numero?: string
          prime?: number
          salaire_brut?: number
          salaire_net?: number
          statut?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulletins_paie_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          adresse: string | null
          created_at: string
          email: string | null
          id: string
          nom: string
          notes: string | null
          telephone: string | null
          type_client: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom: string
          notes?: string | null
          telephone?: string | null
          type_client?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom?: string
          notes?: string | null
          telephone?: string | null
          type_client?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conges: {
        Row: {
          approuve_le: string | null
          approuve_par: string | null
          created_at: string
          date_debut: string
          date_fin: string
          employe_id: string
          id: string
          motif: string | null
          nb_jours: number
          statut: string
          type_conge: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approuve_le?: string | null
          approuve_par?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          employe_id: string
          id?: string
          motif?: string | null
          nb_jours?: number
          statut?: string
          type_conge?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approuve_le?: string | null
          approuve_par?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          employe_id?: string
          id?: string
          motif?: string | null
          nb_jours?: number
          statut?: string
          type_conge?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conges_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      contrats_bail: {
        Row: {
          appartement_id: string
          caution: number
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          locataire: string
          loyer_mensuel: number
          notes: string | null
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appartement_id: string
          caution?: number
          created_at?: string
          date_debut?: string
          date_fin: string
          id?: string
          locataire: string
          loyer_mensuel?: number
          notes?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appartement_id?: string
          caution?: number
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          locataire?: string
          loyer_mensuel?: number
          notes?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrats_bail_appartement_id_fkey"
            columns: ["appartement_id"]
            isOneToOne: false
            referencedRelation: "appartements"
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
      devis: {
        Row: {
          client_id: string
          created_at: string
          date_devis: string
          date_validite: string | null
          id: string
          montant_total: number
          notes: string | null
          numero: string
          statut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_devis?: string
          date_validite?: string | null
          id?: string
          montant_total?: number
          notes?: string | null
          numero: string
          statut?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_devis?: string
          date_validite?: string | null
          id?: string
          montant_total?: number
          notes?: string | null
          numero?: string
          statut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      employes: {
        Row: {
          created_at: string
          date_embauche: string
          departement: string
          email: string | null
          id: string
          nom: string
          notes: string | null
          poste: string
          salaire: number
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_embauche?: string
          departement?: string
          email?: string | null
          id?: string
          nom: string
          notes?: string | null
          poste: string
          salaire?: number
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_embauche?: string
          departement?: string
          email?: string | null
          id?: string
          nom?: string
          notes?: string | null
          poste?: string
          salaire?: number
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      etats_lieux: {
        Row: {
          appartement_id: string
          compteur_eau: string | null
          compteur_elec: string | null
          contrat_id: string
          created_at: string
          date_etat: string
          etat_general: string
          id: string
          observations: string | null
          pieces_detail: Json
          signataire: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appartement_id: string
          compteur_eau?: string | null
          compteur_elec?: string | null
          contrat_id: string
          created_at?: string
          date_etat?: string
          etat_general?: string
          id?: string
          observations?: string | null
          pieces_detail?: Json
          signataire?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appartement_id?: string
          compteur_eau?: string | null
          compteur_elec?: string | null
          contrat_id?: string
          created_at?: string
          date_etat?: string
          etat_general?: string
          id?: string
          observations?: string | null
          pieces_detail?: Json
          signataire?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etats_lieux_appartement_id_fkey"
            columns: ["appartement_id"]
            isOneToOne: false
            referencedRelation: "appartements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etats_lieux_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats_bail"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          client_id: string
          created_at: string
          date_echeance: string | null
          date_facture: string
          date_paiement: string | null
          date_relance: string | null
          devis_id: string | null
          id: string
          montant_total: number
          niveau_relance: number
          notes: string | null
          notes_relance: string | null
          numero: string
          recette_id: string | null
          statut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_echeance?: string | null
          date_facture?: string
          date_paiement?: string | null
          date_relance?: string | null
          devis_id?: string | null
          id?: string
          montant_total?: number
          niveau_relance?: number
          notes?: string | null
          notes_relance?: string | null
          numero: string
          recette_id?: string | null
          statut?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_echeance?: string | null
          date_facture?: string
          date_paiement?: string | null
          date_relance?: string | null
          devis_id?: string | null
          id?: string
          montant_total?: number
          niveau_relance?: number
          notes?: string | null
          notes_relance?: string | null
          numero?: string
          recette_id?: string | null
          statut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      hammam_entrees: {
        Row: {
          created_at: string
          date_entree: string
          heure: string
          id: string
          montant: number
          nom_client: string
          notes: string | null
          section_id: string
          type_service: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_entree?: string
          heure: string
          id?: string
          montant?: number
          nom_client: string
          notes?: string | null
          section_id: string
          type_service?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_entree?: string
          heure?: string
          id?: string
          montant?: number
          nom_client?: string
          notes?: string | null
          section_id?: string
          type_service?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hammam_entrees_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "hammam_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      hammam_sections: {
        Row: {
          capacite: number
          created_at: string
          description: string | null
          id: string
          nom: string
          revenu_mensuel: number
          statut: string
          temperature: string | null
          updated_at: string
          user_id: string
          visiteurs: number
        }
        Insert: {
          capacite?: number
          created_at?: string
          description?: string | null
          id?: string
          nom: string
          revenu_mensuel?: number
          statut?: string
          temperature?: string | null
          updated_at?: string
          user_id: string
          visiteurs?: number
        }
        Update: {
          capacite?: number
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
          revenu_mensuel?: number
          statut?: string
          temperature?: string | null
          updated_at?: string
          user_id?: string
          visiteurs?: number
        }
        Relationships: []
      }
      inventaire_lignes: {
        Row: {
          article_id: string
          created_at: string
          ecart: number
          id: string
          inventaire_id: string
          notes: string | null
          quantite_physique: number
          quantite_theorique: number
          user_id: string
          valeur_ecart: number
        }
        Insert: {
          article_id: string
          created_at?: string
          ecart?: number
          id?: string
          inventaire_id: string
          notes?: string | null
          quantite_physique?: number
          quantite_theorique?: number
          user_id: string
          valeur_ecart?: number
        }
        Update: {
          article_id?: string
          created_at?: string
          ecart?: number
          id?: string
          inventaire_id?: string
          notes?: string | null
          quantite_physique?: number
          quantite_theorique?: number
          user_id?: string
          valeur_ecart?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventaire_lignes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventaire_lignes_inventaire_id_fkey"
            columns: ["inventaire_id"]
            isOneToOne: false
            referencedRelation: "inventaires"
            referencedColumns: ["id"]
          },
        ]
      }
      inventaires: {
        Row: {
          created_at: string
          date_inventaire: string
          ecart_total_valeur: number
          id: string
          observations: string | null
          reference: string
          statut: string
          updated_at: string
          user_id: string
          valide_le: string | null
          valide_par: string | null
        }
        Insert: {
          created_at?: string
          date_inventaire?: string
          ecart_total_valeur?: number
          id?: string
          observations?: string | null
          reference: string
          statut?: string
          updated_at?: string
          user_id: string
          valide_le?: string | null
          valide_par?: string | null
        }
        Update: {
          created_at?: string
          date_inventaire?: string
          ecart_total_valeur?: number
          id?: string
          observations?: string | null
          reference?: string
          statut?: string
          updated_at?: string
          user_id?: string
          valide_le?: string | null
          valide_par?: string | null
        }
        Relationships: []
      }
      journal_caisse: {
        Row: {
          cloture_auto: boolean
          cloture_par: string | null
          created_at: string
          date_cloture: string | null
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
          cloture_auto?: boolean
          cloture_par?: string | null
          created_at?: string
          date_cloture?: string | null
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
          cloture_auto?: boolean
          cloture_par?: string | null
          created_at?: string
          date_cloture?: string | null
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
      lignes_document: {
        Row: {
          created_at: string
          description: string
          devis_id: string | null
          facture_id: string | null
          id: string
          montant: number
          ordre: number
          prix_unitaire: number
          quantite: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          devis_id?: string | null
          facture_id?: string | null
          id?: string
          montant?: number
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          devis_id?: string | null
          facture_id?: string | null
          id?: string
          montant?: number
          ordre?: number
          prix_unitaire?: number
          quantite?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lignes_document_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_document_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      lots_stock: {
        Row: {
          article_id: string
          created_at: string
          date_entree: string
          depense_id: string | null
          fournisseur: string | null
          id: string
          prix_unitaire: number
          quantite_initiale: number
          quantite_restante: number
          reference_achat: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          date_entree?: string
          depense_id?: string | null
          fournisseur?: string | null
          id?: string
          prix_unitaire?: number
          quantite_initiale?: number
          quantite_restante?: number
          reference_achat?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          date_entree?: string
          depense_id?: string | null
          fournisseur?: string | null
          id?: string
          prix_unitaire?: number
          quantite_initiale?: number
          quantite_restante?: number
          reference_achat?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lots_stock_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_stock"
            referencedColumns: ["id"]
          },
        ]
      }
      mouvements_stock: {
        Row: {
          article_id: string
          created_at: string
          date_mouvement: string
          depense_id: string | null
          fournisseur: string | null
          id: string
          lot_id: string | null
          motif: string | null
          prix_unitaire: number
          quantite: number
          type_mouvement: string
          user_id: string
          valeur_mouvement: number
        }
        Insert: {
          article_id: string
          created_at?: string
          date_mouvement?: string
          depense_id?: string | null
          fournisseur?: string | null
          id?: string
          lot_id?: string | null
          motif?: string | null
          prix_unitaire?: number
          quantite?: number
          type_mouvement?: string
          user_id: string
          valeur_mouvement?: number
        }
        Update: {
          article_id?: string
          created_at?: string
          date_mouvement?: string
          depense_id?: string | null
          fournisseur?: string | null
          id?: string
          lot_id?: string | null
          motif?: string | null
          prix_unitaire?: number
          quantite?: number
          type_mouvement?: string
          user_id?: string
          valeur_mouvement?: number
        }
        Relationships: [
          {
            foreignKeyName: "mouvements_stock_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_stock"
            referencedColumns: ["id"]
          },
        ]
      }
      plannings: {
        Row: {
          created_at: string
          date_planning: string
          employe_id: string
          heure_debut: string
          heure_fin: string
          id: string
          notes: string | null
          poste_assigne: string | null
          statut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_planning: string
          employe_id: string
          heure_debut: string
          heure_fin: string
          id?: string
          notes?: string | null
          poste_assigne?: string | null
          statut?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_planning?: string
          employe_id?: string
          heure_debut?: string
          heure_fin?: string
          id?: string
          notes?: string | null
          poste_assigne?: string | null
          statut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plannings_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      presences: {
        Row: {
          created_at: string
          date_presence: string
          employe_id: string
          heure_arrivee: string | null
          heure_depart: string | null
          id: string
          notes: string | null
          statut: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_presence?: string
          employe_id: string
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          notes?: string | null
          statut?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_presence?: string
          employe_id?: string
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          notes?: string | null
          statut?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presences_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
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
      quittances: {
        Row: {
          appartement_id: string
          contrat_id: string
          created_at: string
          date_echeance: string
          date_paiement: string | null
          id: string
          loyer_base: number
          mode_paiement: string | null
          mois_concerne: string
          montant_paye: number
          montant_total: number
          notes: string | null
          numero: string
          penalite: number
          statut: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appartement_id: string
          contrat_id: string
          created_at?: string
          date_echeance: string
          date_paiement?: string | null
          id?: string
          loyer_base?: number
          mode_paiement?: string | null
          mois_concerne: string
          montant_paye?: number
          montant_total?: number
          notes?: string | null
          numero: string
          penalite?: number
          statut?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appartement_id?: string
          contrat_id?: string
          created_at?: string
          date_echeance?: string
          date_paiement?: string | null
          id?: string
          loyer_base?: number
          mode_paiement?: string | null
          mois_concerne?: string
          montant_paye?: number
          montant_total?: number
          notes?: string | null
          numero?: string
          penalite?: number
          statut?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quittances_appartement_id_fkey"
            columns: ["appartement_id"]
            isOneToOne: false
            referencedRelation: "appartements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quittances_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats_bail"
            referencedColumns: ["id"]
          },
        ]
      }
      rappels_echeance: {
        Row: {
          contrat_id: string
          created_at: string
          envoye_le: string | null
          id: string
          jours_retard: number
          niveau: number
          quittance_id: string
          statut: string
        }
        Insert: {
          contrat_id: string
          created_at?: string
          envoye_le?: string | null
          id?: string
          jours_retard?: number
          niveau?: number
          quittance_id: string
          statut?: string
        }
        Update: {
          contrat_id?: string
          created_at?: string
          envoye_le?: string | null
          id?: string
          jours_retard?: number
          niveau?: number
          quittance_id?: string
          statut?: string
        }
        Relationships: [
          {
            foreignKeyName: "rappels_echeance_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats_bail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rappels_echeance_quittance_id_fkey"
            columns: ["quittance_id"]
            isOneToOne: false
            referencedRelation: "quittances"
            referencedColumns: ["id"]
          },
        ]
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
      reservations_evenements: {
        Row: {
          contact_nom: string | null
          contact_telephone: string | null
          created_at: string
          date_evenement: string
          heure_debut: string
          heure_fin: string
          id: string
          montant: number
          nombre_invites: number
          notes: string | null
          salle_id: string
          statut: string
          titre: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_nom?: string | null
          contact_telephone?: string | null
          created_at?: string
          date_evenement: string
          heure_debut: string
          heure_fin: string
          id?: string
          montant?: number
          nombre_invites?: number
          notes?: string | null
          salle_id: string
          statut?: string
          titre: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_nom?: string | null
          contact_telephone?: string | null
          created_at?: string
          date_evenement?: string
          heure_debut?: string
          heure_fin?: string
          id?: string
          montant?: number
          nombre_invites?: number
          notes?: string | null
          salle_id?: string
          statut?: string
          titre?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_evenements_salle_id_fkey"
            columns: ["salle_id"]
            isOneToOne: false
            referencedRelation: "salles_fetes"
            referencedColumns: ["id"]
          },
        ]
      }
      salles_fetes: {
        Row: {
          capacite: number
          created_at: string
          description: string | null
          id: string
          nom: string
          prix_journalier: number
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
          prix_journalier?: number
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
          prix_journalier?: number
          statut?: string
          updated_at?: string
          user_id?: string
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
      appliquer_penalites_retard: { Args: never; Returns: number }
      calculer_bilan_mensuel: { Args: { p_mois: string }; Returns: string }
      cloturer_journal_jour: { Args: { p_date: string }; Returns: string }
      consommer_stock_fifo: {
        Args: { p_article_id: string; p_quantite: number }
        Returns: number
      }
      convertir_devis_en_facture: {
        Args: { p_date_echeance?: string; p_devis_id: string }
        Returns: string
      }
      generer_bulletins_mensuels: { Args: { p_mois: string }; Returns: number }
      generer_quittances_mensuelles: {
        Args: { p_mois: string }
        Returns: number
      }
      generer_rappels_echeance: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      marquer_facture_payee: {
        Args: { p_facture_id: string; p_mode_paiement?: string }
        Returns: string
      }
      marquer_factures_en_retard: { Args: never; Returns: number }
      valider_bulletin_et_creer_depense: {
        Args: { p_bulletin_id: string }
        Returns: string
      }
      valider_inventaire: { Args: { p_inventaire_id: string }; Returns: number }
      valoriser_article: { Args: { p_article_id: string }; Returns: undefined }
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
