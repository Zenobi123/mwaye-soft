export type RecetteCategory =
  | "Sport"
  | "Appartement"
  | "Événement"
  | "Hammam";

export type PaymentMethod = "Espèces" | "Virement" | "Chèque" | "CB";

export interface Recette {
  id: number;
  label: string;
  category: RecetteCategory;
  amount: number;
  date: string;
  method: PaymentMethod;
}
