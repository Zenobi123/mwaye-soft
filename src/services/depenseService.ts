import type { Depense } from "@/types";

export const depenses: Depense[] = [
  { id: 1, label: "Facture électricité", category: "Charges", amount: 12500, date: "13/04/2026", status: "payé" },
  { id: 2, label: "Produits nettoyage", category: "Entretien", amount: 3200, date: "12/04/2026", status: "payé" },
  { id: 3, label: "Salaires employés - Mars", category: "Personnel", amount: 180000, date: "05/04/2026", status: "payé" },
  { id: 4, label: "Réparation climatisation", category: "Maintenance", amount: 15000, date: "03/04/2026", status: "payé" },
  { id: 5, label: "Facture eau", category: "Charges", amount: 8500, date: "01/04/2026", status: "payé" },
  { id: 6, label: "Équipement sport", category: "Investissement", amount: 45000, date: "28/03/2026", status: "en attente" },
  { id: 7, label: "Publicité réseaux sociaux", category: "Marketing", amount: 5000, date: "25/03/2026", status: "payé" },
];

export function getTotalDepenses(): number {
  return depenses.reduce((sum, d) => sum + d.amount, 0);
}

export function getDepensesByStatus(status: Depense["status"]): Depense[] {
  return depenses.filter((d) => d.status === status);
}
