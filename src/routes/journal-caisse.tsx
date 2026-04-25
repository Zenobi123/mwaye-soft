import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Lock, Unlock, Loader2, Plus, Zap, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/config/app";
import { useState } from "react";
import { useJournalCaisseData } from "@/hooks/useJournalCaisseData";
import { BackButton } from "@/components/layout/BackButton";
import { exportJournalPDF, exportJournalExcel } from "@/services/exportService";

export const Route = createFileRoute("/journal-caisse")({
  component: JournalCaissePage,
  head: () => ({
    meta: [
      { title: "Journal de caisse — MWAYE HOUSE" },
      { name: "description", content: "Journal de caisse quotidien" },
    ],
  }),
});

function JournalCaissePage() {
  const { journals, isLoading, ouvrirJournee, cloturerJournee, cloturerAujourdhui } = useJournalCaisseData();
  const [showNew, setShowNew] = useState(false);

  const handleOpenDay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    ouvrirJournee.mutate(
      {
        date_journal: form.get("date_journal") as string,
        solde_ouverture: parseFloat(form.get("solde_ouverture") as string) || 0,
      },
      { onSuccess: () => setShowNew(false) },
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Journal de caisse</h1>
            <p className="text-sm text-muted-foreground mt-1">Suivi quotidien de la caisse</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportJournalPDF(journals, "30 dernières journées")}
              disabled={journals.length === 0}
            >
              <FileText className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportJournalExcel(journals, "30 dernières journées")}
              disabled={journals.length === 0}
            >
              <Download className="h-4 w-4 mr-1" /> Excel
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => cloturerAujourdhui.mutate()}
              disabled={cloturerAujourdhui.isPending}
            >
              <Zap className="h-4 w-4 mr-1" /> Clôture auto du jour
            </Button>
            <Button size="sm" onClick={() => setShowNew(true)}>
              <Plus className="h-4 w-4 mr-1" /> Ouvrir une journée
            </Button>
          </div>
        </div>

        {showNew && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Nouvelle journée de caisse</h3>
            <form onSubmit={handleOpenDay} className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label htmlFor="date_journal">Date</Label>
                <Input id="date_journal" name="date_journal" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="solde_ouverture">Solde d'ouverture (F CFA)</Label>
                <Input id="solde_ouverture" name="solde_ouverture" type="number" step="1" defaultValue="0" />
              </div>
              <Button type="submit" disabled={ouvrirJournee.isPending}>
                {ouvrirJournee.isPending ? "Création..." : "Ouvrir la journée"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Annuler</Button>
            </form>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : journals.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Aucune journée de caisse. Cliquez sur « Ouvrir une journée » pour commencer.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Ouverture</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Recettes</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Dépenses</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Clôture</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {journals.map((j) => (
                  <tr key={j.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">
                      {new Date(j.date_journal).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">{formatAmount(Number(j.solde_ouverture))}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-success font-medium">+{formatAmount(Number(j.total_recettes))}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-destructive font-medium">-{formatAmount(Number(j.total_depenses))}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-card-foreground">{formatAmount(Number(j.solde_cloture))}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        j.statut === "ouvert" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      )}>
                        {j.statut === "ouvert" ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {j.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {j.statut === "ouvert" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cloturerJournee.mutate(j.id)}
                          disabled={cloturerJournee.isPending}
                        >
                          Clôturer
                        </Button>
                      )}
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
