import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import { toast } from "sonner";
import { telechargerBulletin } from "@/services/paieService";

interface BulletinRow {
  id: string;
  numero: string;
  mois: string;
  salaire_brut: number | string | null;
  prime: number | string | null;
  heures_sup: number | string | null;
  cnps_employe: number | string | null;
  cnps_employeur: number | string | null;
  accidents_travail: number | string | null;
  cfc_employe: number | string | null;
  cfc_employeur: number | string | null;
  fne_employeur: number | string | null;
  irpp: number | string | null;
  rav: number | string | null;
  tdl: number | string | null;
  autres_retenues: number | string | null;
  salaire_net: number | string | null;
  cout_total_employeur: number | string | null;
  jours_travailles: number | null;
  heures_normales: number | string | null;
  statut: string;
  employes?: {
    nom: string | null;
    poste?: string | null;
    matricule_cnps?: string | null;
    niu_employe?: string | null;
    date_embauche?: string | null;
  } | null;
}

const num = (v: number | string | null | undefined): number => Number(v ?? 0);

export function usePaie() {
  const { user } = useAuth();
  const { settings } = useAppSettings();
  const qc = useQueryClient();

  const bulletinsQuery = useQuery({
    queryKey: ["bulletins_paie"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulletins_paie")
        .select("*, employes(nom, poste, matricule_cnps, niu_employe, date_embauche)")
        .order("mois", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as BulletinRow[];
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

  const exporterPDF = (b: BulletinRow) => {
    telechargerBulletin({
      numero: b.numero,
      mois: b.mois,
      employe_nom: b.employes?.nom ?? "—",
      employe_poste: b.employes?.poste,
      employe_matricule_cnps: b.employes?.matricule_cnps,
      employe_niu: b.employes?.niu_employe,
      employe_date_embauche: b.employes?.date_embauche,
      jours_travailles: b.jours_travailles ?? 30,
      heures_normales: num(b.heures_normales) || 173.33,
      salaire_brut: num(b.salaire_brut),
      prime: num(b.prime),
      heures_sup: num(b.heures_sup),
      cnps_employe: num(b.cnps_employe),
      cfc_employe: num(b.cfc_employe),
      irpp: num(b.irpp),
      rav: num(b.rav),
      tdl: num(b.tdl),
      autres_retenues: num(b.autres_retenues),
      salaire_net: num(b.salaire_net),
      cnps_employeur: num(b.cnps_employeur),
      accidents_travail: num(b.accidents_travail),
      cfc_employeur: num(b.cfc_employeur),
      fne_employeur: num(b.fne_employeur),
      cout_total_employeur: num(b.cout_total_employeur),
      societe_nom: settings.complex_name,
      societe_niu: settings.niu,
      societe_rccm: settings.rccm,
      societe_adresse: settings.adresse,
      societe_telephone: settings.telephone,
    });
  };

  const bulletins = bulletinsQuery.data ?? [];
  const masseSalarialeMois = (() => {
    const m = new Date().toISOString().slice(0, 7);
    return bulletins
      .filter((b) => b.mois?.startsWith(m))
      .reduce((s: number, b) => s + num(b.cout_total_employeur), 0);
  })();

  return { bulletins, masseSalarialeMois, isLoading: bulletinsQuery.isLoading, generer, valider, marquerPaye, exporterPDF };
}
