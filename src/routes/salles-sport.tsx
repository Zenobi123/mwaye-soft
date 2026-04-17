import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Trash2, Loader2, Dumbbell, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { useSallesSport, useAbonnementsSport, useSeancesSport } from "@/hooks/useSportData";
import { SalleForm } from "@/components/sport/SalleForm";
import { AbonneForm } from "@/components/sport/AbonneForm";
import { SeanceForm } from "@/components/sport/SeanceForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/layout/BackButton";

export const Route = createFileRoute("/salles-sport")({
  component: SallesSportPage,
  head: () => ({
    meta: [
      { title: "Salles de sport — MWAYE HOUSE" },
      { name: "description", content: "Gestion des salles de sport et abonnements" },
    ],
  }),
});

function SallesSportPage() {
  const { salles, loading: loadingSalles, add: addSalle, remove: removeSalle } = useSallesSport();
  const { abonnements, loading: loadingAb, add: addAbonne, remove: removeAbonne } = useAbonnementsSport();
  const { seances, loading: loadingSe, add: addSeance } = useSeancesSport();

  const isLoading = loadingSalles || loadingAb || loadingSe;

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Salles de sport</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestion des salles, abonnements et séances</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <SalleForm onSubmit={addSalle} />
            <AbonneForm salles={salles} onSubmit={addAbonne} />
            <SeanceForm salles={salles} onSubmit={addSeance} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Salles grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {salles.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-8">Aucune salle. Ajoutez-en une ci-dessus.</p>
              )}
              {salles.map((s) => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-card-foreground">{s.nom}</h3>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[s.statut] || "bg-muted text-muted-foreground")}>
                      {s.statut}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <Users className="h-3.5 w-3.5" />
                    {s.occupees}/{s.capacite} places
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-3">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.capacite > 0 ? (s.occupees / s.capacite) * 100 : 0}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Revenu : <span className="font-semibold text-card-foreground">{formatAmount(Number(s.revenu_mensuel))}</span>
                    </p>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeSalle(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs for abonnés and séances */}
            <Tabs defaultValue="abonnes">
              <TabsList>
                <TabsTrigger value="abonnes" className="gap-1"><Dumbbell className="h-3.5 w-3.5" /> Abonnés ({abonnements.length})</TabsTrigger>
                <TabsTrigger value="seances" className="gap-1"><CalendarDays className="h-3.5 w-3.5" /> Séances ({seances.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="abonnes">
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Nom</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Salle</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Montant</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Expiration</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                        <th className="px-5 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {abonnements.length === 0 && (
                        <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Aucun abonné</td></tr>
                      )}
                      {abonnements.map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-card-foreground">{a.nom_abonne}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{a.type_abonnement}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{a.salles_sport?.nom ?? "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{formatAmount(Number(a.montant))}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{new Date(a.date_fin).toLocaleDateString("fr-FR")}</td>
                          <td className="px-5 py-3.5">
                            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[a.statut] || "bg-muted text-muted-foreground")}>
                              {a.statut}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeAbonne(a.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="seances">
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Salle</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Horaire</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
                        <th className="px-5 py-3 text-left font-medium text-muted-foreground">Participants</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {seances.length === 0 && (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucune séance</td></tr>
                      )}
                      {seances.map((s) => (
                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 text-card-foreground">{new Date(s.date_seance).toLocaleDateString("fr-FR")}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{s.salles_sport?.nom ?? "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{s.heure_debut?.slice(0, 5)} – {s.heure_fin?.slice(0, 5)}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{s.type_seance}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{s.participants}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  );
}
