import type { WeeklyChartPoint, Transaction, FacilityStatusData, UpcomingEvent } from "@/types";

export const weeklyChartData: WeeklyChartPoint[] = [
  { name: "Lun", recettes: 45000, depenses: 12000 },
  { name: "Mar", recettes: 38000, depenses: 8000 },
  { name: "Mer", recettes: 52000, depenses: 15000 },
  { name: "Jeu", recettes: 61000, depenses: 9500 },
  { name: "Ven", recettes: 78000, depenses: 22000 },
  { name: "Sam", recettes: 95000, depenses: 18000 },
  { name: "Dim", recettes: 42000, depenses: 7000 },
];

export const recentTransactions: Transaction[] = [
  { id: 1, label: "Abonnement salle - Ahmed K.", amount: 5000, type: "income", date: "14 Avr 2026" },
  { id: 2, label: "Facture électricité", amount: -12500, type: "expense", date: "13 Avr 2026" },
  { id: 3, label: "Location Appt B3 - Mars", amount: 35000, type: "income", date: "13 Avr 2026" },
  { id: 4, label: "Réservation Salle Fête - Mariage", amount: 80000, type: "income", date: "12 Avr 2026" },
  { id: 5, label: "Produits nettoyage", amount: -3200, type: "expense", date: "12 Avr 2026" },
  { id: 6, label: "Hammam - 15 entrées", amount: 7500, type: "income", date: "11 Avr 2026" },
];

export const facilityStatusData: FacilityStatusData[] = [
  { name: "Salle Musculation", status: "active", occupancy: 75 },
  { name: "Salle Cardio", status: "active", occupancy: 45 },
  { name: "Hammam Hommes", status: "active", occupancy: 60 },
  { name: "Hammam Femmes", status: "maintenance", occupancy: 0 },
  { name: "Salle Diamant", status: "réservée", occupancy: 100 },
  { name: "Salle Émeraude", status: "disponible", occupancy: 0 },
  { name: "Salle Saphir", status: "disponible", occupancy: 0 },
];

export const upcomingEvents: UpcomingEvent[] = [
  { id: 1, title: "Mariage - Famille Benali", date: "18 Avr 2026", time: "14:00 - 23:00", hall: "Salle Diamant", status: "confirmé" },
  { id: 2, title: "Séminaire entreprise", date: "20 Avr 2026", time: "09:00 - 17:00", hall: "Salle Émeraude", status: "confirmé" },
  { id: 3, title: "Fête d'anniversaire", date: "22 Avr 2026", time: "18:00 - 00:00", hall: "Salle Saphir", status: "en attente" },
  { id: 4, title: "Conférence régionale", date: "25 Avr 2026", time: "08:00 - 18:00", hall: "Salle Diamant", status: "confirmé" },
];

export function getDailySummary() {
  const today = weeklyChartData[weeklyChartData.length - 2]; // Samedi comme "jour record"
  return {
    recettesJour: today.recettes,
    depensesJour: today.depenses,
    beneficeJour: today.recettes - today.depenses,
  };
}
