import { useMemo } from "react";
import {
  depenses,
  getTotalDepenses,
  getDepensesByStatus,
} from "@/services/depenseService";

export function useDepenses() {
  const total = useMemo(() => getTotalDepenses(), []);

  return {
    depenses,
    total,
    payees: getDepensesByStatus("payé"),
    enAttente: getDepensesByStatus("en attente"),
  };
}
