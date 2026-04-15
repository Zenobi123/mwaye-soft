import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDevisData } from "@/hooks/useDevisData";
import { useClientsData } from "@/hooks/useClientsData";
import { DevisForm } from "@/components/commercial/DevisForm";
import { STATUS_COLORS, formatAmount } from "@/config/app";

export const Route = createFileRoute("/devis")({
  component: DevisPage,
  head: () => ({
    meta: [
      { title: "Devis — MWAYE HOUSE" },
      { name: "description", content: "Gestion des devis" },
    ],
  }),
});

function DevisPage() {
  const { devis, isLoading, addDevis, deleteDevis } = useDevisData();
  const { clients } = useClientsData();

  const nextNumero = `DEV-${String(devis.length + 1).padStart(4, "0")}`;

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Devis</h1>
            <p className="text-sm text-muted-foreground mt-1">{devis.length} devis</p>
          </div>
          <DevisForm clients={clients} onSubmit={(v) => addDevis.mutate(v)} isPending={addDevis.isPending} nextNumero={nextNumero} />
        </div>

        {devis.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun devis. Créez votre premier devis.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">N°</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Validité</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {devis.map((d) => (
                  <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{d.numero}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{(d as any).clients?.nom ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{d.date_devis}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{d.date_validite ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[d.statut] || "bg-muted text-muted-foreground")}>
                        {d.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{formatAmount(Number(d.montant_total))}</td>
                    <td className="px-2 py-3.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteDevis.mutate(d.id)}>
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
