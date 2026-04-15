import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppartementsData } from "@/hooks/useAppartementsData";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { AppartementForm } from "@/components/appartements/AppartementForm";
import { ContratForm } from "@/components/appartements/ContratForm";

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
  const { appartements, contrats, occupied, monthlyTotal, isLoading, addAppartement, addContrat } = useAppartementsData();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appartements</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {occupied.length}/{appartements.length} loués · Revenu mensuel : {formatAmount(monthlyTotal)}
            </p>
          </div>
          <div className="flex gap-2">
            <ContratForm appartements={appartements} onSubmit={(v) => addContrat.mutate(v)} isPending={addContrat.isPending} />
            <AppartementForm onSubmit={(v) => addAppartement.mutate(v)} isPending={addAppartement.isPending} />
          </div>
        </div>

        {appartements.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun appartement. Ajoutez votre premier appartement.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {appartements.map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-card-foreground">Appt {a.numero}</h3>
                  </div>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[a.statut] || "")}>
                    {a.statut}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{a.type_appartement} · {a.nombre_pieces} pièces</p>
                <p className="text-sm font-semibold text-card-foreground">{formatAmount(Number(a.loyer))}/mois</p>
                {a.locataire && a.locataire !== "—" && (
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{a.locataire}</p>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      a.paye ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      {a.paye ? "payé" : "impayé"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {contrats.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-card-foreground">Contrats de bail</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Appartement</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Locataire</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Période</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Loyer</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Caution</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contrats.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">Appt {(c as any).appartements?.numero ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.locataire}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.date_debut} → {c.date_fin}</td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{formatAmount(Number(c.loyer_mensuel))}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{formatAmount(Number(c.caution))}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[c.statut] || "")}>
                        {c.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
