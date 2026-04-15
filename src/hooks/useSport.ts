import { useMemo } from "react";
import {
  sallesSport,
  abonnes,
  getActiveSalles,
  getTotalAbonnes,
  getTotalSportRevenue,
} from "@/services/sportService";

export function useSport() {
  const active = useMemo(() => getActiveSalles(), []);
  const totalAbonnes = useMemo(() => getTotalAbonnes(), []);
  const totalRevenue = useMemo(() => getTotalSportRevenue(), []);

  return {
    salles: sallesSport,
    abonnes,
    active,
    totalAbonnes,
    totalRevenue,
  };
}
