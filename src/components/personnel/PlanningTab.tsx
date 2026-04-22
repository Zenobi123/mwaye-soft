import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, CalendarRange } from "lucide-react";
import { usePlannings } from "@/hooks/usePlannings";

interface Props { employes: { id: string; nom: string }[] }

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function PlanningTab({ employes }: Props) {
  const { plannings, isLoading, creer, supprimer } = usePlannings();
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [employeId, setEmployeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hd, setHd] = useState("08:00");
  const [hf, setHf] = useState("17:00");
  const [poste, setPoste] = useState("");

  const dates = useMemo(() => getWeekDates(offset), [offset]);
  const planParCell = useMemo(() => {
    const map: Record<string, unknown[]> = {};
    plannings.forEach((p: unknown) => {
      if (!dates.includes(p.date_planning)) return;
      const k = `${p.employe_id}_${p.date_planning}`;
      if (!map[k]) map[k] = [];
      map[k].push(p);
    });
    return map;
  }, [plannings, dates]);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    creer.mutate({ employe_id: employeId, date_planning: date, heure_debut: hd, heure_fin: hf, poste_assigne: poste || undefined });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setOffset(o => o - 1)}>‹</Button>
          <span className="text-sm text-muted-foreground">
            Semaine du {new Date(dates[0]).toLocaleDateString("fr-FR")}
          </span>
          <Button size="sm" variant="outline" onClick={() => setOffset(o => o + 1)}>›</Button>
          {offset !== 0 && <Button size="sm" variant="ghost" onClick={() => setOffset(0)}>Aujourd'hui</Button>}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Créneau</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau créneau planning</DialogTitle></DialogHeader>
            <form onSubmit={handle} className="space-y-4">
              <div>
                <Label>Employé</Label>
                <Select value={employeId} onValueChange={setEmployeId} required>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{employes.map(e => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Début</Label><Input type="time" value={hd} onChange={e => setHd(e.target.value)} required /></div>
                <div><Label>Fin</Label><Input type="time" value={hf} onChange={e => setHf(e.target.value)} required /></div>
              </div>
              <div><Label>Poste assigné</Label><Input value={poste} onChange={e => setPoste(e.target.value)} /></div>
              <Button type="submit" className="w-full" disabled={creer.isPending || !employeId}>Ajouter</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : employes.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <CalendarRange className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Ajoutez d'abord des employés pour créer un planning.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground sticky left-0 bg-muted/50">Employé</th>
                {dates.map((d, i) => (
                  <th key={d} className="px-3 py-2 text-left font-medium text-muted-foreground min-w-32">
                    {JOURS[i]} {new Date(d).getDate()}/{new Date(d).getMonth() + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employes.map(emp => (
                <tr key={emp.id}>
                  <td className="px-3 py-2 font-medium sticky left-0 bg-card">{emp.nom}</td>
                  {dates.map(d => {
                    const items = planParCell[`${emp.id}_${d}`] ?? [];
                    return (
                      <td key={d} className="px-2 py-2 align-top">
                        {items.length === 0 ? <span className="text-muted-foreground/50">—</span> : (
                          <div className="space-y-1">
                            {items.map((it: unknown) => (
                              <div key={it.id} className="rounded bg-info/10 text-info px-1.5 py-1 group flex items-center justify-between gap-1">
                                <span>{it.heure_debut?.slice(0, 5)}–{it.heure_fin?.slice(0, 5)}{it.poste_assigne ? ` · ${it.poste_assigne}` : ""}</span>
                                <button onClick={() => supprimer.mutate(it.id)} className="opacity-0 group-hover:opacity-100">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
