import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  onSubmit: (v: { nom: string; capacite: number; prix_journalier: number; description?: string }) => void;
  isPending: boolean;
}

export function SalleFeteForm({ onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("100");
  const [prix, setPrix] = useState("50000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom, capacite: parseInt(capacite), prix_journalier: parseFloat(prix) });
    setNom(""); setCapacite("100"); setPrix("50000");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Ajouter une salle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvelle salle de fêtes</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Nom</Label><Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Salle Diamant" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Capacité</Label><Input type="number" value={capacite} onChange={e => setCapacite(e.target.value)} required /></div>
            <div><Label>Prix/jour (F CFA)</Label><Input type="number" value={prix} onChange={e => setPrix(e.target.value)} required /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
