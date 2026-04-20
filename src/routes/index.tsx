import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { FacilityStatus } from "@/components/dashboard/FacilityStatus";
import { useDashboardData } from "@/hooks/useDashboardData";
import { usePaie } from "@/hooks/usePaie";
import { useConges } from "@/hooks/useConges";
import { formatAmount } from "@/config/app";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Loader2,
  Wallet,
  CalendarDays,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "MWAYE HOUSE — Tableau de bord" },
      { name: "description", content: "Gestion commerciale du complexe MWAYE HOUSE" },
    ],
  }),
});

function Dashboard() {
  const { recettesJour, depensesJour, recettesSemaine, recentRecettes, recentDepenses, loading } = useDashboardData();
  const benefice = recettesJour - depensesJour;
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vue d'ensemble de votre complexe — {today}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KpiCard
                title="Recettes du jour"
                value={formatAmount(recettesJour)}
                changeType="positive"
                icon={ArrowDownCircle}
                iconBg="bg-success/10 text-success"
              />
              <KpiCard
                title="Dépenses du jour"
                value={formatAmount(depensesJour)}
                changeType="neutral"
                icon={ArrowUpCircle}
                iconBg="bg-destructive/10 text-destructive"
              />
              <KpiCard
                title="Bénéfice net du jour"
                value={formatAmount(benefice)}
                changeType={benefice >= 0 ? "positive" : "negative"}
                icon={TrendingUp}
                iconBg="bg-primary/10 text-primary"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <RevenueChart data={recettesSemaine} />
              </div>
              <div className="lg:col-span-2">
                <FacilityStatus />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <RecentTransactions recettes={recentRecettes} depenses={recentDepenses} />
              <UpcomingEvents />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
