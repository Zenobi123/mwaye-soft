import { useMemo } from "react";
import {
  hammamSections,
  hammamEntries,
  getTotalHammamRevenue,
} from "@/services/hammamService";

export function useHammam() {
  const totalRevenue = useMemo(() => getTotalHammamRevenue(), []);

  return {
    sections: hammamSections,
    entries: hammamEntries,
    totalRevenue,
  };
}
