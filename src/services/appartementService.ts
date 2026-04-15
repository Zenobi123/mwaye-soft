import type { Appartement } from "@/types";

export const apartments: Appartement[] = [
  { id: "A1", type: "Meublé", rooms: 3, rent: 42000, tenant: "Famille Cherif", status: "loué", paid: true },
  { id: "A2", type: "Meublé", rooms: 2, rent: 32000, tenant: "Yacine M.", status: "loué", paid: true },
  { id: "A3", type: "Non meublé", rooms: 3, rent: 28000, tenant: "—", status: "disponible", paid: false },
  { id: "B1", type: "Meublé", rooms: 4, rent: 55000, tenant: "Société ABC", status: "loué", paid: false },
  { id: "B2", type: "Non meublé", rooms: 2, rent: 22000, tenant: "Nadia K.", status: "loué", paid: true },
  { id: "B3", type: "Meublé", rooms: 3, rent: 35000, tenant: "Ali B.", status: "loué", paid: true },
  { id: "C1", type: "Non meublé", rooms: 4, rent: 30000, tenant: "—", status: "maintenance", paid: false },
  { id: "C2", type: "Meublé", rooms: 2, rent: 30000, tenant: "—", status: "disponible", paid: false },
];

export function getOccupiedApartments(): Appartement[] {
  return apartments.filter((a) => a.status === "loué");
}

export function getMonthlyRentTotal(): number {
  return getOccupiedApartments().reduce((s, a) => s + a.rent, 0);
}

export function getUnpaidApartments(): Appartement[] {
  return apartments.filter((a) => a.status === "loué" && !a.paid);
}
