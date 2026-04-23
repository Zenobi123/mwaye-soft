// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Check, X, CalendarDays, Trash2 } from "lucide-react";
import { useConges } from "@/hooks/useConges";
import { cn } from "@/lib/utils";

const TYPES = ["annuel", "maladie", "maternité", "sans_solde", "autorisation"];
const STATUT_COLORS: Record<string, string> = {
  en_attente: "bg-warning/10 text-warning",
  "approuvé": "bg-success/10 text-success",
  "refusé": "bg-destructive/10 text-destructive",
};

interface Props { employes: { id: string; nom: string }[] }

export function CongesTab({ employes }: Props) {
  const { conges, enCours, isLoading, creer, decider, supprimer } = useConges();
  const [open, setOpen] = useState(false);
  const [employeId, setEmployeId] = useState("");
  const [type, setType] = useState("annuel");
  const [debut, setDebut] = useState(new Date().toISOString().slice(0, 10));
  const [fin, setFin] = useState(new Date().toISOString().slice(0, 10));
  const [motif, setMotif] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    creer.mutate({ employe_id: employeId, type_conge: type, date_debut: debut, date_fin: fin, motif: motif || undefined });
    setMotif(""); setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{enCours.length} congé(s) en cours</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Demande de congé</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle demande de congé</DialogTitle></DialogHeader>
            <form onSubmit={handle} className="space-y-4">
              <div>
                <Label>Employé</Label>
                <Select value={employeId} onValueChange={setEmployeId} required>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{employes.map(e => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Date début</Label><Input type="date" value={debut} onChange={e => setDebut(e.target.value)} required /></div>
                <div><Label>Date fin</Label><Input type="date" value={fin} onChange={e => setFin(e.target.value)} required /></div>
              </div>
              <div><Label>Motif</Label><Input value={motif} onChange={e => setMotif(e.target.value)} /></div>
              <Button type="submit" className="w-full" disabled={creer.isPending || !employeId}>Créer la demande</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : conges.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun congé enregistré.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employé</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Période</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Jours</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Motif</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {conges.map((c: unknown) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.employes?.nom ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.type_conge}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.date_debut} → {c.date_fin}</td>
                  <td className="px-4 py-3 text-right font-semibold">{c.nb_jours}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{c.motif ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", STATUT_COLORS[c.statut])}>
                      {c.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {c.statut === "en_attente" && <>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => decider.mutate({ id: c.id, statut: "approuvé" })} title="Approuver">
                          <Check className="h-3.5 w-3.5 text-success" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => decider.mutate({ id: c.id, statut: "refusé" })} title="Refuser">
                          <X className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </>}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => supprimer.mutate(c.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
