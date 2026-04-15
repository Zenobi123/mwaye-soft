import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SalleSport = Tables<"salles_sport">;
type AbonnementSport = Tables<"abonnements_sport">;
type SeanceSport = Tables<"seances_sport">;

export function useSallesSport() {
  const [salles, setSalles] = useState<SalleSport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("salles_sport").select("*").order("nom");
    setSalles(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (salle: Omit<SalleSport, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("salles_sport").insert(salle);
    if (error) throw error;
    await fetch();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("salles_sport").delete().eq("id", id);
    if (error) throw error;
    await fetch();
  };

  return { salles, loading, refresh: fetch, add, remove };
}

export function useAbonnementsSport() {
  const [abonnements, setAbonnements] = useState<(AbonnementSport & { salles_sport?: { nom: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("abonnements_sport")
      .select("*, salles_sport(nom)")
      .order("created_at", { ascending: false });
    setAbonnements(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (ab: Omit<AbonnementSport, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("abonnements_sport").insert(ab);
    if (error) throw error;
    await fetch();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("abonnements_sport").delete().eq("id", id);
    if (error) throw error;
    await fetch();
  };

  return { abonnements, loading, refresh: fetch, add, remove };
}

export function useSeancesSport() {
  const [seances, setSeances] = useState<(SeanceSport & { salles_sport?: { nom: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("seances_sport")
      .select("*, salles_sport(nom)")
      .order("date_seance", { ascending: false })
      .limit(50);
    setSeances(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (s: Omit<SeanceSport, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("seances_sport").insert(s);
    if (error) throw error;
    await fetch();
  };

  return { seances, loading, refresh: fetch, add };
}
