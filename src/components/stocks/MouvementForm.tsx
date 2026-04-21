import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

interface Article { id: string; nom: string }
interface Props {
  articles: Article[];
  onSubmit: (v: { article_id: string; type_mouvement: string; quantite: number; motif?: string; prix_unitaire?: number; fournisseur?: string; creer_depense?: boolean }) => void;
  isPending: boolean;
}

export function MouvementForm({ articles, onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [type, setType] = useState("entrée");
  const [quantite, setQuantite] = useState("1");
  const [prix, setPrix] = useState("0");
  const [fournisseur, setFournisseur] = useState("");
  const [motif, setMotif] = useState("");
  const [creerDepense, setCreerDepense] = useState(false);

  const isEntree = type === "entrée";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      article_id: articleId,
      type_mouvement: type,
      quantite: parseInt(quantite),
      motif: motif || undefined,
      prix_unitaire: isEntree ? parseFloat(prix) || 0 : undefined,
      fournisseur: isEntree ? (fournisseur || undefined) : undefined,
      creer_depense: isEntree ? creerDepense : false,
    });
    setQuantite("1"); setMotif(""); setPrix("0"); setFournisseur(""); setCreerDepense(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><ArrowUpDown className="h-4 w-4 mr-1" /> Mouvement</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Mouvement de stock</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Article</Label>
            <Select value={articleId} onValueChange={setArticleId} required>
              <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{articles.map(a => <SelectItem key={a.id} value={a.id}>{a.nom}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrée">Entrée</SelectItem>
                  <SelectItem value="sortie">Sortie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Quantité</Label><Input type="number" value={quantite} onChange={e => setQuantite(e.target.value)} min="1" required /></div>
          </div>
          {isEntree && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Prix unitaire (FCFA)</Label><Input type="number" value={prix} onChange={e => setPrix(e.target.value)} min="0" step="0.01" /></div>
                <div><Label>Fournisseur</Label><Input value={fournisseur} onChange={e => setFournisseur(e.target.value)} placeholder="Nom fournisseur" /></div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={creerDepense} onCheckedChange={(v) => setCreerDepense(v === true)} />
                <span>Créer une dépense (en attente) liée à cet achat</span>
              </label>
            </>
          )}
          <div><Label>Motif / référence</Label><Input value={motif} onChange={e => setMotif(e.target.value)} placeholder="Réapprovisionnement, BL n°…" /></div>
          <Button type="submit" className="w-full" disabled={isPending || !articleId}>Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
