// @ts-nocheck
import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Trash2, Download, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFacturesData } from "@/hooks/useFacturesData";
import { useClientsData } from "@/hooks/useClientsData";
import { useAppSettings } from "@/hooks/useAppSettings";
import { FactureForm } from "@/components/commercial/FactureForm";
import { RelancesTab } from "@/components/commercial/RelancesTab";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { BackButton } from "@/components/layout/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportDocumentPDF } from "@/services/documentPdfService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/factures")({
  component: FacturesPage,
  head: () => ({
    meta: [
      { title: "Factures — MWAYE HOUSE" },
      { name: "description", content: "Gestion des factures et relances" },
    ],
  }),
});

function nextFactureNumero() {
  const d = new Date();
  return `FAC-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(Date.now()).slice(-4)}`;
}

const STATUTS = ["brouillon", "emise", "partiellement_payee", "payee", "en_retard", "annulee"];

function FacturesPage() {
  const {
    factures, isLoading, addFacture, updateStatut,
    marquerPayee, marquerEnRetard, enregistrerRelance, deleteFacture,
  } = useFacturesData();
  const { clients } = useClientsData();
  const { settings } = useAppSettings();
  const [tab, setTab] = useState("toutes");

  const enriched = useMemo(() => factures.map((f: unknown) => {
    const isLate = f.statut !== "payee" && f.statut !== "annulee" && f.date_echeance && new Date(f.date_echeance) < new Date();
    return { ...f, _enRetard: isLate || f.statut === "en_retard" };
  }), [factures]);

  const kpis = useMemo(() => {
    const facture = enriched.reduce((s, f) => s + Number(f.montant_total), 0);
    const encaisse = enriched.filter((f) => f.statut === "payee").reduce((s, f) => s + Number(f.montant_total), 0);
    const enAttente = enriched.filter((f) => ["emise", "brouillon", "partiellement_payee"].includes(f.statut) && !f._enRetard).reduce((s, f) => s + Number(f.montant_total), 0);
    const enRetard = enriched.filter((f) => f._enRetard && f.statut !== "payee").reduce((s, f) => s + Number(f.montant_total), 0);
    return { facture, encaisse, enAttente, enRetard, nbRetard: enriched.filter((f) => f._enRetard && f.statut !== "payee").length };
  }, [enriched]);

  const filtered = useMemo(() => {
    if (tab === "toutes") return enriched;
    if (tab === "encaisser") return enriched.filter((f) => ["emise", "partiellement_payee", "brouillon"].includes(f.statut) && !f._enRetard);
    if (tab === "retard") return enriched.filter((f) => f._enRetard && f.statut !== "payee");
    if (tab === "payees") return enriched.filter((f) => f.statut === "payee");
    return enriched;
  }, [enriched, tab]);

  const facturesRetard = useMemo(() => enriched.filter((f) => f._enRetard && f.statut !== "payee"), [enriched]);

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  const handlePDF = (f: unknown) => {
    exportDocumentPDF({
      type: "FACTURE",
      numero: f.numero,
      date: f.date_facture,
      date_echeance_validite: f.date_echeance,
      client_nom: f.clients?.nom ?? "Client",
      client_adresse: f.clients?.adresse,
      client_telephone: f.clients?.telephone,
      client_email: f.clients?.email,
      client_niu: f.clients?.niu,
      lignes: (f.lignes_document ?? []).sort((a: unknown, b: unknown) => a.ordre - b.ordre).map((l: unknown) => ({
        description: l.description, quantite: Number(l.quantite),
        prix_unitaire: Number(l.prix_unitaire), montant: Number(l.montant),
      })),
      montant_total: Number(f.montant_total),
      tva_rate: Number(settings?.tva_rate ?? 0),
      notes: f.notes,
      statut: f.statut,
      date_paiement: f.date_paiement,
      mode_paiement: undefined,
      societe: {
        nom: settings.complex_name,
        niu: settings.niu,
        rccm: settings.rccm,
        adresse: settings.adresse,
        telephone: settings.telephone,
        email: settings.email_societe,
        regime_fiscal: settings.regime_fiscal,
      },
    });
  };

  const handlePayer = (f: unknown) => {
    const mode = prompt("Mode de paiement (Espèces / Virement / Mobile Money / Chèque) :", "Espèces");
    if (mode) marquerPayee.mutate({ id: f.id, mode_paiement: mode });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Factures</h1>
            <p className="text-sm text-muted-foreground mt-1">{factures.length} facture(s)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => marquerEnRetard.mutate()} disabled={marquerEnRetard.isPending}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Actualiser retards
            </Button>
            <FactureForm clients={clients} onSubmit={(v) => addFacture.mutate(v)} isPending={addFacture.isPending} nextNumero={nextFactureNumero()} />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">CA facturé</p>
            <p className="text-xl font-bold mt-1">{formatAmount(kpis.facture)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Encaissé</p>
            <p className="text-xl font-bold text-success mt-1">{formatAmount(kpis.encaisse)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">En attente</p>
            <p className="text-xl font-bold text-warning mt-1">{formatAmount(kpis.enAttente)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">En retard ({kpis.nbRetard})</p>
            <p className="text-xl font-bold text-destructive mt-1">{formatAmount(kpis.enRetard)}</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="toutes">Toutes</TabsTrigger>
            <TabsTrigger value="encaisser">À encaisser</TabsTrigger>
            <TabsTrigger value="retard">En retard{kpis.nbRetard > 0 ? ` (${kpis.nbRetard})` : ""}</TabsTrigger>
            <TabsTrigger value="payees">Payées</TabsTrigger>
            <TabsTrigger value="relances">Relances</TabsTrigger>
          </TabsList>

          <TabsContent value="relances" className="mt-4">
            <RelancesTab
              factures={facturesRetard}
              onRelance={(d) => enregistrerRelance.mutate(d)}
              isPending={enregistrerRelance.isPending}
            />
          </TabsContent>

          {["toutes", "encaisser", "retard", "payees"].map((t) => (
            <TabsContent key={t} value={t} className="mt-4">
              {filtered.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-10 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune facture dans cette catégorie.</p>
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
                        <th className="px-5 py-3 text-right font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((f: unknown) => (
                        <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium">{f.numero}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{f.clients?.nom ?? "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{f.date_facture}</td>
                          <td className={cn("px-5 py-3.5", f._enRetard ? "text-destructive font-semibold" : "text-muted-foreground")}>
                            {f.date_echeance ?? "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <Select value={f.statut} onValueChange={(v) => updateStatut.mutate({ id: f.id, statut: v })}>
                              <SelectTrigger className={cn("h-7 w-40 border-0 px-2 text-[11px] font-semibold rounded-full", STATUS_COLORS[f.statut] || "bg-muted text-muted-foreground")}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUTS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{formatAmount(Number(f.montant_total))}</td>
                          <td className="px-2 py-3.5 text-right space-x-1 whitespace-nowrap">
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Télécharger PDF" onClick={() => handlePDF(f)}>
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            {f.statut !== "payee" && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" title="Marquer payée" onClick={() => handlePayer(f)} disabled={marquerPayee.isPending}>
                                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                              </Button>
                            )}
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
