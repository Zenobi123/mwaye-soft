import { useMemo } from "react";
import {
  weeklyChartData,
  recentTransactions,
  facilityStatusData,
  upcomingEvents,
  getDailySummary,
} from "@/services/dashboardService";

export function useDashboard() {
  const summary = useMemo(() => getDailySummary(), []);

  return {
    weeklyChartData,
    recentTransactions,
    facilityStatusData,
    upcomingEvents,
    summary,
  };
}
