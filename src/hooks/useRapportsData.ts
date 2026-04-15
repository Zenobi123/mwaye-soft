import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

interface Filters {
  dateDebut: string;
  dateFin: string;
}

export function useRapportsData(filters: Filters) {
  const { user } = useAuth();

  const recettesQuery = useQuery({
    queryKey: ["rapports_recettes", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recettes")
        .select("montant, categorie, date_recette, mode_paiement")
        .gte("date_recette", filters.dateDebut)
        .lte("date_recette", filters.dateFin)
        .order("date_recette");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const depensesQuery = useQuery({
    queryKey: ["rapports_depenses", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("depenses")
        .select("montant, categorie, date_depense, mode_paiement")
        .gte("date_depense", filters.dateDebut)
        .lte("date_depense", filters.dateFin)
        .order("date_depense");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const recettes = recettesQuery.data ?? [];
  const depenses = depensesQuery.data ?? [];

  const stats = useMemo(() => {
    const totalRecettes = recettes.reduce((s, r) => s + Number(r.montant), 0);
    const totalDepenses = depenses.reduce((s, d) => s + Number(d.montant), 0);
    const benefice = totalRecettes - totalDepenses;

    // Par catégorie recettes
    const recettesParCategorie: Record<string, number> = {};
    recettes.forEach((r) => {
      recettesParCategorie[r.categorie] = (recettesParCategorie[r.categorie] || 0) + Number(r.montant);
    });

    // Par catégorie dépenses
    const depensesParCategorie: Record<string, number> = {};
    depenses.forEach((d) => {
      depensesParCategorie[d.categorie] = (depensesParCategorie[d.categorie] || 0) + Number(d.montant);
    });

    // Par mode de paiement
    const parModePaiement: Record<string, number> = {};
    [...recettes, ...depenses].forEach((item) => {
      parModePaiement[item.mode_paiement] = (parModePaiement[item.mode_paiement] || 0) + Number(item.montant);
    });

    // Par semaine (regroupement)
    const parSemaine: Record<string, { recettes: number; depenses: number }> = {};
    recettes.forEach((r) => {
      const d = new Date(r.date_recette);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toISOString().slice(0, 10);
      if (!parSemaine[key]) parSemaine[key] = { recettes: 0, depenses: 0 };
      parSemaine[key].recettes += Number(r.montant);
    });
    depenses.forEach((dep) => {
      const d = new Date(dep.date_depense);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toISOString().slice(0, 10);
      if (!parSemaine[key]) parSemaine[key] = { recettes: 0, depenses: 0 };
      parSemaine[key].depenses += Number(dep.montant);
    });

    const weeklyData = Object.entries(parSemaine)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({
        name: `Sem ${date.slice(5)}`,
        ...vals,
      }));

    const categoryPieData = Object.entries(recettesParCategorie).map(([name, value]) => ({ name, value }));

    const depensesPieData = Object.entries(depensesParCategorie).map(([name, value]) => ({ name, value }));

    return {
      totalRecettes,
      totalDepenses,
      benefice,
      weeklyData,
      categoryPieData,
      depensesPieData,
      recettesParCategorie,
      depensesParCategorie,
      parModePaiement,
      nbRecettes: recettes.length,
      nbDepenses: depenses.length,
    };
  }, [recettes, depenses]);

  return {
    ...stats,
    recettes,
    depenses,
    isLoading: recettesQuery.isLoading || depensesQuery.isLoading,
  };
}
