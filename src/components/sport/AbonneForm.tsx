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
  onSubmit: (data: any) => Promise<void>;
}

const DURATIONS: Record<string, number> = { Mensuel: 30, Trimestriel: 90, Annuel: 365 };

export function AbonneForm({ salles, onSubmit }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom_abonne: "", telephone: "", salle_id: "", type_abonnement: "Mensuel", montant: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Vous devez être connecté");
    if (!form.salle_id) return toast.error("Sélectionnez une salle");
    setLoading(true);
    try {
      const debut = new Date();
      const fin = new Date(debut);
      fin.setDate(fin.getDate() + (DURATIONS[form.type_abonnement] || 30));
      await onSubmit({
        user_id: user.id,
        salle_id: form.salle_id,
        nom_abonne: form.nom_abonne,
        telephone: form.telephone || null,
        type_abonnement: form.type_abonnement,
        date_debut: debut.toISOString().split("T")[0],
        date_fin: fin.toISOString().split("T")[0],
        montant: Number(form.montant),
        statut: "actif",
        notes: form.notes || null,
      });
      toast.success("Abonné ajouté");
      setOpen(false);
      setForm({ nom_abonne: "", telephone: "", salle_id: "", type_abonnement: "Mensuel", montant: "", notes: "" });
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Nouvel abonné</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajouter un abonné</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Nom complet</Label><Input required value={form.nom_abonne} onChange={e => setForm(f => ({ ...f, nom_abonne: e.target.value }))} /></div>
          <div><Label>Téléphone</Label><Input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} /></div>
          <div>
            <Label>Salle</Label>
            <Select value={form.salle_id} onValueChange={v => setForm(f => ({ ...f, salle_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Choisir une salle" /></SelectTrigger>
              <SelectContent>{salles.map(s => <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type d'abonnement</Label>
            <Select value={form.type_abonnement} onValueChange={v => setForm(f => ({ ...f, type_abonnement: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mensuel">Mensuel</SelectItem>
                <SelectItem value="Trimestriel">Trimestriel</SelectItem>
                <SelectItem value="Annuel">Annuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Montant (F CFA)</Label><Input type="number" min="0" required value={form.montant} onChange={e => setForm(f => ({ ...f, montant: e.target.value }))} /></div>
          <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Ajout..." : "Ajouter"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
