import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useAppartementsData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const appartementsQuery = useQuery({
    queryKey: ["appartements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appartements")
        .select("*")
        .order("numero");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const contratsQuery = useQuery({
    queryKey: ["contrats_bail"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contrats_bail")
        .select("*, appartements(numero, type_appartement)")
        .order("date_debut", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addAppartement = useMutation({
    mutationFn: async (values: {
      numero: string;
      type_appartement: string;
      nombre_pieces: number;
      loyer: number;
      description?: string;
    }) => {
      const { error } = await supabase.from("appartements").insert({
        ...values,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appartements"] });
      toast.success("Appartement ajouté");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateAppartement = useMutation({
    mutationFn: async ({ id, ...values }: { id: string; locataire?: string; statut?: string; paye?: boolean }) => {
      const { error } = await supabase.from("appartements").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appartements"] });
      toast.success("Appartement mis à jour");
    },
    onError: (e) => toast.error(e.message),
  });

  const addContrat = useMutation({
    mutationFn: async (values: {
      appartement_id: string;
      locataire: string;
      telephone?: string;
      date_debut: string;
      date_fin: string;
      loyer_mensuel: number;
      caution: number;
      notes?: string;
    }) => {
      const { error } = await supabase.from("contrats_bail").insert({
        ...values,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrats_bail"] });
      toast.success("Contrat ajouté");
    },
    onError: (e) => toast.error(e.message),
  });

  const appartements = appartementsQuery.data ?? [];
  const contrats = contratsQuery.data ?? [];
  const occupied = appartements.filter((a) => a.statut === "loué");
  const monthlyTotal = occupied.reduce((s, a) => s + Number(a.loyer), 0);

  return {
    appartements,
    contrats,
    occupied,
    monthlyTotal,
    isLoading: appartementsQuery.isLoading,
    addAppartement,
    updateAppartement,
    addContrat,
  };
}
