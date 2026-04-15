import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEvenementsData } from "@/hooks/useEvenementsData";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { SalleFeteForm } from "@/components/evenements/SalleFeteForm";
import { ReservationForm } from "@/components/evenements/ReservationForm";

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
  const { salles, reservations, isLoading, addSalle, addReservation, deleteReservation } = useEvenementsData();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Événements</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {salles.length} salle(s) · {reservations.length} réservation(s)
            </p>
          </div>
          <div className="flex gap-2">
            <SalleFeteForm onSubmit={(v) => addSalle.mutate(v)} isPending={addSalle.isPending} />
            <ReservationForm salles={salles} onSubmit={(v) => addReservation.mutate(v)} isPending={addReservation.isPending} />
          </div>
        </div>

        {salles.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Aucune salle. Ajoutez votre première salle de fêtes.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {salles.map((h) => (
              <div key={h.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-card-foreground">{h.nom}</h3>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[h.statut] || "")}>
                    {h.statut}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{h.capacite} places · {formatAmount(Number(h.prix_journalier))}/jour</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">Réservations</h3>
          </div>
          {reservations.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted-foreground">Aucune réservation</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Événement</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Salle</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Invités</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{e.titre}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{e.date_evenement} · {e.heure_debut}-{e.heure_fin}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{(e as any).salles_fetes?.nom ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{e.nombre_invites}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[e.statut] || "")}>
                        {e.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">{formatAmount(Number(e.montant))}</td>
                    <td className="px-2 py-3.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteReservation.mutate(e.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
