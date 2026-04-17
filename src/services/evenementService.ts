import type { Evenement, Salle } from "@/types";

export const salles: Salle[] = [
  { name: "Salle Diamant", capacity: 500, price: "80 000 F CFA", status: "réservée" },
  { name: "Salle Émeraude", capacity: 300, price: "60 000 F CFA", status: "disponible" },
  { name: "Salle Saphir", capacity: 200, price: "45 000 F CFA", status: "disponible" },
  { name: "Salle Rubis", capacity: 100, price: "30 000 F CFA", status: "maintenance" },
];

export const evenements: Evenement[] = [
  { id: 1, title: "Mariage - Famille Benali", date: "18/04/2026", time: "14:00 - 23:00", hall: "Salle Diamant", guests: 450, amount: 120000, status: "confirmé" },
  { id: 2, title: "Séminaire Tech", date: "20/04/2026", time: "09:00 - 17:00", hall: "Salle Émeraude", guests: 150, amount: 75000, status: "confirmé" },
  { id: 3, title: "Anniversaire privé", date: "22/04/2026", time: "18:00 - 00:00", hall: "Salle Saphir", guests: 80, amount: 55000, status: "en attente" },
  { id: 4, title: "Conférence régionale", date: "25/04/2026", time: "08:00 - 18:00", hall: "Salle Diamant", guests: 400, amount: 100000, status: "confirmé" },
  { id: 5, title: "Gala de charité", date: "30/04/2026", time: "19:00 - 23:00", hall: "Salle Émeraude", guests: 250, amount: 90000, status: "en attente" },
];

export function getUpcomingEvents(limit = 4): Evenement[] {
  return evenements.slice(0, limit);
}

export function getAvailableSalles(): Salle[] {
  return salles.filter((s) => s.status === "disponible");
}
