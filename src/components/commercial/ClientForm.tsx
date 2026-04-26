import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface Props {
  onSubmit: (v: {
    nom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    type_client?: string;
    niu?: string;
  }) => void;
  isPending: boolean;
}

export function ClientForm({ onSubmit, isPending }: Props) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [type, setType] = useState("Particulier");
  const [niu, setNiu] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nom,
      email: email || undefined,
      telephone: telephone || undefined,
      adresse: adresse || undefined,
      type_client: type,
      niu: niu || undefined,
    });
    setNom(""); setEmail(""); setTelephone(""); setAdresse(""); setNiu("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nouveau client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouveau client</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Nom</Label><Input value={nom} onChange={e => setNom(e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Particulier">Particulier</SelectItem>
                  <SelectItem value="Entreprise">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Téléphone</Label><Input value={telephone} onChange={e => setTelephone(e.target.value)} /></div>
          </div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div>
            <Label>NIU (obligatoire pour facture B2B ≥ 100 000 F)</Label>
            <Input
              value={niu}
              onChange={e => setNiu(e.target.value)}
              placeholder="P012345678901A"
            />
          </div>
          <div><Label>Adresse</Label><Textarea value={adresse} onChange={e => setAdresse(e.target.value)} rows={2} /></div>
          <Button type="submit" className="w-full" disabled={isPending}>Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
