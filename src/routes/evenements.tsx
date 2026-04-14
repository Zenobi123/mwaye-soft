import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evenements")({
  component: EvenementsPage,
  head: () => ({
    meta: [
      { title: "Événements — GestiComplex" },
      { name: "description", content: "Gestion des événements et salles de fêtes" },
    ],
  }),
});

const halls = [
  { name: "Salle Diamant", capacity: 500, price: "80 000 DA", status: "réservée" },
  { name: "Salle Émeraude", capacity: 300, price: "60 000 DA", status: "disponible" },
  { name: "Salle Saphir", capacity: 200, price: "45 000 DA", status: "disponible" },
  { name: "Salle Rubis", capacity: 100, price: "30 000 DA", status: "maintenance" },
];

const events = [
  { id: 1, title: "Mariage - Famille Benali", date: "18/04/2026", time: "14:00 - 23:00", hall: "Salle Diamant", guests: 450, amount: 120000, status: "confirmé" },
  { id: 2, title: "Séminaire Tech", date: "20/04/2026", time: "09:00 - 17:00", hall: "Salle Émeraude", guests: 150, amount: 75000, status: "confirmé" },
  { id: 3, title: "Anniversaire privé", date: "22/04/2026", time: "18:00 - 00:00", hall: "Salle Saphir", guests: 80, amount: 55000, status: "en attente" },
  { id: 4, title: "Conférence régionale", date: "25/04/2026", time: "08:00 - 18:00", hall: "Salle Diamant", guests: 400, amount: 100000, status: "confirmé" },
  { id: 5, title: "Gala de charité", date: "30/04/2026", time: "19:00 - 23:00", hall: "Salle Émeraude", guests: 250, amount: 90000, status: "en attente" },
];

const statusStyles: Record<string, string> = {
  disponible: "bg-success/10 text-success",
  réservée: "bg-warning/10 text-warning",
  maintenance: "bg-destructive/10 text-destructive",
  confirmé: "bg-success/10 text-success",
  "en attente": "bg-warning/10 text-warning",
};

function EvenementsPage() {
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
          {halls.map((h) => (
            <div key={h.name} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-card-foreground">{h.name}</h3>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", statusStyles[h.status])}>
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
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{e.title}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.date} · {e.time}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.hall}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.guests}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", statusStyles[e.status])}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">
                    {e.amount.toLocaleString("fr-FR")} DA
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
