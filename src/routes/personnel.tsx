// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Trash2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePersonnelData } from "@/hooks/usePersonnelData";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { EmployeForm } from "@/components/personnel/EmployeForm";
import { PresenceForm } from "@/components/personnel/PresenceForm";
import { BulletinsTab } from "@/components/personnel/BulletinsTab";
import { CongesTab } from "@/components/personnel/CongesTab";
import { PlanningTab } from "@/components/personnel/PlanningTab";
import { BackButton } from "@/components/layout/BackButton";

export const Route = createFileRoute("/personnel")({
  component: PersonnelPage,
  head: () => ({
    meta: [
      { title: "Personnel & Paie — MWAYE HOUSE" },
      { name: "description", content: "Gestion du personnel, paie CNPS, congés et plannings" },
    ],
  }),
});

function PersonnelPage() {
  const { employes, presences, actifs, masseSalariale, isLoading, addEmploye, addPresence, deleteEmploye } = usePersonnelData();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Personnel & Paie</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {actifs.length} actif(s) · Masse salariale brute : {formatAmount(masseSalariale)}
            </p>
          </div>
          <div className="flex gap-2">
            <PresenceForm employes={employes} onSubmit={(v) => addPresence.mutate(v)} isPending={addPresence.isPending} />
            <EmployeForm onSubmit={(v) => addEmploye.mutate(v)} isPending={addEmploye.isPending} />
          </div>
        </div>

        <Tabs defaultValue="employes">
          <TabsList>
            <TabsTrigger value="employes">Employés</TabsTrigger>
            <TabsTrigger value="presences">Présences</TabsTrigger>
            <TabsTrigger value="bulletins">Bulletins de paie</TabsTrigger>
            <TabsTrigger value="conges">Congés</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="employes" className="mt-4">
            {employes.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun employé enregistré.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {employes.map((e) => (
                  <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-card-foreground">{e.nom}</h3>
                      <div className="flex items-center gap-1">
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_COLORS[e.statut] || "bg-muted text-muted-foreground")}>
                          {e.statut}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteEmploye.mutate(e.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{e.poste} · {e.departement}</p>
                    <p className="text-sm font-semibold text-card-foreground mt-1">{formatAmount(Number(e.salaire))}/mois</p>
                    <div className="mt-2 space-y-0.5">
                      {e.telephone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{e.telephone}</p>}
                      {e.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{e.email}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="presences" className="mt-4">
            {presences.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center">
                <p className="text-muted-foreground">Aucune présence enregistrée.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Employé</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Poste</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Arrivée</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Départ</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {presences.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30">
                        <td className="px-5 py-3.5 text-muted-foreground">{p.date_presence}</td>
                        <td className="px-5 py-3.5 font-medium">{(p as unknown).employes?.nom ?? "—"}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{(p as unknown).employes?.poste ?? "—"}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{p.heure_arrivee ?? "—"}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{p.heure_depart ?? "—"}</td>
                        <td className="px-5 py-3.5">
                          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", {
                            "bg-success/10 text-success": p.statut === "présent",
                            "bg-destructive/10 text-destructive": p.statut === "absent",
                            "bg-warning/10 text-warning": p.statut === "retard",
                            "bg-info/10 text-info": p.statut === "congé",
                          })}>{p.statut}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bulletins" className="mt-4">
            <BulletinsTab />
          </TabsContent>

          <TabsContent value="conges" className="mt-4">
            <CongesTab employes={employes} />
          </TabsContent>

          <TabsContent value="planning" className="mt-4">
            <PlanningTab employes={employes} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
