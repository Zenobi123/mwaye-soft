import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Check, Sparkles, AlertTriangle } from "lucide-react";
import { formatAmount } from "@/config/app";
import { useImmobilier } from "@/hooks/useImmobilier";
import { exportQuittancePDF } from "@/services/quittanceService";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuittanceRow {
  id: string;
  numero: string;
  mois_concerne: string;
  date_echeance: string | null;
  loyer_base: number | string | null;
  penalite: number | string | null;
  montant_total: number | string | null;
  statut: string;
  date_paiement: string | null;
  mode_paiement: string | null;
  contrats_bail?: { locataire: string | null } | null;
  appartements?: { numero: string | null; type_appartement: string | null } | null;
}

export function QuittancesTab() {
  const { quittances, totalImpaye, nbImpayes, genererMois, marquerPayee, lancerPenalitesRappels } = useImmobilier();
  const [paiementId, setPaiementId] = useState<string | null>(null);
  const [mode, setMode] = useState("Espèces");
  const [moisCible, setMoisCible] = useState(new Date().toISOString().slice(0, 7));

  const downloadPDF = (q: QuittanceRow) => {
    exportQuittancePDF({
      numero: q.numero,
      mois_concerne: q.mois_concerne,
      date_echeance: q.date_echeance ?? "",
      loyer_base: Number(q.loyer_base),
      penalite: Number(q.penalite),
      montant_total: Number(q.montant_total),
      statut: q.statut,
      date_paiement: q.date_paiement,
      mode_paiement: q.mode_paiement,
      locataire: q.contrats_bail?.locataire ?? "—",
      appartement_numero: q.appartements?.numero ?? "—",
      appartement_type: q.appartements?.type_appartement ?? "—",
    });
  };

  const statutColor = (s: string) =>
    s === "payée" ? "bg-success/10 text-success" : s === "partielle" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total impayé</p>
          <p className="text-2xl font-bold text-destructive">{formatAmount(totalImpaye)}</p>
          <p className="text-xs text-muted-foreground mt-1">{nbImpayes} quittance(s) en attente</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <Label className="text-xs">Générer pour le mois</Label>
          <div className="flex gap-2 mt-1">
            <Input type="month" value={moisCible} onChange={(e) => setMoisCible(e.target.value)} />
            <Button
              size="sm"
              onClick={() => genererMois.mutate(`${moisCible}-01`)}
              disabled={genererMois.isPending}
            >
              <Sparkles className="h-4 w-4 mr-1" /> Générer
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
          <p className="text-xs text-muted-foreground">Recalcul automatique</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => lancerPenalitesRappels.mutate()}
            disabled={lancerPenalitesRappels.isPending}
          >
            <AlertTriangle className="h-4 w-4 mr-1" /> Pénalités & rappels
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">N°</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Locataire / Appt</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mois</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Loyer</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Pénalité</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quittances.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Aucune quittance. Cliquez "Générer" pour créer celles du mois.</td></tr>
            ) : quittances.map((q: QuittanceRow) => (
              <tr key={q.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{q.numero}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{q.contrats_bail?.locataire ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">Appt {q.appartements?.numero ?? "—"}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(q.mois_concerne).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAmount(Number(q.loyer_base))}</td>
                <td className="px-4 py-3 text-right tabular-nums text-destructive">
                  {Number(q.penalite) > 0 ? formatAmount(Number(q.penalite)) : "—"}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatAmount(Number(q.montant_total))}</td>
                <td className="px-4 py-3">
                  <Badge className={statutColor(q.statut)} variant="outline">{q.statut}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => downloadPDF(q)} title="Télécharger PDF">
                      <FileDown className="h-4 w-4" />
                    </Button>
                    {q.statut !== "payée" && (
                      <Button size="sm" variant="ghost" onClick={() => setPaiementId(q.id)} title="Marquer payée">
                        <Check className="h-4 w-4 text-success" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!paiementId} onOpenChange={(o) => !o && setPaiementId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Encaisser le loyer</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Mode de paiement</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Espèces">Espèces</SelectItem>
                <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                <SelectItem value="Virement">Virement</SelectItem>
                <SelectItem value="Chèque">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaiementId(null)}>Annuler</Button>
            <Button onClick={() => { if (paiementId) marquerPayee.mutate({ id: paiementId, mode }); setPaiementId(null); }}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
