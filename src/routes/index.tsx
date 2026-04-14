import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { FacilityStatus } from "@/components/dashboard/FacilityStatus";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "MWAYE HOUSE — Tableau de bord" },
      { name: "description", content: "Gestion commerciale du complexe MWAYE HOUSE : sport, événementiel et location" },
    ],
  }),
});

function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vue d'ensemble de votre complexe — 14 Avril 2026
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Recettes du jour"
            value="127 500 DA"
            change="+12.5% vs hier"
            changeType="positive"
            icon={ArrowDownCircle}
            iconBg="bg-success/10 text-success"
          />
          <KpiCard
            title="Dépenses du jour"
            value="23 200 DA"
            change="-5.2% vs hier"
            changeType="positive"
            icon={ArrowUpCircle}
            iconBg="bg-destructive/10 text-destructive"
          />
          <KpiCard
            title="Appartements loués"
            value="18 / 24"
            change="75% d'occupation"
            changeType="neutral"
            icon={Building2}
            iconBg="bg-info/10 text-info"
          />
          <KpiCard
            title="Abonnés actifs"
            value="342"
            change="+28 ce mois"
            changeType="positive"
            icon={Users}
            iconBg="bg-primary/10 text-primary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevenueChart />
          </div>
          <div className="lg:col-span-2">
            <FacilityStatus />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentTransactions />
          <UpcomingEvents />
        </div>
      </div>
    </AppLayout>
  );
}
