import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Props {
  onSubmit: (v: { numero: string; type_appartement: string; nombre_pieces: number; loyer: number }) => void;
  isPending: boolean;
}

export function AppartementForm({ onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [numero, setNumero] = useState("");
  const [type, setType] = useState("Meublé");
  const [pieces, setPieces] = useState("2");
  const [loyer, setLoyer] = useState("30000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ numero, type_appartement: type, nombre_pieces: parseInt(pieces), loyer: parseFloat(loyer) });
    setNumero(""); setPieces("2"); setLoyer("30000");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter un appartement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvel appartement</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Numéro</Label><Input value={numero} onChange={e => setNumero(e.target.value)} placeholder="A1" required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meublé">Meublé</SelectItem>
                  <SelectItem value="Non meublé">Non meublé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Pièces</Label><Input type="number" value={pieces} onChange={e => setPieces(e.target.value)} required /></div>
            <div><Label>Loyer (F CFA)</Label><Input type="number" value={loyer} onChange={e => setLoyer(e.target.value)} required /></div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
