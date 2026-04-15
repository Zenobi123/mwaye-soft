import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSport } from "@/hooks/useSport";
import { STATUS_COLORS, formatAmount } from "@/config/app";

export const Route = createFileRoute("/salles-sport")({
  component: SallesSportPage,
  head: () => ({
    meta: [
      { title: "Salles de sport — MWAYE HOUSE" },
      { name: "description", content: "Gestion des salles de sport et abonnements" },
    ],
  }),
});

function SallesSportPage() {
  const { salles, abonnes } = useSport();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Salles de sport</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestion des salles et des abonnements</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Nouvel abonné
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {salles.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-card-foreground">{s.name}</h3>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[s.status])}>
                  {s.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                <Users className="h-3.5 w-3.5" />
                {s.current}/{s.capacity} places
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(s.current / s.capacity) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Revenu mensuel : <span className="font-semibold text-card-foreground">{formatAmount(s.revenue)}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">Abonnés récents</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Salle</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Expiration</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {abonnes.map((a) => (
                <tr key={a.name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{a.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{a.type}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{a.salle}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{a.expiry}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[a.status])}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
