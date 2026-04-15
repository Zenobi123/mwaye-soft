export interface KpiData {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  iconName: string;
  iconBg: string;
}

export interface WeeklyChartPoint {
  name: string;
  recettes: number;
  depenses: number;
}

export interface Transaction {
  id: number;
  label: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export interface FacilityStatusData {
  name: string;
  status: "active" | "disponible" | "réservée" | "maintenance";
  occupancy: number;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  hall: string;
  status: "confirmé" | "en attente";
}
