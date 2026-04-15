import type { Recette } from "@/types";

export const recettes: Recette[] = [
  { id: 1, label: "Abonnement salle - Ahmed K.", category: "Sport", amount: 5000, date: "14/04/2026", method: "Espèces" },
  { id: 2, label: "Location Appt B3 - Mars", category: "Appartement", amount: 35000, date: "13/04/2026", method: "Virement" },
  { id: 3, label: "Réservation Salle Diamant - Mariage", category: "Événement", amount: 80000, date: "12/04/2026", method: "Chèque" },
  { id: 4, label: "Hammam - 15 entrées", category: "Hammam", amount: 7500, date: "11/04/2026", method: "Espèces" },
  { id: 5, label: "Abonnement salle - Karim M.", category: "Sport", amount: 5000, date: "11/04/2026", method: "Espèces" },
  { id: 6, label: "Location Appt A1 - Avril", category: "Appartement", amount: 42000, date: "10/04/2026", method: "Virement" },
  { id: 7, label: "Séminaire entreprise", category: "Événement", amount: 45000, date: "09/04/2026", method: "Virement" },
  { id: 8, label: "Abonnement salle - Sara L.", category: "Sport", amount: 4000, date: "09/04/2026", method: "Espèces" },
];

export function getTotalRecettes(): number {
  return recettes.reduce((sum, r) => sum + r.amount, 0);
}

export function getRecettesByCategory(category: Recette["category"]): Recette[] {
  return recettes.filter((r) => r.category === category);
}

export function getRecentRecettes(limit = 6): Recette[] {
  return recettes.slice(0, limit);
}
