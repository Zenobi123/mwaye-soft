import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEvenements } from "@/hooks/useEvenements";
import { STATUS_COLORS, formatAmount } from "@/config/app";

export const Route = createFileRoute("/evenements")({
  component: EvenementsPage,
  head: () => ({
    meta: [
      { title: "Événements — MWAYE HOUSE" },
      { name: "description", content: "Gestion des événements et salles de fêtes" },
    ],
  }),
});

function EvenementsPage() {
  const { salles, evenements } = useEvenements();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Événements</h1>
            <p className="text-sm text-muted-foreground mt-1">Salles de fêtes et réservations</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Nouvelle réservation
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {salles.map((h) => (
            <div key={h.name} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-card-foreground">{h.name}</h3>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[h.status])}>
                  {h.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{h.capacity} places · {h.price}/jour</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">Réservations à venir</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Événement</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Salle</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Invités</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {evenements.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{e.title}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.date} · {e.time}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.hall}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.guests}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[e.status])}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">
                    {formatAmount(e.amount)}
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
