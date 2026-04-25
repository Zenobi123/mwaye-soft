import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  onSubmit: (data: unknown) => Promise<void>;
}

export function SalleForm({ onSubmit }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: "", capacite: "20", statut: "active", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Vous devez être connecté");
    setLoading(true);
    try {
      await onSubmit({
        user_id: user.id,
        nom: form.nom,
        capacite: Number(form.capacite),
        occupees: 0,
        statut: form.statut,
        revenu_mensuel: 0,
        description: form.description || null,
      });
      toast.success("Salle ajoutée");
      setOpen(false);
      setForm({ nom: "", capacite: "20", statut: "active", description: "" });
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nouvelle salle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajouter une salle</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Nom</Label><Input required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
          <div><Label>Capacité</Label><Input type="number" min="1" required value={form.capacite} onChange={e => setForm(f => ({ ...f, capacite: e.target.value }))} /></div>
          <div>
            <Label>Statut</Label>
            <Select value={form.statut} onValueChange={v => setForm(f => ({ ...f, statut: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="fermée">Fermée</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Ajout..." : "Ajouter"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
