export type SalleSportStatus = "active" | "fermée" | "maintenance";
export type AbonnementType = "Mensuel" | "Trimestriel" | "Annuel";
export type AbonneStatus = "actif" | "expiré" | "suspendu";

export interface SalleSport {
  name: string;
  capacity: number;
  current: number;
  status: SalleSportStatus;
  revenue: number;
}

export interface Abonne {
  name: string;
  type: AbonnementType;
  salle: string;
  expiry: string;
  status: AbonneStatus;
}
