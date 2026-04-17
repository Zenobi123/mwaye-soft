import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFacturesData } from "@/hooks/useFacturesData";
import { useClientsData } from "@/hooks/useClientsData";
import { FactureForm } from "@/components/commercial/FactureForm";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { BackButton } from "@/components/layout/BackButton";

export const Route = createFileRoute("/factures")({
  component: FacturesPage,
  head: () => ({
    meta: [
      { title: "Factures — MWAYE HOUSE" },
      { name: "description", content: "Gestion des factures" },
    ],
  }),
});

function FacturesPage() {
  const { factures, isLoading, addFacture, updateStatut, deleteFacture } = useFacturesData();
  const { clients } = useClientsData();

  const nextNumero = `FAC-${String(factures.length + 1).padStart(4, "0")}`;

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Factures</h1>
            <p className="text-sm text-muted-foreground mt-1">{factures.length} facture(s)</p>
          </div>
          <FactureForm clients={clients} onSubmit={(v) => addFacture.mutate(v)} isPending={addFacture.isPending} nextNumero={nextNumero} />
        </div>

        {factures.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune facture. Créez votre première facture.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">N°</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Échéance</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {factures.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{f.numero}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{(f as any).clients?.nom ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{f.date_facture}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{f.date_echeance ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={f.statut}
                        onChange={(e) => updateStatut.mutate({ id: f.id, statut: e.target.value })}
                        className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold border-0 bg-transparent cursor-pointer", STATUS_COLORS[f.statut] || "bg-muted text-muted-foreground")}
                      >
                        <option value="brouillon">brouillon</option>
                        <option value="envoyée">envoyée</option>
                        <option value="payée">payée</option>
                        <option value="en retard">en retard</option>
                        <option value="annulée">annulée</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{formatAmount(Number(f.montant_total))}</td>
                    <td className="px-2 py-3.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteFacture.mutate(f.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
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
