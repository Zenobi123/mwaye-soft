import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useEvenementsData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sallesQuery = useQuery({
    queryKey: ["salles_fetes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salles_fetes")
        .select("*")
        .order("nom");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const reservationsQuery = useQuery({
    queryKey: ["reservations_evenements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations_evenements")
        .select("*, salles_fetes(nom)")
        .order("date_evenement", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addSalle = useMutation({
    mutationFn: async (values: { nom: string; capacite: number; prix_journalier: number; description?: string }) => {
      const { error } = await supabase.from("salles_fetes").insert({
        ...values,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salles_fetes"] });
      toast.success("Salle ajoutée");
    },
    onError: (e) => toast.error(e.message),
  });

  const addReservation = useMutation({
    mutationFn: async (values: {
      salle_id: string;
      titre: string;
      date_evenement: string;
      heure_debut: string;
      heure_fin: string;
      nombre_invites: number;
      montant: number;
      contact_nom?: string;
      contact_telephone?: string;
      notes?: string;
    }) => {
      const { error } = await supabase.from("reservations_evenements").insert({
        ...values,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations_evenements"] });
      toast.success("Réservation ajoutée");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reservations_evenements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations_evenements"] });
      toast.success("Réservation supprimée");
    },
    onError: (e) => toast.error(e.message),
  });

  const salles = sallesQuery.data ?? [];
  const reservations = reservationsQuery.data ?? [];

  return {
    salles,
    reservations,
    isLoading: sallesQuery.isLoading || reservationsQuery.isLoading,
    addSalle,
    addReservation,
    deleteReservation,
  };
}
