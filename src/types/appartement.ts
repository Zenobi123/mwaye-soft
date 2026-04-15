export type AppartementType = "Meublé" | "Non meublé";
export type AppartementStatus = "loué" | "disponible" | "maintenance";

export interface Appartement {
  id: string;
  type: AppartementType;
  rooms: number;
  rent: number;
  tenant: string;
  status: AppartementStatus;
  paid: boolean;
}
