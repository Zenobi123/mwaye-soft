import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function usePlannings() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const planningsQuery = useQuery({
    queryKey: ["plannings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plannings")
        .select("*, employes(nom, poste)")
        .order("date_planning", { ascending: true })
        .limit(300);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const creer = useMutation({
    mutationFn: async (v: { employe_id: string; date_planning: string; heure_debut: string; heure_fin: string; poste_assigne?: string; notes?: string }) => {
      const { error } = await supabase.from("plannings").insert({ ...v, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Créneau ajouté"); qc.invalidateQueries({ queryKey: ["plannings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const supprimer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plannings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["plannings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { plannings: planningsQuery.data ?? [], isLoading: planningsQuery.isLoading, creer, supprimer };
}
