import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Droplets, Users, ThermometerSun, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHammamData } from "@/hooks/useHammamData";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { SectionForm } from "@/components/hammam/SectionForm";
import { EntreeForm } from "@/components/hammam/EntreeForm";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/layout/BackButton";

export const Route = createFileRoute("/hammam")({
  component: HammamPage,
  head: () => ({
    meta: [
      { title: "Hammam — MWAYE HOUSE" },
      { name: "description", content: "Gestion du hammam" },
    ],
  }),
});

function HammamPage() {
  const { sections, entrees, totalRevenue, isLoading, addSection, addEntree, deleteEntree } = useHammamData();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hammam</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {sections.length} section(s) · Revenu mensuel : {formatAmount(totalRevenue)}
            </p>
          </div>
          <div className="flex gap-2">
            <EntreeForm sections={sections} onSubmit={(v) => addEntree.mutate(v)} isPending={addEntree.isPending} />
            <SectionForm onSubmit={(v) => addSection.mutate(v)} isPending={addSection.isPending} />
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Droplets className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune section. Ajoutez votre première section hammam.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((s) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-card-foreground">{s.nom}</h3>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[s.statut] || "")}>
                    {s.statut}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-bold text-card-foreground">{s.visiteurs}/{s.capacite}</p>
                      <p className="text-[11px] text-muted-foreground">Visiteurs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-bold text-card-foreground">{s.temperature}</p>
                      <p className="text-[11px] text-muted-foreground">Température</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-bold text-card-foreground">{Number(s.revenu_mensuel).toLocaleString("fr-FR")}</p>
                      <p className="text-[11px] text-muted-foreground">F CFA ce mois</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">Entrées récentes</h3>
          </div>
          {entrees.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted-foreground">Aucune entrée enregistrée</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Heure</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Section</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entrees.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-muted-foreground">{e.date_entree}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{e.heure}</td>
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{e.nom_client}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{(e as unknown).hammam_sections?.nom ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{e.type_service}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">+{formatAmount(Number(e.montant))}</td>
                    <td className="px-2 py-3.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteEntree.mutate(e.id)}>
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
