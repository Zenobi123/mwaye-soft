import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function usePersonnelData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const employesQuery = useQuery({
    queryKey: ["employes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employes").select("*").order("nom");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const presencesQuery = useQuery({
    queryKey: ["presences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("presences")
        .select("*, employes(nom, poste)")
        .order("date_presence", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addEmploye = useMutation({
    mutationFn: async (values: { nom: string; poste: string; departement?: string; telephone?: string; email?: string; salaire?: number }) => {
      const { error } = await supabase.from("employes").insert({ ...values, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employes"] }); toast.success("Employé ajouté"); },
    onError: (e) => toast.error(e.message),
  });

  const addPresence = useMutation({
    mutationFn: async (values: { employe_id: string; date_presence?: string; heure_arrivee?: string; heure_depart?: string; statut: string }) => {
      const { error } = await supabase.from("presences").insert({ ...values, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["presences"] }); toast.success("Présence enregistrée"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteEmploye = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employes"] }); toast.success("Employé supprimé"); },
    onError: (e) => toast.error(e.message),
  });

  const employes = employesQuery.data ?? [];
  const presences = presencesQuery.data ?? [];
  const actifs = employes.filter(e => e.statut === "actif");
  const masseSalariale = actifs.reduce((s, e) => s + Number(e.salaire), 0);

  return { employes, presences, actifs, masseSalariale, isLoading: employesQuery.isLoading, addEmploye, addPresence, deleteEmploye };
}
