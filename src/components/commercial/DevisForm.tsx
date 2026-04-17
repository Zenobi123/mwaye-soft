import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Client { id: string; nom: string }
interface Ligne { description: string; quantite: number; prix_unitaire: number; montant: number }
interface Props {
  clients: Client[];
  onSubmit: (v: { numero: string; client_id: string; date_validite?: string; montant_total: number; lignes: Ligne[] }) => void;
  isPending: boolean;
  nextNumero: string;
}

export function DevisForm({ clients, onSubmit, isPending, nextNumero }: Props) {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [dateValidite, setDateValidite] = useState("");
  const [lignes, setLignes] = useState<Ligne[]>([{ description: "", quantite: 1, prix_unitaire: 0, montant: 0 }]);

  const updateLigne = (i: number, field: keyof Ligne, value: string) => {
    const updated = [...lignes];
    if (field === "description") updated[i].description = value;
    else {
      (updated[i] as any)[field] = parseFloat(value) || 0;
      updated[i].montant = updated[i].quantite * updated[i].prix_unitaire;
    }
    setLignes(updated);
  };

  const total = lignes.reduce((s, l) => s + l.montant, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ numero: nextNumero, client_id: clientId, date_validite: dateValidite || undefined, montant_total: total, lignes });
    setLignes([{ description: "", quantite: 1, prix_unitaire: 0, montant: 0 }]);
    setClientId(""); setDateValidite("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nouveau devis</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Devis {nextNumero}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId} required>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Validité</Label><Input type="date" value={dateValidite} onChange={e => setDateValidite(e.target.value)} /></div>
          </div>

          <div className="space-y-2">
            <Label>Lignes</Label>
            {lignes.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_100px_100px_32px] gap-2 items-end">
                <Input placeholder="Description" value={l.description} onChange={e => updateLigne(i, "description", e.target.value)} required />
                <Input type="number" placeholder="Qté" value={l.quantite || ""} onChange={e => updateLigne(i, "quantite", e.target.value)} />
                <Input type="number" placeholder="PU" value={l.prix_unitaire || ""} onChange={e => updateLigne(i, "prix_unitaire", e.target.value)} />
                <p className="text-sm font-semibold text-right py-2">{l.montant.toLocaleString("fr-FR")}</p>
                {lignes.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => setLignes(lignes.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setLignes([...lignes, { description: "", quantite: 1, prix_unitaire: 0, montant: 0 }])}>
              + Ajouter une ligne
            </Button>
          </div>

          <div className="text-right text-lg font-bold">Total : {total.toLocaleString("fr-FR")} F CFA</div>
          <Button type="submit" className="w-full" disabled={isPending || !clientId}>Créer le devis</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
