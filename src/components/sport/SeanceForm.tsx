import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  salles: Tables<"salles_sport">[];
  onSubmit: (data: unknown) => Promise<void>;
}

export function SeanceForm({ salles, onSubmit }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    salle_id: "", date_seance: new Date().toISOString().split("T")[0],
    heure_debut: "08:00", heure_fin: "09:00", type_seance: "Libre", participants: "0", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Vous devez être connecté");
    if (!form.salle_id) return toast.error("Sélectionnez une salle");
    setLoading(true);
    try {
      await onSubmit({
        user_id: user.id,
        salle_id: form.salle_id,
        date_seance: form.date_seance,
        heure_debut: form.heure_debut,
        heure_fin: form.heure_fin,
        type_seance: form.type_seance,
        participants: Number(form.participants),
        notes: form.notes || null,
      });
      toast.success("Séance ajoutée");
      setOpen(false);
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Nouvelle séance</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Planifier une séance</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Salle</Label>
            <Select value={form.salle_id} onValueChange={v => setForm(f => ({ ...f, salle_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{salles.map(s => <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Date</Label><Input type="date" required value={form.date_seance} onChange={e => setForm(f => ({ ...f, date_seance: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Début</Label><Input type="time" required value={form.heure_debut} onChange={e => setForm(f => ({ ...f, heure_debut: e.target.value }))} /></div>
            <div><Label>Fin</Label><Input type="time" required value={form.heure_fin} onChange={e => setForm(f => ({ ...f, heure_fin: e.target.value }))} /></div>
          </div>
          <div>
            <Label>Type</Label>
            <Select value={form.type_seance} onValueChange={v => setForm(f => ({ ...f, type_seance: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Libre">Libre</SelectItem>
                <SelectItem value="Cours collectif">Cours collectif</SelectItem>
                <SelectItem value="Personnel">Personnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Participants</Label><Input type="number" min="0" value={form.participants} onChange={e => setForm(f => ({ ...f, participants: e.target.value }))} /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Ajout..." : "Ajouter"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
