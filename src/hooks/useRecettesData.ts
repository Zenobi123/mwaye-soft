import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useRecettesData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const recettesQuery = useQuery({
    queryKey: ["recettes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recettes")
        .select("id, libelle, montant, categorie, mode_paiement, date_recette, reference, notes")
        .order("date_recette", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addRecette = useMutation({
    mutationFn: async (values: {
      libelle: string;
      montant: number;
      categorie: string;
      mode_paiement: string;
      date_recette: string;
      reference?: string | null;
      notes?: string | null;
    }) => {
      const { error } = await supabase.from("recettes").insert({ ...values, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recettes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Recette enregistrée");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteRecette = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("recettes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recettes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Recette supprimée");
    },
    onError: (e) => toast.error(e.message),
  });

  const recettes = recettesQuery.data ?? [];
  const total = recettes.reduce((s, r) => s + Number(r.montant), 0);

  return {
    recettes,
    total,
    isLoading: recettesQuery.isLoading,
    addRecette,
    deleteRecette,
  };
}
