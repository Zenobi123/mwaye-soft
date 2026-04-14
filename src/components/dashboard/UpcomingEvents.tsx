import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  { id: 1, title: "Mariage - Famille Benali", date: "18 Avr 2026", time: "14:00 - 23:00", hall: "Salle Diamant", status: "confirmé" },
  { id: 2, title: "Séminaire entreprise", date: "20 Avr 2026", time: "09:00 - 17:00", hall: "Salle Émeraude", status: "confirmé" },
  { id: 3, title: "Fête d'anniversaire", date: "22 Avr 2026", time: "18:00 - 00:00", hall: "Salle Saphir", status: "en attente" },
  { id: 4, title: "Conférence régionale", date: "25 Avr 2026", time: "08:00 - 18:00", hall: "Salle Diamant", status: "confirmé" },
];

export function UpcomingEvents() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Événements à venir
        </h3>
      </div>
      <div className="divide-y divide-border">
        {events.map((e) => (
          <div key={e.id} className="px-5 py-3.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">{e.title}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {e.date} · {e.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {e.hall}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  e.status === "confirmé"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                )}
              >
                {e.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
