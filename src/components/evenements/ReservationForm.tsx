import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Salle { id: string; nom: string }
interface Props {
  salles: Salle[];
  onSubmit: (v: {
    salle_id: string; titre: string; date_evenement: string;
    heure_debut: string; heure_fin: string; nombre_invites: number;
    montant: number; contact_nom?: string; contact_telephone?: string;
  }) => void;
  isPending: boolean;
}

export function ReservationForm({ salles, onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [salleId, setSalleId] = useState("");
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");
  const [heureDebut, setHeureDebut] = useState("14:00");
  const [heureFin, setHeureFin] = useState("23:00");
  const [invites, setInvites] = useState("100");
  const [montant, setMontant] = useState("50000");
  const [contactNom, setContactNom] = useState("");
  const [contactTel, setContactTel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      salle_id: salleId, titre, date_evenement: date,
      heure_debut: heureDebut, heure_fin: heureFin,
      nombre_invites: parseInt(invites), montant: parseFloat(montant),
      contact_nom: contactNom || undefined, contact_telephone: contactTel || undefined,
    });
    setTitre(""); setDate(""); setInvites("100"); setMontant("50000");
    setContactNom(""); setContactTel("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nouvelle réservation</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nouvelle réservation</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Titre</Label><Input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Mariage - Famille X" required /></div>
          <div>
            <Label>Salle</Label>
            <Select value={salleId} onValueChange={setSalleId} required>
              <SelectTrigger><SelectValue placeholder="Choisir une salle" /></SelectTrigger>
              <SelectContent>{salles.map(s => <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
            <div><Label>Début</Label><Input value={heureDebut} onChange={e => setHeureDebut(e.target.value)} required /></div>
            <div><Label>Fin</Label><Input value={heureFin} onChange={e => setHeureFin(e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Invités</Label><Input type="number" value={invites} onChange={e => setInvites(e.target.value)} required /></div>
            <div><Label>Montant (F CFA)</Label><Input type="number" value={montant} onChange={e => setMontant(e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Contact</Label><Input value={contactNom} onChange={e => setContactNom(e.target.value)} placeholder="Nom" /></div>
            <div><Label>Téléphone</Label><Input value={contactTel} onChange={e => setContactTel(e.target.value)} placeholder="+237..." /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !salleId}>Réserver</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
