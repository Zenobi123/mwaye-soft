import { useMemo } from "react";
import {
  recettes,
  getTotalRecettes,
  getRecettesByCategory,
  getRecentRecettes,
} from "@/services/recetteService";
import type { Recette } from "@/types";

export function useRecettes() {
  const total = useMemo(() => getTotalRecettes(), []);

  return {
    recettes,
    total,
    getByCategory: (cat: Recette["category"]) => getRecettesByCategory(cat),
    recent: getRecentRecettes(),
  };
}
