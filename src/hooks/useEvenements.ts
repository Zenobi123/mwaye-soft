import { useMemo } from "react";
import {
  salles,
  evenements,
  getUpcomingEvents,
  getAvailableSalles,
} from "@/services/evenementService";

export function useEvenements() {
  const upcoming = useMemo(() => getUpcomingEvents(), []);
  const available = useMemo(() => getAvailableSalles(), []);

  return {
    salles,
    evenements,
    upcoming,
    available,
  };
}
