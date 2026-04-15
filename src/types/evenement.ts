export type EvenementStatus = "confirmé" | "en attente" | "annulé";
export type SalleStatus = "disponible" | "réservée" | "maintenance";

export interface Salle {
  name: string;
  capacity: number;
  price: string;
  status: SalleStatus;
}

export interface Evenement {
  id: number;
  title: string;
  date: string;
  time: string;
  hall: string;
  guests: number;
  amount: number;
  status: EvenementStatus;
}
