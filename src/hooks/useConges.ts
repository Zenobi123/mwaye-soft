// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CongeRow {
  id: string;
  statut: string;
  date_fin: string;
}

export function useConges() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const congesQuery = useQuery({
    queryKey: ["conges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conges")
        .select("*, employes(nom, poste)")
        .order("date_debut", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const creer = useMutation({
    mutationFn: async (v: { employe_id: string; type_conge: string; date_debut: string; date_fin: string; motif?: string }) => {
      const { error } = await supabase.from("conges").insert({ ...v, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Demande de congé créée"); qc.invalidateQueries({ queryKey: ["conges"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const decider = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: "approuvé" | "refusé" }) => {
      const { error } = await supabase
        .from("conges")
        .update({ statut, approuve_par: user!.id, approuve_le: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, v) => { toast.success(`Congé ${v.statut}`); qc.invalidateQueries({ queryKey: ["conges"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const supprimer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("conges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Congé supprimé"); qc.invalidateQueries({ queryKey: ["conges"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const conges = (congesQuery.data as CongeRow[] | undefined) ?? [];
  const enCours = conges.filter((c) => c.statut === "approuvé" && new Date(c.date_fin) >= new Date());

  return { conges, enCours, isLoading: congesQuery.isLoading, creer, decider, supprimer };
}
