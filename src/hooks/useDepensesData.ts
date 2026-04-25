import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useDepensesData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const depensesQuery = useQuery({
    queryKey: ["depenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("depenses")
        .select("id, libelle, montant, categorie, statut, mode_paiement, date_depense, reference, notes")
        .order("date_depense", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addDepense = useMutation({
    mutationFn: async (values: {
      libelle: string;
      montant: number;
      categorie: string;
      mode_paiement: string;
      date_depense: string;
      reference?: string | null;
      notes?: string | null;
    }) => {
      const { error } = await supabase.from("depenses").insert({ ...values, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Dépense enregistrée");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteDepense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("depenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Dépense supprimée");
    },
    onError: (e) => toast.error(e.message),
  });

  const depenses = depensesQuery.data ?? [];
  const total = depenses.reduce((s, d) => s + Number(d.montant), 0);

  return {
    depenses,
    total,
    isLoading: depensesQuery.isLoading,
    addDepense,
    deleteDepense,
  };
}
