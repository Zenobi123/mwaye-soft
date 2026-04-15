import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface Article { id: string; nom: string }
interface Props {
  articles: Article[];
  onSubmit: (v: { article_id: string; type_mouvement: string; quantite: number; motif?: string }) => void;
  isPending: boolean;
}

export function MouvementForm({ articles, onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [type, setType] = useState("entrée");
  const [quantite, setQuantite] = useState("1");
  const [motif, setMotif] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ article_id: articleId, type_mouvement: type, quantite: parseInt(quantite), motif: motif || undefined });
    setQuantite("1"); setMotif("");
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
          <div><Label>Motif</Label><Input value={motif} onChange={e => setMotif(e.target.value)} placeholder="Réapprovisionnement, consommation..." /></div>
          <Button type="submit" className="w-full" disabled={isPending || !articleId}>Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
