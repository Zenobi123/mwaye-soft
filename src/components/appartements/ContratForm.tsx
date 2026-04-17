import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Appt { id: string; numero: string }
interface Props {
  appartements: Appt[];
  onSubmit: (v: {
    appartement_id: string; locataire: string; telephone?: string;
    date_debut: string; date_fin: string; loyer_mensuel: number; caution: number;
  }) => void;
  isPending: boolean;
}

export function ContratForm({ appartements, onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [apptId, setApptId] = useState("");
  const [locataire, setLocataire] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [loyer, setLoyer] = useState("30000");
  const [caution, setCaution] = useState("60000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      appartement_id: apptId, locataire, telephone: telephone || undefined,
      date_debut: dateDebut, date_fin: dateFin,
      loyer_mensuel: parseFloat(loyer), caution: parseFloat(caution),
    });
    setLocataire(""); setTelephone(""); setDateDebut(""); setDateFin("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Nouveau contrat</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouveau contrat de bail</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Appartement</Label>
            <Select value={apptId} onValueChange={setApptId} required>
              <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{appartements.map(a => <SelectItem key={a.id} value={a.id}>Appt {a.numero}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Locataire</Label><Input value={locataire} onChange={e => setLocataire(e.target.value)} required /></div>
            <div><Label>Téléphone</Label><Input value={telephone} onChange={e => setTelephone(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Date début</Label><Input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required /></div>
            <div><Label>Date fin</Label><Input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Loyer mensuel (F CFA)</Label><Input type="number" value={loyer} onChange={e => setLoyer(e.target.value)} required /></div>
            <div><Label>Caution (F CFA)</Label><Input type="number" value={caution} onChange={e => setCaution(e.target.value)} required /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !apptId}>Créer le contrat</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
