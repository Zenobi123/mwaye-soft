export type HammamStatus = "ouvert" | "fermé" | "maintenance";
export type HammamSection = "Hommes" | "Femmes";

export interface HammamSectionData {
  name: string;
  status: HammamStatus;
  visitors: number;
  capacity: number;
  temp: string;
  revenue: number;
}

export interface HammamEntry {
  time: string;
  name: string;
  section: HammamSection;
  type: string;
  amount: number;
}
