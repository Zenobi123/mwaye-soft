import type { SalleSport, Abonne } from "@/types";

export const sallesSport: SalleSport[] = [
  { name: "Salle Musculation", capacity: 40, current: 28, status: "active", revenue: 185000 },
  { name: "Salle Cardio", capacity: 30, current: 14, status: "active", revenue: 120000 },
  { name: "Salle Fitness (Femmes)", capacity: 25, current: 18, status: "active", revenue: 95000 },
  { name: "Salle Arts Martiaux", capacity: 20, current: 0, status: "fermée", revenue: 0 },
];

export const abonnes: Abonne[] = [
  { name: "Ahmed Khelifi", type: "Mensuel", salle: "Musculation", expiry: "30/04/2026", status: "actif" },
  { name: "Karim Messaoudi", type: "Trimestriel", salle: "Cardio", expiry: "15/06/2026", status: "actif" },
  { name: "Sara Larbi", type: "Mensuel", salle: "Fitness", expiry: "20/04/2026", status: "actif" },
  { name: "Mohamed Benali", type: "Annuel", salle: "Musculation", expiry: "01/01/2027", status: "actif" },
  { name: "Amira Hadj", type: "Mensuel", salle: "Fitness", expiry: "12/04/2026", status: "expiré" },
];

export function getActiveSalles(): SalleSport[] {
  return sallesSport.filter((s) => s.status === "active");
}

export function getTotalAbonnes(): number {
  return abonnes.filter((a) => a.status === "actif").length;
}

export function getTotalSportRevenue(): number {
  return sallesSport.reduce((s, salle) => s + salle.revenue, 0);
}
