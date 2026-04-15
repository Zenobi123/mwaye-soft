import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Section { id: string; nom: string }
interface Props {
  sections: Section[];
  onSubmit: (v: { section_id: string; heure: string; nom_client: string; type_service: string; montant: number }) => void;
  isPending: boolean;
}

const TYPES_SERVICE = ["Entrée simple", "Entrée + Gommage", "Forfait VIP", "Abonnement mensuel"];

export function EntreeForm({ sections, onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [sectionId, setSectionId] = useState("");
  const [heure, setHeure] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [typeService, setTypeService] = useState("Entrée simple");
  const [montant, setMontant] = useState("500");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ section_id: sectionId, heure, nom_client: nomClient, type_service: typeService, montant: parseFloat(montant) });
    setNomClient("");
    setHeure("");
    setMontant("500");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Nouvelle entrée</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Enregistrer une entrée</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Section</Label>
            <Select value={sectionId} onValueChange={setSectionId} required>
              <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{sections.map(s => <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Heure</Label><Input value={heure} onChange={e => setHeure(e.target.value)} placeholder="08:30" required /></div>
            <div><Label>Client</Label><Input value={nomClient} onChange={e => setNomClient(e.target.value)} placeholder="Nom du client" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type de service</Label>
              <Select value={typeService} onValueChange={setTypeService}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES_SERVICE.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Montant (FCFA)</Label><Input type="number" value={montant} onChange={e => setMontant(e.target.value)} required /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !sectionId}>Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
