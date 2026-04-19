import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useImmobilier() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const quittancesQ = useQuery({
    queryKey: ["quittances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quittances")
        .select("*, contrats_bail(locataire), appartements(numero, type_appartement)")
        .order("mois_concerne", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const etatsQ = useQuery({
    queryKey: ["etats_lieux"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("etats_lieux")
        .select("*, contrats_bail(locataire), appartements(numero)")
        .order("date_etat", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const rappelsQ = useQuery({
    queryKey: ["rappels_echeance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rappels_echeance")
        .select("*, quittances(numero, montant_total, mois_concerne, statut, contrats_bail(locataire), appartements(numero))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const genererMois = useMutation({
    mutationFn: async (mois: string) => {
      const { data, error } = await supabase.rpc("generer_quittances_mensuelles", { p_mois: mois });
      if (error) throw error;
      return data as number;
    },
    onSuccess: (n) => {
      qc.invalidateQueries({ queryKey: ["quittances"] });
      toast.success(`${n} quittance(s) générée(s)`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const marquerPayee = useMutation({
    mutationFn: async ({ id, mode }: { id: string; mode: string }) => {
      const { error } = await supabase
        .from("quittances")
        .update({ statut: "payée", date_paiement: new Date().toISOString().slice(0, 10), mode_paiement: mode })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quittances"] });
      qc.invalidateQueries({ queryKey: ["rappels_echeance"] });
      toast.success("Quittance marquée payée");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const lancerPenalitesRappels = useMutation({
    mutationFn: async () => {
      const [pen, rap] = await Promise.all([
        supabase.rpc("appliquer_penalites_retard"),
        supabase.rpc("generer_rappels_echeance"),
      ]);
      if (pen.error) throw pen.error;
      if (rap.error) throw rap.error;
      return { penalites: pen.data, rappels: rap.data };
    },
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["quittances"] });
      qc.invalidateQueries({ queryKey: ["rappels_echeance"] });
      toast.success(`${r.penalites} pénalité(s) · ${r.rappels} rappel(s)`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ajouterEtatLieux = useMutation({
    mutationFn: async (v: {
      contrat_id: string;
      appartement_id: string;
      type: string;
      date_etat: string;
      etat_general: string;
      compteur_eau?: string;
      compteur_elec?: string;
      signataire?: string;
      observations?: string;
      pieces_detail: Array<{ piece: string; etat: string; remarque?: string }>;
    }) => {
      const { error } = await supabase.from("etats_lieux").insert({ ...v, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["etats_lieux"] });
      toast.success("État des lieux enregistré");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const marquerRappelEnvoye = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("rappels_echeance")
        .update({ statut: "envoyé", envoye_le: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rappels_echeance"] });
      toast.success("Rappel marqué envoyé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const quittances = quittancesQ.data ?? [];
  const totalImpaye = quittances
    .filter((q) => q.statut !== "payée")
    .reduce((s, q) => s + Number(q.montant_total), 0);
  const nbImpayes = quittances.filter((q) => q.statut !== "payée").length;

  return {
    quittances,
    etats: etatsQ.data ?? [],
    rappels: rappelsQ.data ?? [],
    totalImpaye,
    nbImpayes,
    isLoading: quittancesQ.isLoading,
    genererMois,
    marquerPayee,
    lancerPenalitesRappels,
    ajouterEtatLieux,
    marquerRappelEnvoye,
  };
}
