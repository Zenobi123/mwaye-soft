import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  onSubmit: (v: { nom: string; poste: string; departement?: string; telephone?: string; email?: string; salaire?: number }) => void;
  isPending: boolean;
}

const DEPARTEMENTS = ["Direction", "Comptabilité", "Sport", "Hammam", "Événementiel", "Immobilier", "Maintenance", "Sécurité"];

export function EmployeForm({ onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [poste, setPoste] = useState("");
  const [departement, setDepartement] = useState("Général");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [salaire, setSalaire] = useState("0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom, poste, departement, telephone: telephone || undefined, email: email || undefined, salaire: parseFloat(salaire) });
    setNom(""); setPoste(""); setTelephone(""); setEmail(""); setSalaire("0");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nouvel employé</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvel employé</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Nom complet</Label><Input value={nom} onChange={e => setNom(e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Poste</Label><Input value={poste} onChange={e => setPoste(e.target.value)} required /></div>
            <div>
              <Label>Département</Label>
              <select value={departement} onChange={e => setDepartement(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                {DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Téléphone</Label><Input value={telephone} onChange={e => setTelephone(e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          </div>
          <div><Label>Salaire mensuel (FCFA)</Label><Input type="number" value={salaire} onChange={e => setSalaire(e.target.value)} /></div>
          <Button type="submit" className="w-full" disabled={isPending}>Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
