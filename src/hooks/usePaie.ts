import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { telechargerBulletin } from "@/services/paieService";

export function usePaie() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const bulletinsQuery = useQuery({
    queryKey: ["bulletins_paie"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulletins_paie")
        .select("*, employes(nom, poste)")
        .order("mois", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const generer = useMutation({
    mutationFn: async (mois: string) => {
      const { data, error } = await supabase.rpc("generer_bulletins_mensuels", { p_mois: mois });
      if (error) throw error;
      return data;
    },
    onSuccess: (n) => {
      toast.success(`${n} bulletin(s) généré(s)`);
      qc.invalidateQueries({ queryKey: ["bulletins_paie"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const valider = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("valider_bulletin_et_creer_depense", { p_bulletin_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bulletin validé · dépense créée");
      qc.invalidateQueries({ queryKey: ["bulletins_paie"] });
      qc.invalidateQueries({ queryKey: ["depenses"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const marquerPaye = useMutation({
    mutationFn: async ({ id, mode }: { id: string; mode: string }) => {
      const { error } = await supabase
        .from("bulletins_paie")
        .update({ statut: "payé", date_paiement: new Date().toISOString().slice(0, 10), mode_paiement: mode })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bulletin marqué payé");
      qc.invalidateQueries({ queryKey: ["bulletins_paie"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exporterPDF = (b: any) => {
    telechargerBulletin({
      numero: b.numero,
      mois: b.mois,
      employe_nom: b.employes?.nom ?? "—",
      employe_poste: b.employes?.poste,
      salaire_brut: Number(b.salaire_brut),
      prime: Number(b.prime),
      heures_sup: Number(b.heures_sup),
      cnps_employe: Number(b.cnps_employe),
      cnps_employeur: Number(b.cnps_employeur),
      irpp: Number(b.irpp),
      autres_retenues: Number(b.autres_retenues),
      salaire_net: Number(b.salaire_net),
      cout_total_employeur: Number(b.cout_total_employeur),
    });
  };

  const bulletins = bulletinsQuery.data ?? [];
  const masseSalarialeMois = (() => {
    const m = new Date().toISOString().slice(0, 7);
    return bulletins
      .filter((b: any) => b.mois?.startsWith(m))
      .reduce((s: number, b: any) => s + Number(b.cout_total_employeur), 0);
  })();

  return { bulletins, masseSalarialeMois, isLoading: bulletinsQuery.isLoading, generer, valider, marquerPaye, exporterPDF };
}
