import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/appartements")({
  component: AppartementsPage,
  head: () => ({
    meta: [
      { title: "Appartements — GestiComplex" },
      { name: "description", content: "Gestion des appartements meublés et non meublés" },
    ],
  }),
});

const apartments = [
  { id: "A1", type: "Meublé", rooms: 3, rent: 42000, tenant: "Famille Cherif", status: "loué", paid: true },
  { id: "A2", type: "Meublé", rooms: 2, rent: 32000, tenant: "Yacine M.", status: "loué", paid: true },
  { id: "A3", type: "Non meublé", rooms: 3, rent: 28000, tenant: "—", status: "disponible", paid: false },
  { id: "B1", type: "Meublé", rooms: 4, rent: 55000, tenant: "Société ABC", status: "loué", paid: false },
  { id: "B2", type: "Non meublé", rooms: 2, rent: 22000, tenant: "Nadia K.", status: "loué", paid: true },
  { id: "B3", type: "Meublé", rooms: 3, rent: 35000, tenant: "Ali B.", status: "loué", paid: true },
  { id: "C1", type: "Non meublé", rooms: 4, rent: 30000, tenant: "—", status: "maintenance", paid: false },
  { id: "C2", type: "Meublé", rooms: 2, rent: 30000, tenant: "—", status: "disponible", paid: false },
];

const statusStyles: Record<string, string> = {
  loué: "bg-success/10 text-success",
  disponible: "bg-info/10 text-info",
  maintenance: "bg-destructive/10 text-destructive",
};

function AppartementsPage() {
  const occupied = apartments.filter((a) => a.status === "loué").length;
  const totalRent = apartments.filter((a) => a.status === "loué").reduce((s, a) => s + a.rent, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appartements</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {occupied}/{apartments.length} loués · Revenu mensuel : {totalRent.toLocaleString("fr-FR")} DA
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
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", statusStyles[a.status])}>
                  {a.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{a.type} · {a.rooms} pièces</p>
              <p className="text-sm font-semibold text-card-foreground">{a.rent.toLocaleString("fr-FR")} DA/mois</p>
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
