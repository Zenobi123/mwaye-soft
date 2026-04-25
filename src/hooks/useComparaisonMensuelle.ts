import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface MoisStat {
  mois: string; // YYYY-MM-01
  label: string;
  recettes: number;
  depenses: number;
  benefice: number;
}

function moisLabel(d: Date) {
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

export function useComparaisonMensuelle(nbMois = 6) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["comparaison_mensuelle", nbMois],
    queryFn: async (): Promise<MoisStat[]> => {
      const today = new Date();
      const mois: { date: Date; debut: string; fin: string }[] = [];
      for (let i = nbMois - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const fin = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
        mois.push({
          date: d,
          debut: d.toISOString().slice(0, 10),
          fin: fin.toISOString().slice(0, 10),
        });
      }
      const debutGlobal = mois[0].debut;
      const finGlobal = mois[mois.length - 1].fin;

      const [recRes, depRes] = await Promise.all([
        supabase
          .from("recettes")
          .select("montant, date_recette, categorie")
          .gte("date_recette", debutGlobal)
          .lte("date_recette", finGlobal),
        supabase
          .from("depenses")
          .select("montant, date_depense, categorie")
          .gte("date_depense", debutGlobal)
          .lte("date_depense", finGlobal),
      ]);

      return mois.map((m) => {
        const rec = (recRes.data || [])
          .filter((r) => r.date_recette >= m.debut && r.date_recette <= m.fin)
          .reduce((s, r) => s + Number(r.montant), 0);
        const dep = (depRes.data || [])
          .filter((d) => d.date_depense >= m.debut && d.date_depense <= m.fin)
          .reduce((s, d) => s + Number(d.montant), 0);
        return {
          mois: m.debut,
          label: moisLabel(m.date),
          recettes: rec,
          depenses: dep,
          benefice: rec - dep,
        };
      });
    },
    enabled: !!user,
  });
}

// Mapping catégories → activités MWAYE HOUSE
const ACTIVITE_MAP: Record<string, string> = {
  // Sport
  "Abonnement Sport": "Sport",
  Sport: "Sport",
  "Salle Sport": "Sport",
  // Hammam
  Hammam: "Hammam",
  "Entrée Hammam": "Hammam",
  // Événementiel
  Événementiel: "Événementiel",
  Evenementiel: "Événementiel",
  "Salle Fête": "Événementiel",
  Réservation: "Événementiel",
  // Immobilier
  Loyer: "Immobilier",
  Location: "Immobilier",
  Quittance: "Immobilier",
  Immobilier: "Immobilier",
  // Commerce
  Facture: "Commerce",
  Devis: "Commerce",
};

export function categorieToActivite(cat: string): string {
  if (ACTIVITE_MAP[cat]) return ACTIVITE_MAP[cat];
  const lower = cat.toLowerCase();
  if (lower.includes("sport") || lower.includes("muscu")) return "Sport";
  if (lower.includes("hammam")) return "Hammam";
  if (lower.includes("event") || lower.includes("event") || lower.includes("salle") || lower.includes("réserv")) return "Événementiel";
  if (lower.includes("loyer") || lower.includes("locat") || lower.includes("quittance") || lower.includes("appart")) return "Immobilier";
  if (lower.includes("factur") || lower.includes("devis") || lower.includes("commerc")) return "Commerce";
  return "Autres";
}

export interface ActiviteStat {
  activite: string;
  recettes: number;
}

export function useRecettesParActivite(nbMois = 6) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["recettes_activite", nbMois],
    queryFn: async (): Promise<{ parMois: { label: string; mois: string; [activite: string]: number | string }[]; repartition: ActiviteStat[]; activites: string[] }> => {
      const today = new Date();
      const debut = new Date(today.getFullYear(), today.getMonth() - nbMois + 1, 1).toISOString().slice(0, 10);
      const { data } = await supabase
        .from("recettes")
        .select("montant, date_recette, categorie")
        .gte("date_recette", debut);

      const moisLabels: { mois: string; label: string }[] = [];
      for (let i = nbMois - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        moisLabels.push({ mois: d.toISOString().slice(0, 10), label: moisLabel(d) });
      }

      const activitesSet = new Set<string>();
      const parMoisMap: Record<string, Record<string, number>> = {};
      const totalParActivite: Record<string, number> = {};

      (data || []).forEach((r) => {
        const act = categorieToActivite(r.categorie);
        activitesSet.add(act);
        const d = new Date(r.date_recette);
        const moisKey = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
        if (!parMoisMap[moisKey]) parMoisMap[moisKey] = {};
        parMoisMap[moisKey][act] = (parMoisMap[moisKey][act] || 0) + Number(r.montant);
        totalParActivite[act] = (totalParActivite[act] || 0) + Number(r.montant);
      });

      const activites = Array.from(activitesSet).sort();
      const parMois = moisLabels.map((m) => {
        const row: { label: string; mois: string; [a: string]: number | string } = { mois: m.mois, label: m.label };
        activites.forEach((a) => {
          row[a] = parMoisMap[m.mois]?.[a] || 0;
        });
        return row;
      });
      const repartition = Object.entries(totalParActivite)
        .map(([activite, recettes]) => ({ activite, recettes }))
        .sort((a, b) => b.recettes - a.recettes);
      return { parMois, repartition, activites };
    },
    enabled: !!user,
  });
}
