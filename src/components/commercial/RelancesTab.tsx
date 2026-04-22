import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, AlertCircle } from "lucide-react";
import { formatAmount } from "@/config/app";

interface FactureRetard {
  id: string;
  numero: string;
  date_echeance: string | null;
  montant_total: number;
  niveau_relance: number;
  date_relance: string | null;
  clients?: { nom: string } | null;
}

interface Props {
  factures: FactureRetard[];
  onRelance: (data: { id: string; niveau: number; notes?: string }) => void;
  isPending: boolean;
}

function joursRetard(echeance: string | null): number {
  if (!echeance) return 0;
  const diff = (Date.now() - new Date(echeance).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.floor(diff));
}

function suggestionNiveau(jours: number): number {
  if (jours >= 15) return 3;
  if (jours >= 10) return 2;
  if (jours >= 5) return 1;
  return 1;
}

function RelanceDialog({ facture, onRelance, isPending }: { facture: FactureRetard; onRelance: Props["onRelance"]; isPending: boolean }) {
  const [open, setOpen] = useState(false);
  const jours = joursRetard(facture.date_echeance);
  const [niveau, setNiveau] = useState<string>(String(Math.max(facture.niveau_relance + 1, suggestionNiveau(jours))));
  const [notes, setNotes] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Mail className="h-3.5 w-3.5 mr-1" /> Relancer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Relancer {facture.numero}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
            <p><span className="text-muted-foreground">Client :</span> <strong>{facture.clients?.nom ?? "—"}</strong></p>
            <p><span className="text-muted-foreground">Montant :</span> <strong>{formatAmount(Number(facture.montant_total))}</strong></p>
            <p><span className="text-muted-foreground">Retard :</span> <strong className="text-destructive">{jours} jour(s)</strong></p>
          </div>
          <div>
            <Label>Niveau de relance</Label>
            <Select value={niveau} onValueChange={setNiveau}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Niveau 1 — Rappel courtois</SelectItem>
                <SelectItem value="2">Niveau 2 — Mise en demeure</SelectItem>
                <SelectItem value="3">Niveau 3 — Dernière relance avant contentieux</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes (optionnel)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mode d'envoi, contact, observations..." />
          </div>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => {
              onRelance({ id: facture.id, niveau: parseInt(niveau, 10), notes: notes || undefined });
              setOpen(false);
            }}
          >
            Enregistrer la relance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RelancesTab({ factures, onRelance, isPending }: Props) {
  if (factures.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <AlertCircle className="h-10 w-10 text-success mx-auto mb-3" />
        <p className="text-muted-foreground">Aucune facture en retard. Tout est à jour.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3 text-left font-medium text-muted-foreground">N°</th>
            <th className="px-5 py-3 text-left font-medium text-muted-foreground">Client</th>
            <th className="px-5 py-3 text-left font-medium text-muted-foreground">Échéance</th>
            <th className="px-5 py-3 text-right font-medium text-muted-foreground">Retard</th>
            <th className="px-5 py-3 text-center font-medium text-muted-foreground">Dernier niveau</th>
            <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
            <th className="px-5 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {factures.map((f) => {
            const jours = joursRetard(f.date_echeance);
            return (
              <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 font-medium">{f.numero}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{f.clients?.nom ?? "—"}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{f.date_echeance ?? "—"}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-destructive">{jours} j</td>
                <td className="px-5 py-3.5 text-center">
                  {f.niveau_relance > 0 ? (
                    <span className="rounded-full bg-warning/10 text-warning px-2 py-0.5 text-[11px] font-semibold">
                      N{f.niveau_relance} • {f.date_relance}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{formatAmount(Number(f.montant_total))}</td>
                <td className="px-2 py-3.5 text-right">
                  <RelanceDialog facture={f} onRelance={onRelance} isPending={isPending} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
