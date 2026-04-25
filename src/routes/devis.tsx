// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Trash2, Download, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDevisData } from "@/hooks/useDevisData";
import { useClientsData } from "@/hooks/useClientsData";
import { useAppSettings } from "@/hooks/useAppSettings";
import { DevisForm } from "@/components/commercial/DevisForm";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { BackButton } from "@/components/layout/BackButton";
import { exportDocumentPDF } from "@/services/documentPdfService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/devis")({
  component: DevisPage,
  head: () => ({
    meta: [
      { title: "Devis — MWAYE HOUSE" },
      { name: "description", content: "Gestion des devis commerciaux" },
    ],
  }),
});

function nextDevisNumero() {
  const d = new Date();
  return `DEV-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(Date.now()).slice(-4)}`;
}

function DevisPage() {
  const { devis, isLoading, addDevis, updateStatutDevis, convertirEnFacture, deleteDevis } = useDevisData();
  const { clients } = useClientsData();
  const { settings } = useAppSettings();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  const total = devis.reduce((s, d) => s + Number(d.montant_total), 0);
  const acceptes = devis.filter((d) => d.statut === "accepte" || d.statut === "accepté").reduce((s, d) => s + Number(d.montant_total), 0);
  const enAttente = devis.filter((d) => ["brouillon", "envoyée", "envoyé", "emise"].includes(d.statut)).reduce((s, d) => s + Number(d.montant_total), 0);

  const handlePDF = (d: unknown) => {
    exportDocumentPDF({
      type: "DEVIS",
      numero: d.numero,
      date: d.date_devis,
      date_echeance_validite: d.date_validite,
      client_nom: d.clients?.nom ?? "Client",
      client_adresse: d.clients?.adresse,
      client_telephone: d.clients?.telephone,
      client_email: d.clients?.email,
      client_niu: d.clients?.niu,
      lignes: (d.lignes_document ?? []).sort((a: unknown, b: unknown) => a.ordre - b.ordre).map((l: unknown) => ({
        description: l.description, quantite: Number(l.quantite),
        prix_unitaire: Number(l.prix_unitaire), montant: Number(l.montant),
      })),
      montant_total: Number(d.montant_total),
      tva_rate: Number(settings?.tva_rate ?? 0),
      notes: d.notes,
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Devis</h1>
            <p className="text-sm text-muted-foreground mt-1">{devis.length} devis</p>
          </div>
          <DevisForm clients={clients} onSubmit={(v) => addDevis.mutate(v)} isPending={addDevis.isPending} nextNumero={nextDevisNumero()} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total émis</p>
            <p className="text-xl font-bold text-card-foreground mt-1">{formatAmount(total)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Acceptés</p>
            <p className="text-xl font-bold text-success mt-1">{formatAmount(acceptes)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">En attente</p>
            <p className="text-xl font-bold text-warning mt-1">{formatAmount(enAttente)}</p>
          </div>
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
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {devis.map((d: unknown) => (
                  <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{d.numero}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{d.clients?.nom ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{d.date_devis}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{d.date_validite ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <Select value={d.statut} onValueChange={(v) => updateStatutDevis.mutate({ id: d.id, statut: v })} disabled={d.statut === "converti"}>
                        <SelectTrigger className={cn("h-7 w-32 border-0 px-2 text-[11px] font-semibold rounded-full", STATUS_COLORS[d.statut] || "bg-muted text-muted-foreground")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brouillon">brouillon</SelectItem>
                          <SelectItem value="envoyée">envoyée</SelectItem>
                          <SelectItem value="accepte">accepté</SelectItem>
                          <SelectItem value="refuse">refusé</SelectItem>
                          {d.statut === "converti" && <SelectItem value="converti">converti</SelectItem>}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{formatAmount(Number(d.montant_total))}</td>
                    <td className="px-2 py-3.5 text-right space-x-1 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Télécharger PDF" onClick={() => handlePDF(d)}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7"
                        title="Convertir en facture"
                        disabled={d.statut === "converti" || convertirEnFacture.isPending}
                        onClick={() => {
                          if (confirm(`Convertir le devis ${d.numero} en facture ?`)) {
                            convertirEnFacture.mutate({ devis_id: d.id });
                          }
                        }}
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                      </Button>
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
