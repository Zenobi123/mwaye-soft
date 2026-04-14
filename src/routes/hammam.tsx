import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Droplets, Users, ThermometerSun } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hammam")({
  component: HammamPage,
  head: () => ({
    meta: [
      { title: "Hammam — GestiComplex" },
      { name: "description", content: "Gestion du hammam" },
    ],
  }),
});

const sections = [
  { name: "Hammam Hommes", status: "ouvert", visitors: 12, capacity: 25, temp: "45°C", revenue: 62000 },
  { name: "Hammam Femmes", status: "maintenance", visitors: 0, capacity: 20, temp: "—", revenue: 0 },
];

const entries = [
  { time: "08:30", name: "Client #1-12", section: "Hommes", type: "Entrée simple", amount: 500 },
  { time: "09:00", name: "Client #13-18", section: "Hommes", type: "Entrée + Gommage", amount: 1000 },
  { time: "10:15", name: "Client #19-22", section: "Hommes", type: "Forfait VIP", amount: 2000 },
];

function HammamPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hammam</h1>
          <p className="text-sm text-muted-foreground mt-1">État et gestion des hammams</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-card-foreground">{s.name}</h3>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                  s.status === "ouvert" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}>
                  {s.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold text-card-foreground">{s.visitors}/{s.capacity}</p>
                    <p className="text-[11px] text-muted-foreground">Visiteurs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold text-card-foreground">{s.temp}</p>
                    <p className="text-[11px] text-muted-foreground">Température</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold text-card-foreground">{s.revenue.toLocaleString("fr-FR")}</p>
                    <p className="text-[11px] text-muted-foreground">DA ce mois</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">Entrées du jour</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Heure</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Clients</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Section</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.map((e, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-muted-foreground">{e.time}</td>
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{e.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.section}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.type}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">
                    +{e.amount.toLocaleString("fr-FR")} DA
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
