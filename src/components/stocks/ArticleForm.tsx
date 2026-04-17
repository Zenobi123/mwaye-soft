import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  onSubmit: (v: { nom: string; categorie?: string; quantite?: number; quantite_min?: number; prix_unitaire?: number; unite?: string; emplacement?: string }) => void;
  isPending: boolean;
}

export function ArticleForm({ onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("Général");
  const [quantite, setQuantite] = useState("0");
  const [quantiteMin, setQuantiteMin] = useState("5");
  const [prix, setPrix] = useState("0");
  const [unite, setUnite] = useState("unité");
  const [emplacement, setEmplacement] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom, categorie, quantite: parseInt(quantite), quantite_min: parseInt(quantiteMin), prix_unitaire: parseFloat(prix), unite, emplacement: emplacement || undefined });
    setNom(""); setQuantite("0"); setPrix("0"); setEmplacement("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nouvel article</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvel article</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Nom</Label><Input value={nom} onChange={e => setNom(e.target.value)} required /></div>
            <div><Label>Catégorie</Label><Input value={categorie} onChange={e => setCategorie(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Quantité</Label><Input type="number" value={quantite} onChange={e => setQuantite(e.target.value)} /></div>
            <div><Label>Seuil min</Label><Input type="number" value={quantiteMin} onChange={e => setQuantiteMin(e.target.value)} /></div>
            <div><Label>Unité</Label><Input value={unite} onChange={e => setUnite(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Prix unitaire (F CFA)</Label><Input type="number" value={prix} onChange={e => setPrix(e.target.value)} /></div>
            <div><Label>Emplacement</Label><Input value={emplacement} onChange={e => setEmplacement(e.target.value)} /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
