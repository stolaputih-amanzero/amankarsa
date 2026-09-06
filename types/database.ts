export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      participant: {
        Row: {
          id: string
          display_name: string | null
          auth_channel: 'email' | 'whatsapp' | 'copy' | null
          joined_at: string | null
        }
        Insert: {
          id: string
          display_name?: string | null
          auth_channel?: 'email' | 'whatsapp' | 'copy' | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
          auth_channel?: 'email' | 'whatsapp' | 'copy' | null
          joined_at?: string | null
        }
        Relationships: []
      }
      journey: {
        Row: {
          id: string
          initiator_id: string | null
          theme: string
          duration_days: number
          status: 'draft' | 'active' | 'completed' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          initiator_id?: string | null
          theme: string
          duration_days: number
          status?: 'draft' | 'active' | 'completed' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          initiator_id?: string | null
          theme?: string
          duration_days?: number
          status?: 'draft' | 'active' | 'completed' | null
          created_at?: string | null
        }
        Relationships: []
      }
      participant_journey_state: {
        Row: {
          id: string
          participant_id: string
          journey_id: string
          state: 'invited' | 'active' | 'paused' | 'resting' | 'completed' | 'continuing' | 'archived'
          continuation_intent: 'none' | 'self_guided' | 'community_invited' | 'next_journey' | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          participant_id: string
          journey_id: string
          state: 'invited' | 'active' | 'paused' | 'resting' | 'completed' | 'continuing' | 'archived'
          continuation_intent?: 'none' | 'self_guided' | 'community_invited' | 'next_journey' | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          participant_id?: string
          journey_id?: string
          state?: 'invited' | 'active' | 'paused' | 'resting' | 'completed' | 'continuing' | 'archived'
          continuation_intent?: 'none' | 'self_guided' | 'community_invited' | 'next_journey' | null
          updated_at?: string | null
        }
        Relationships: []
      }
      the_pulse: {
        Row: {
          id: string
          journey_id: string
          day_index: number
          prompt_text: string
          action_type: 'contemplation' | 'practical_action' | 'reflection' | null
        }
        Insert: {
          id?: string
          journey_id: string
          day_index: number
          prompt_text: string
          action_type?: 'contemplation' | 'practical_action' | 'reflection' | null
        }
        Update: {
          id?: string
          journey_id?: string
          day_index?: number
          prompt_text?: string
          action_type?: 'contemplation' | 'practical_action' | 'reflection' | null
        }
        Relationships: []
      }
      pulse_interaction: {
        Row: {
          id: string
          pulse_id: string
          participant_id: string
          interacted_at: string | null
          state: 'paused' | 'acted' | 'rested'
        }
        Insert: {
          id?: string
          pulse_id: string
          participant_id: string
          interacted_at?: string | null
          state: 'paused' | 'acted' | 'rested'
        }
        Update: {
          id?: string
          pulse_id?: string
          participant_id?: string
          interacted_at?: string | null
          state?: 'paused' | 'acted' | 'rested'
        }
        Relationships: []
      }
      bilik_doa: {
        Row: {
          id: string
          participant_id: string
          pulse_interaction_id: string | null
          encrypted_payload: string
          created_at: string | null
        }
        Insert: {
          id?: string
          participant_id: string
          pulse_interaction_id?: string | null
          encrypted_payload: string
          created_at?: string | null
        }
        Update: {
          id?: string
          participant_id?: string
          pulse_interaction_id?: string | null
          encrypted_payload?: string
          created_at?: string | null
        }
        Relationships: []
      }
      tanda_rasa: {
        Row: {
          id: string
          participant_id: string
          journey_id: string | null
          tag: 'damai' | 'bersyukur' | 'tergerak' | 'lelah' | 'cemas' | 'sedih' | 'bingung' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          participant_id: string
          journey_id?: string | null
          tag?: 'damai' | 'bersyukur' | 'tergerak' | 'lelah' | 'cemas' | 'sedih' | 'bingung' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          participant_id?: string
          journey_id?: string | null
          tag?: 'damai' | 'bersyukur' | 'tergerak' | 'lelah' | 'cemas' | 'sedih' | 'bingung' | null
          created_at?: string | null
        }
        Relationships: []
      }
      pohon_karsa_state: {
        Row: {
          participant_id: string
          cumulative_actions: number | null
          current_season_state: 'sprouting' | 'growing' | 'resting' | 'bearing_fruit'
          updated_at: string | null
        }
        Insert: {
          participant_id: string
          cumulative_actions?: number | null
          current_season_state?: 'sprouting' | 'growing' | 'resting' | 'bearing_fruit'
          updated_at?: string | null
        }
        Update: {
          participant_id?: string
          cumulative_actions?: number | null
          current_season_state?: 'sprouting' | 'growing' | 'resting' | 'bearing_fruit'
          updated_at?: string | null
        }
        Relationships: []
      }
      recovery_key: {
        Row: {
          id: string
          participant_id: string
          token_hash: string
          channel: 'email' | 'whatsapp' | 'copy' | null
          created_at: string | null
          expires_at: string
          revoked_at: string | null
          last_used_at: string | null
        }
        Insert: {
          id?: string
          participant_id: string
          token_hash: string
          channel?: 'email' | 'whatsapp' | 'copy' | null
          created_at?: string | null
          expires_at: string
          revoked_at?: string | null
          last_used_at?: string | null
        }
        Update: {
          id?: string
          participant_id?: string
          token_hash?: string
          channel?: 'email' | 'whatsapp' | 'copy' | null
          created_at?: string | null
          expires_at?: string
          revoked_at?: string | null
          last_used_at?: string | null
        }
        Relationships: []
      }
      beneficiary_group: {
        Row: {
          id: string
          journey_id: string
          label: string
          category: 'lansia' | 'anak' | 'keluarga' | 'penyandang_disabilitas' | 'komunitas_lokal' | 'lingkungan_hidup' | 'pekerja_rentan' | 'lainnya' | null
          estimated_count: number | null
          unit: 'orang' | 'keluarga' | 'paket' | 'kunjungan' | 'jam_pelayanan' | 'area_layanan' | null
          privacy_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          journey_id: string
          label: string
          category?: 'lansia' | 'anak' | 'keluarga' | 'penyandang_disabilitas' | 'komunitas_lokal' | 'lingkungan_hidup' | 'pekerja_rentan' | 'lainnya' | null
          estimated_count?: number | null
          unit?: 'orang' | 'keluarga' | 'paket' | 'kunjungan' | 'jam_pelayanan' | 'area_layanan' | null
          privacy_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          journey_id?: string
          label?: string
          category?: 'lansia' | 'anak' | 'keluarga' | 'penyandang_disabilitas' | 'komunitas_lokal' | 'lingkungan_hidup' | 'pekerja_rentan' | 'lainnya' | null
          estimated_count?: number | null
          unit?: 'orang' | 'keluarga' | 'paket' | 'kunjungan' | 'jam_pelayanan' | 'area_layanan' | null
          privacy_level?: string | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "beneficiary_group_journey_id_fkey", columns: ["journey_id"], isOneToOne: false, referencedRelation: "journey", referencedColumns: ["id"] }
        ]
      }
      impact_record: {
        Row: {
          id: string
          journey_id: string
          beneficiary_group_id: string | null
          service_activity_name: string
          metric_type: 'volunteer_hours' | 'meals_distributed' | 'visits_made' | 'packages_distributed' | 'families_served' | 'environmental_actions' | 'other_service_actions' | null
          quantity: number
          unit: string
          story_description: string | null
          source: 'observable' | 'self_reported' | 'facilitator_reported' | 'initiator_reported' | null
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          journey_id: string
          beneficiary_group_id?: string | null
          service_activity_name: string
          metric_type?: 'volunteer_hours' | 'meals_distributed' | 'visits_made' | 'packages_distributed' | 'families_served' | 'environmental_actions' | 'other_service_actions' | null
          quantity?: number
          unit: string
          story_description?: string | null
          source?: 'observable' | 'self_reported' | 'facilitator_reported' | 'initiator_reported' | null
          occurred_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          journey_id?: string
          beneficiary_group_id?: string | null
          service_activity_name?: string
          metric_type?: 'volunteer_hours' | 'meals_distributed' | 'visits_made' | 'packages_distributed' | 'families_served' | 'environmental_actions' | 'other_service_actions' | null
          quantity?: number
          unit?: string
          story_description?: string | null
          source?: 'observable' | 'self_reported' | 'facilitator_reported' | 'initiator_reported' | null
          occurred_at?: string
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "impact_record_journey_id_fkey", columns: ["journey_id"], isOneToOne: false, referencedRelation: "journey", referencedColumns: ["id"] },
          { foreignKeyName: "impact_record_beneficiary_group_id_fkey", columns: ["beneficiary_group_id"], isOneToOne: false, referencedRelation: "beneficiary_group", referencedColumns: ["id"] }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_pastoral_signals: {
        Args: { p_journey_id: string }
        Returns: { tag: string; count: number; percentage: number }[]
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
