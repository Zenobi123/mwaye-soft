import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useFacturesData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const facturesQuery = useQuery({
    queryKey: ["factures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("factures")
        .select("*, clients(nom, adresse, telephone, email), lignes_document(*)")
        .order("date_facture", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addFacture = useMutation({
    mutationFn: async (values: {
      numero: string; client_id: string; devis_id?: string; date_echeance?: string;
      montant_total: number; notes?: string;
      lignes: { description: string; quantite: number; prix_unitaire: number; montant: number }[];
    }) => {
      const { lignes, ...factureData } = values;
      const { data, error } = await supabase.from("factures").insert({
        ...factureData, statut: "emise", user_id: user!.id,
      }).select("id").single();
      if (error) throw error;
      if (lignes.length > 0) {
        const lignesInsert = lignes.map((l, i) => ({ ...l, facture_id: data.id, user_id: user!.id, ordre: i }));
        const { error: lErr } = await supabase.from("lignes_document").insert(lignesInsert);
        if (lErr) throw lErr;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["factures"] }); toast.success("Facture créée"); },
    onError: (e) => toast.error(e.message),
  });

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      const { error } = await supabase.from("factures").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["factures"] }); toast.success("Statut mis à jour"); },
    onError: (e) => toast.error(e.message),
  });

  const marquerPayee = useMutation({
    mutationFn: async ({ id, mode_paiement }: { id: string; mode_paiement: string }) => {
      const { error } = await supabase.rpc("marquer_facture_payee", {
        p_facture_id: id, p_mode_paiement: mode_paiement,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      queryClient.invalidateQueries({ queryKey: ["recettes"] });
      toast.success("Facture marquée payée et recette créée");
    },
    onError: (e) => toast.error(e.message),
  });

  const marquerEnRetard = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("marquer_factures_en_retard");
      if (error) throw error;
      return data as number;
    },
    onSuccess: (n) => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast.success(`${n} facture(s) marquée(s) en retard`);
    },
    onError: (e) => toast.error(e.message),
  });

  const enregistrerRelance = useMutation({
    mutationFn: async ({ id, niveau, notes }: { id: string; niveau: number; notes?: string }) => {
      const { error } = await supabase.from("factures").update({
        date_relance: new Date().toISOString().slice(0, 10),
        niveau_relance: niveau,
        notes_relance: notes ?? null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["factures"] }); toast.success("Relance enregistrée"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteFacture = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("factures").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["factures"] }); toast.success("Facture supprimée"); },
    onError: (e) => toast.error(e.message),
  });

  return {
    factures: facturesQuery.data ?? [],
    isLoading: facturesQuery.isLoading,
    addFacture, updateStatut, marquerPayee, marquerEnRetard,
    enregistrerRelance, deleteFacture,
  };
}
