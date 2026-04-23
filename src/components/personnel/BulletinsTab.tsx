// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileText, Download, CheckCircle2, CreditCard, Calendar } from "lucide-react";
import { usePaie } from "@/hooks/usePaie";
import { formatAmount } from "@/config/app";
import { cn } from "@/lib/utils";

const STATUT_COLORS: Record<string, string> = {
  brouillon: "bg-muted text-muted-foreground",
  "validé": "bg-info/10 text-info",
  "payé": "bg-success/10 text-success",
};

export function BulletinsTab() {
  const { bulletins, masseSalarialeMois, isLoading, generer, valider, marquerPaye, exporterPDF } = usePaie();
  const [moisGen, setMoisGen] = useState(() => new Date().toISOString().slice(0, 7));
  const [openPaiement, setOpenPaiement] = useState<string | null>(null);
  const [mode, setMode] = useState("Virement");

  const handleGen = () => generer.mutate(`${moisGen}-01`);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">Masse salariale ce mois</p>
          <p className="text-xl font-bold text-card-foreground">{formatAmount(masseSalarialeMois)}</p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <Label className="text-xs">Mois</Label>
            <Input type="month" value={moisGen} onChange={(e) => setMoisGen(e.target.value)} className="w-44" />
          </div>
          <Button onClick={handleGen} disabled={generer.isPending} size="sm">
            <Calendar className="h-4 w-4 mr-1" /> Générer bulletins
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : bulletins.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun bulletin. Cliquez sur "Générer bulletins" pour le mois en cours.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">N°</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employé</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mois</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Brut</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Net</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Coût</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bulletins.map((b: unknown) => (
                <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{b.numero}</td>
                  <td className="px-4 py-3 font-medium">{b.employes?.nom ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(b.mois).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3 text-right">{formatAmount(Number(b.salaire_brut))}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatAmount(Number(b.salaire_net))}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{formatAmount(Number(b.cout_total_employeur))}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUT_COLORS[b.statut])}>
                      {b.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exporterPDF(b)} title="Télécharger PDF">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {b.statut === "brouillon" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => valider.mutate(b.id)} title="Valider">
                          <CheckCircle2 className="h-3.5 w-3.5 text-info" />
                        </Button>
                      )}
                      {b.statut === "validé" && (
                        <Dialog open={openPaiement === b.id} onOpenChange={(o) => setOpenPaiement(o ? b.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Marquer payé">
                              <CreditCard className="h-3.5 w-3.5 text-success" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Marquer le bulletin {b.numero} payé</DialogTitle></DialogHeader>
                            <Label>Mode de paiement</Label>
                            <Select value={mode} onValueChange={setMode}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Virement">Virement</SelectItem>
                                <SelectItem value="Espèces">Espèces</SelectItem>
                                <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                                <SelectItem value="Chèque">Chèque</SelectItem>
                              </SelectContent>
                            </Select>
                            <DialogFooter>
                              <Button onClick={() => { marquerPaye.mutate({ id: b.id, mode }); setOpenPaiement(null); }}>Confirmer</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
