import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useDevisData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const devisQuery = useQuery({
    queryKey: ["devis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devis")
        .select("*, clients(nom, adresse, telephone, email), lignes_document(*)")
        .order("date_devis", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addDevis = useMutation({
    mutationFn: async (values: {
      numero: string; client_id: string; date_validite?: string;
      montant_total: number; notes?: string;
      lignes: { description: string; quantite: number; prix_unitaire: number; montant: number }[];
    }) => {
      const { lignes, ...devisData } = values;
      const { data, error } = await supabase.from("devis").insert({ ...devisData, user_id: user!.id }).select("id").single();
      if (error) throw error;
      if (lignes.length > 0) {
        const lignesInsert = lignes.map((l, i) => ({ ...l, devis_id: data.id, user_id: user!.id, ordre: i }));
        const { error: lErr } = await supabase.from("lignes_document").insert(lignesInsert);
        if (lErr) throw lErr;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["devis"] }); toast.success("Devis créé"); },
    onError: (e) => toast.error(e.message),
  });

  const updateStatutDevis = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      const { error } = await supabase.from("devis").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["devis"] }); toast.success("Statut mis à jour"); },
    onError: (e) => toast.error(e.message),
  });

  const convertirEnFacture = useMutation({
    mutationFn: async ({ devis_id, date_echeance }: { devis_id: string; date_echeance?: string }) => {
      const args: { p_devis_id: string; p_date_echeance?: string } = { p_devis_id: devis_id };
      if (date_echeance) args.p_date_echeance = date_echeance;
      const { data, error } = await supabase.rpc("convertir_devis_en_facture", args);
      if (error) throw error;
      return data as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devis"] });
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast.success("Devis converti en facture");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteDevis = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("devis").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["devis"] }); toast.success("Devis supprimé"); },
    onError: (e) => toast.error(e.message),
  });

  return {
    devis: devisQuery.data ?? [],
    isLoading: devisQuery.isLoading,
    addDevis, updateStatutDevis, convertirEnFacture, deleteDevis,
  };
}
