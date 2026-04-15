export type DepenseCategory =
  | "Charges"
  | "Entretien"
  | "Personnel"
  | "Maintenance"
  | "Investissement"
  | "Marketing";

export type DepenseStatus = "payé" | "en attente";

export interface Depense {
  id: number;
  label: string;
  category: DepenseCategory;
  amount: number;
  date: string;
  status: DepenseStatus;
}
