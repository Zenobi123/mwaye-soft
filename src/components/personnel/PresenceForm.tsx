import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck } from "lucide-react";

interface Employe { id: string; nom: string }
interface Props {
  employes: Employe[];
  onSubmit: (v: { employe_id: string; heure_arrivee?: string; heure_depart?: string; statut: string }) => void;
  isPending: boolean;
}

const STATUTS = ["présent", "absent", "retard", "congé"];

export function PresenceForm({ employes, onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [employeId, setEmployeId] = useState("");
  const [statut, setStatut] = useState("présent");
  const [arrivee, setArrivee] = useState("08:00");
  const [depart, setDepart] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ employe_id: employeId, heure_arrivee: arrivee || undefined, heure_depart: depart || undefined, statut });
    setArrivee("08:00"); setDepart("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><ClipboardCheck className="h-4 w-4 mr-1" /> Pointer</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Enregistrer une présence</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Employé</Label>
            <Select value={employeId} onValueChange={setEmployeId} required>
              <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{employes.map(e => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Statut</Label>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Heure arrivée</Label><Input value={arrivee} onChange={e => setArrivee(e.target.value)} placeholder="08:00" /></div>
            <div><Label>Heure départ</Label><Input value={depart} onChange={e => setDepart(e.target.value)} placeholder="17:00" /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !employeId}>Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
