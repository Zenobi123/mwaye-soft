import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  onSubmit: (v: { nom: string; capacite: number; temperature?: string; description?: string }) => void;
  isPending: boolean;
}

export function SectionForm({ onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("20");
  const [temperature, setTemperature] = useState("45°C");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom, capacite: parseInt(capacite), temperature });
    setNom("");
    setCapacite("20");
    setTemperature("45°C");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter une section</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvelle section hammam</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Nom</Label><Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Hammam Hommes" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Capacité</Label><Input type="number" value={capacite} onChange={e => setCapacite(e.target.value)} required /></div>
            <div><Label>Température</Label><Input value={temperature} onChange={e => setTemperature(e.target.value)} /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
