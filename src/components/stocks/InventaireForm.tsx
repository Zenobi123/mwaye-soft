import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList } from "lucide-react";
import { formatAmount } from "@/config/app";
import { cn } from "@/lib/utils";

interface Article {
  id: string; nom: string; quantite: number; pmp?: number; unite?: string;
}
interface Props {
  articles: Article[];
  onSubmit: (v: { observations?: string; lignes: { article_id: string; quantite_theorique: number; quantite_physique: number; pmp: number }[] }) => void;
  isPending: boolean;
}

export function InventaireForm({ articles, onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [observations, setObservations] = useState("");
  const [physiques, setPhysiques] = useState<Record<string, string>>({});

  const lignes = useMemo(() => articles.map(a => {
    const physRaw = physiques[a.id];
    const phys = physRaw === undefined || physRaw === "" ? a.quantite : parseInt(physRaw) || 0;
    const ecart = phys - a.quantite;
    const pmp = Number(a.pmp ?? 0);
    return { article: a, phys, ecart, valeurEcart: ecart * pmp, pmp };
  }), [articles, physiques]);

  const totalEcart = lignes.reduce((s, l) => s + l.valeurEcart, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      observations: observations || undefined,
      lignes: lignes.map(l => ({
        article_id: l.article.id,
        quantite_theorique: l.article.quantite,
        quantite_physique: l.phys,
        pmp: l.pmp,
      })),
    });
    setPhysiques({}); setObservations("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><ClipboardList className="h-4 w-4 mr-1" /> Inventaire</Button></DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Nouvel inventaire</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Observations</Label>
            <Textarea value={observations} onChange={e => setObservations(e.target.value)} placeholder="Contexte, équipe, conditions…" rows={2} />
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Article</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">Théorique</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">Physique</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">Écart</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Valeur écart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lignes.map(l => (
                  <tr key={l.article.id}>
                    <td className="px-3 py-2 font-medium">{l.article.nom}</td>
                    <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">{l.article.quantite}</td>
                    <td className="px-3 py-2">
                      <Input
                        type="number" min="0"
                        value={physiques[l.article.id] ?? l.article.quantite}
                        onChange={e => setPhysiques(p => ({ ...p, [l.article.id]: e.target.value }))}
                        className="h-8 text-center"
                      />
                    </td>
                    <td className={cn("px-3 py-2 text-center font-semibold tabular-nums",
                      l.ecart > 0 ? "text-success" : l.ecart < 0 ? "text-destructive" : "text-muted-foreground")}>
                      {l.ecart > 0 ? "+" : ""}{l.ecart}
                    </td>
                    <td className={cn("px-3 py-2 text-right tabular-nums",
                      l.valeurEcart > 0 ? "text-success" : l.valeurEcart < 0 ? "text-destructive" : "text-muted-foreground")}>
                      {formatAmount(l.valeurEcart)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30 border-t border-border">
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-right font-semibold">Écart total valorisé</td>
                  <td className={cn("px-3 py-2 text-right font-bold tabular-nums",
                    totalEcart > 0 ? "text-success" : totalEcart < 0 ? "text-destructive" : "")}>
                    {formatAmount(totalEcart)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Button type="submit" className="w-full" disabled={isPending || articles.length === 0}>
            Créer l'inventaire (brouillon)
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
