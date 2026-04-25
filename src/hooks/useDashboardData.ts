import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

export interface FacilityStatusItem {
  name: string;
  status: string;
  occupancy: number;
}

export interface UpcomingEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  hall: string;
  status: string;
}

interface RecentRecette {
  id: string;
  libelle: string;
  montant: number;
  date_recette: string;
  categorie: string;
}

interface RecentDepense {
  id: string;
  libelle: string;
  montant: number;
  date_depense: string;
  categorie: string;
}

interface DashboardData {
  recettesJour: number;
  depensesJour: number;
  recettesSemaine: { name: string; recettes: number; depenses: number }[];
  recentRecettes: RecentRecette[];
  recentDepenses: RecentDepense[];
  facilities: FacilityStatusItem[];
  upcomingEvents: UpcomingEventItem[];
  loading: boolean;
}

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  const days = [];
  const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({ date: d.toISOString().split("T")[0], label: labels[i] });
  }
  return days;
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const weekDates = useMemo(getWeekDates, []);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const weekStart = weekDates[0].date;
      const weekEnd = weekDates[6].date;

      const [
        recTodayRes,
        depTodayRes,
        recWeekRes,
        depWeekRes,
        recentRecRes,
        recentDepRes,
        sallesSportRes,
        sectionsHammamRes,
        sallesFetesRes,
        upcomingResRes,
      ] = await Promise.all([
        supabase.from("recettes").select("montant").eq("date_recette", today),
        supabase.from("depenses").select("montant").eq("date_depense", today),
        supabase.from("recettes").select("montant, date_recette").gte("date_recette", weekStart).lte("date_recette", weekEnd),
        supabase.from("depenses").select("montant, date_depense").gte("date_depense", weekStart).lte("date_depense", weekEnd),
        supabase.from("recettes").select("id, libelle, montant, date_recette, categorie").order("date_recette", { ascending: false }).limit(6),
        supabase.from("depenses").select("id, libelle, montant, date_depense, categorie").order("date_depense", { ascending: false }).limit(6),
        supabase.from("salles_sport").select("nom, statut, capacite, occupees").order("nom"),
        supabase.from("hammam_sections").select("nom, statut, capacite, visiteurs").order("nom"),
        supabase.from("salles_fetes").select("nom, statut").order("nom"),
        supabase
          .from("reservations_evenements")
          .select("id, titre, date_evenement, heure_debut, heure_fin, statut, salles_fetes(nom)")
          .gte("date_evenement", today)
          .order("date_evenement", { ascending: true })
          .limit(5),
      ]);

      const recettesJour = (recTodayRes.data || []).reduce((s, r) => s + Number(r.montant), 0);
      const depensesJour = (depTodayRes.data || []).reduce((s, d) => s + Number(d.montant), 0);

      const recByDate: Record<string, number> = {};
      const depByDate: Record<string, number> = {};
      for (const r of recWeekRes.data || []) {
        recByDate[r.date_recette] = (recByDate[r.date_recette] || 0) + Number(r.montant);
      }
      for (const d of depWeekRes.data || []) {
        depByDate[d.date_depense] = (depByDate[d.date_depense] || 0) + Number(d.montant);
      }
      const recettesSemaine = weekDates.map((wd) => ({
        name: wd.label,
        recettes: recByDate[wd.date] || 0,
        depenses: depByDate[wd.date] || 0,
      }));

      const facilities: FacilityStatusItem[] = [
        ...(sallesSportRes.data || []).map((s) => ({
          name: s.nom,
          status: s.statut,
          occupancy: pct(Number(s.occupees), Number(s.capacite)),
        })),
        ...(sectionsHammamRes.data || []).map((s) => ({
          name: s.nom,
          status: s.statut,
          occupancy: pct(Number(s.visiteurs), Number(s.capacite)),
        })),
        ...(sallesFetesRes.data || []).map((s) => ({
          name: s.nom,
          status: s.statut,
          occupancy: 0,
        })),
      ];

      const upcomingEvents: UpcomingEventItem[] = (upcomingResRes.data || []).map((e) => {
        const dateLabel = new Date(e.date_evenement).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const heureDebut = (e.heure_debut as string).slice(0, 5);
        const heureFin = (e.heure_fin as string).slice(0, 5);
        return {
          id: e.id,
          title: e.titre,
          date: dateLabel,
          time: `${heureDebut} - ${heureFin}`,
          hall: (e as { salles_fetes?: { nom: string } | null }).salles_fetes?.nom ?? "—",
          status: e.statut,
        };
      });

      return {
        recettesJour,
        depensesJour,
        recettesSemaine,
        recentRecettes: (recentRecRes.data as RecentRecette[] | null) ?? [],
        recentDepenses: (recentDepRes.data as RecentDepense[] | null) ?? [],
        facilities,
        upcomingEvents,
      };
    },
    enabled: !!user,
  });

  const empty = {
    recettesJour: 0,
    depensesJour: 0,
    recettesSemaine: [],
    recentRecettes: [],
    recentDepenses: [],
    facilities: [],
    upcomingEvents: [],
  };

  return {
    ...(dashboardQuery.data ?? empty),
    loading: dashboardQuery.isLoading,
  };
}
