import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAudit } from "@/services/auditService";

export interface AppSettings {
  id: string;
  complex_name: string;
  currency: string;
  locale: string;
  tva_rate: number;
  late_fee_rate: number;
  default_sport_price: number;
  default_hammam_price: number;
  default_event_hall_price: number;
  cnps_employee_rate: number;
  cnps_employer_rate: number;
  notification_email: string | null;
}

const DEFAULTS: AppSettings = {
  id: "",
  complex_name: "MWAYE HOUSE",
  currency: "FCFA",
  locale: "fr-FR",
  tva_rate: 19.25,
  late_fee_rate: 10,
  default_sport_price: 15000,
  default_hammam_price: 3000,
  default_event_hall_price: 150000,
  cnps_employee_rate: 4.2,
  cnps_employer_rate: 11.2,
  notification_email: null,
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (!error && data) setSettings(data as AppSettings);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      if (!settings.id) {
        toast.error("Paramètres non chargés");
        return false;
      }
      const { error } = await supabase
        .from("app_settings")
        .update(patch)
        .eq("id", settings.id);
      if (error) {
        toast.error("Échec de la mise à jour : " + error.message);
        return false;
      }
      await logAudit({
        action: "settings.updated",
        entity_type: "app_settings",
        entity_id: settings.id,
        entity_label: settings.complex_name,
        details: patch as Record<string, unknown>,
      });
      toast.success("Paramètres mis à jour");
      fetchSettings();
      return true;
    },
    [settings.id, settings.complex_name, fetchSettings]
  );

  return { settings, loading, updateSettings, refetch: fetchSettings };
}
