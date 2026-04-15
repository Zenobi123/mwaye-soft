import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  recettesJour: number;
  depensesJour: number;
  recettesSemaine: { name: string; recettes: number; depenses: number }[];
  recentRecettes: { id: string; libelle: string; montant: number; date_recette: string; categorie: string }[];
  recentDepenses: { id: string; libelle: string; montant: number; date_depense: string; categorie: string }[];
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

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    recettesJour: 0,
    depensesJour: 0,
    recettesSemaine: [],
    recentRecettes: [],
    recentDepenses: [],
    loading: true,
  });

  const fetch = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0];
    const weekDates = getWeekDates();
    const weekStart = weekDates[0].date;
    const weekEnd = weekDates[6].date;

    const [recTodayRes, depTodayRes, recWeekRes, depWeekRes, recentRecRes, recentDepRes] = await Promise.all([
      supabase.from("recettes").select("montant").eq("date_recette", today),
      supabase.from("depenses").select("montant").eq("date_depense", today),
      supabase.from("recettes").select("montant, date_recette").gte("date_recette", weekStart).lte("date_recette", weekEnd),
      supabase.from("depenses").select("montant, date_depense").gte("date_depense", weekStart).lte("date_depense", weekEnd),
      supabase.from("recettes").select("id, libelle, montant, date_recette, categorie").order("date_recette", { ascending: false }).limit(6),
      supabase.from("depenses").select("id, libelle, montant, date_depense, categorie").order("date_depense", { ascending: false }).limit(6),
    ]);

    const recettesJour = (recTodayRes.data || []).reduce((s, r) => s + Number(r.montant), 0);
    const depensesJour = (depTodayRes.data || []).reduce((s, d) => s + Number(d.montant), 0);

    // Build weekly chart
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

    setData({
      recettesJour,
      depensesJour,
      recettesSemaine,
      recentRecettes: (recentRecRes.data as any[]) || [],
      recentDepenses: (recentDepRes.data as any[]) || [],
      loading: false,
    });
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return data;
}
