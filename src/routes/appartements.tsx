import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppartements } from "@/hooks/useAppartements";
import { STATUS_COLORS, formatAmount } from "@/config/app";

export const Route = createFileRoute("/appartements")({
  component: AppartementsPage,
  head: () => ({
    meta: [
      { title: "Appartements — MWAYE HOUSE" },
      { name: "description", content: "Gestion des appartements meublés et non meublés" },
    ],
  }),
});

function AppartementsPage() {
  const { apartments, occupied, monthlyTotal } = useAppartements();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appartements</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {occupied.length}/{apartments.length} loués · Revenu mensuel : {formatAmount(monthlyTotal)}
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Ajouter un appartement
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apartments.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-card-foreground">Appt {a.id}</h3>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[a.status])}>
                  {a.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{a.type} · {a.rooms} pièces</p>
              <p className="text-sm font-semibold text-card-foreground">{formatAmount(a.rent)}/mois</p>
              {a.tenant !== "—" && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{a.tenant}</p>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    a.paid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {a.paid ? "payé" : "impayé"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
