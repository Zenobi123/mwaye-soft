import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useHammamData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sectionsQuery = useQuery({
    queryKey: ["hammam_sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hammam_sections")
        .select("*")
        .order("nom");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const entreesQuery = useQuery({
    queryKey: ["hammam_entrees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hammam_entrees")
        .select("*, hammam_sections(nom)")
        .order("date_entree", { ascending: false })
        .order("heure", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addSection = useMutation({
    mutationFn: async (values: { nom: string; capacite: number; temperature?: string; description?: string }) => {
      const { error } = await supabase.from("hammam_sections").insert({
        ...values,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hammam_sections"] });
      toast.success("Section ajoutée");
    },
    onError: (e) => toast.error(e.message),
  });

  const addEntree = useMutation({
    mutationFn: async (values: { section_id: string; heure: string; nom_client: string; type_service: string; montant: number; date_entree?: string }) => {
      const { error } = await supabase.from("hammam_entrees").insert({
        ...values,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hammam_entrees"] });
      toast.success("Entrée enregistrée");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteEntree = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hammam_entrees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hammam_entrees"] });
      toast.success("Entrée supprimée");
    },
    onError: (e) => toast.error(e.message),
  });

  const sections = sectionsQuery.data ?? [];
  const entrees = entreesQuery.data ?? [];
  const totalRevenue = sections.reduce((s, h) => s + Number(h.revenu_mensuel), 0);

  return {
    sections,
    entrees,
    totalRevenue,
    isLoading: sectionsQuery.isLoading || entreesQuery.isLoading,
    addSection,
    addEntree,
    deleteEntree,
  };
}
