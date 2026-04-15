import { useMemo } from "react";
import {
  apartments,
  getOccupiedApartments,
  getMonthlyRentTotal,
  getUnpaidApartments,
} from "@/services/appartementService";

export function useAppartements() {
  const occupied = useMemo(() => getOccupiedApartments(), []);
  const monthlyTotal = useMemo(() => getMonthlyRentTotal(), []);
  const unpaid = useMemo(() => getUnpaidApartments(), []);

  return {
    apartments,
    occupied,
    occupancyRate: Math.round((occupied.length / apartments.length) * 100),
    monthlyTotal,
    unpaid,
  };
}
