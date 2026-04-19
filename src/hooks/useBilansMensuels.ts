import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { BilanMensuel } from "@/services/exportService";

export function useBilansMensuels() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bilans_mensuels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bilans_mensuels")
        .select("*")
        .order("mois", { ascending: false })
        .limit(24);
      if (error) throw error;
      return (data ?? []) as unknown as (BilanMensuel & { id: string; statut: string; created_at: string })[];
    },
    enabled: !!user,
  });
}

export async function genererBilanMois(mois: string) {
  const { data, error } = await supabase.rpc("calculer_bilan_mensuel", { p_mois: mois });
  if (error) throw error;
  return data as string;
}
