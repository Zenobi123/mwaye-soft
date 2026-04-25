import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface JournalRow {
  id: string;
  date_journal: string;
  solde_ouverture: number;
  total_recettes: number;
  total_depenses: number;
  solde_cloture: number;
  statut: string;
  observations: string | null;
}

export function useJournalCaisseData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const journalsQuery = useQuery({
    queryKey: ["journal_caisse"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_caisse")
        .select("*")
        .order("date_journal", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as JournalRow[];
    },
    enabled: !!user,
  });

  const ouvrirJournee = useMutation({
    mutationFn: async (values: { date_journal: string; solde_ouverture: number }) => {
      const [recRes, depRes] = await Promise.all([
        supabase.from("recettes").select("montant").eq("date_recette", values.date_journal),
        supabase.from("depenses").select("montant").eq("date_depense", values.date_journal),
      ]);
      const totalRecettes = (recRes.data || []).reduce((s, r) => s + Number(r.montant), 0);
      const totalDepenses = (depRes.data || []).reduce((s, d) => s + Number(d.montant), 0);

      const { error } = await supabase.from("journal_caisse").insert({
        user_id: user!.id,
        date_journal: values.date_journal,
        solde_ouverture: values.solde_ouverture,
        total_recettes: totalRecettes,
        total_depenses: totalDepenses,
        solde_cloture: values.solde_ouverture + totalRecettes - totalDepenses,
      });
      if (error) {
        if (error.message.includes("unique")) {
          throw new Error("Une entrée existe déjà pour cette date.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_caisse"] });
      toast.success("Journée ouverte");
    },
    onError: (e) => toast.error(e.message),
  });

  const cloturerJournee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_caisse").update({
        statut: "clôturé",
        date_cloture: new Date().toISOString(),
        cloture_par: user!.id,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_caisse"] });
      toast.success("Journée clôturée");
    },
    onError: (e) => toast.error(e.message),
  });

  const cloturerAujourdhui = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase.rpc("cloturer_journal_jour", { p_date: today });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_caisse"] });
      toast.success("Journée clôturée automatiquement");
    },
    onError: (e) => toast.error("Échec clôture", { description: e.message }),
  });

  return {
    journals: journalsQuery.data ?? [],
    isLoading: journalsQuery.isLoading,
    ouvrirJournee,
    cloturerJournee,
    cloturerAujourdhui,
  };
}
