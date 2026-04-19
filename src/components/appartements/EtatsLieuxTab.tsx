import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardCheck } from "lucide-react";
import { useImmobilier } from "@/hooks/useImmobilier";
import { useAppartementsData } from "@/hooks/useAppartementsData";

const PIECES_DEFAUT = ["Salon", "Chambre 1", "Chambre 2", "Cuisine", "Salle de bain", "Toilettes"];

export function EtatsLieuxTab() {
  const { etats, ajouterEtatLieux } = useImmobilier();
  const { contrats, appartements } = useAppartementsData();
  const [open, setOpen] = useState(false);
  const [contratId, setContratId] = useState("");
  const [type, setType] = useState("entrée");
  const [dateEtat, setDateEtat] = useState(new Date().toISOString().slice(0, 10));
  const [etatGeneral, setEtatGeneral] = useState("bon");
  const [eau, setEau] = useState("");
  const [elec, setElec] = useState("");
  const [signataire, setSignataire] = useState("");
  const [obs, setObs] = useState("");
  const [pieces, setPieces] = useState(PIECES_DEFAUT.map((p) => ({ piece: p, etat: "bon", remarque: "" })));

  const submit = () => {
    const contrat = contrats.find((c) => c.id === contratId);
    if (!contrat) return;
    ajouterEtatLieux.mutate({
      contrat_id: contratId,
      appartement_id: contrat.appartement_id,
      type, date_etat: dateEtat, etat_general: etatGeneral,
      compteur_eau: eau, compteur_elec: elec,
      signataire, observations: obs,
      pieces_detail: pieces,
    }, {
      onSuccess: () => {
        setOpen(false);
        setContratId(""); setEau(""); setElec(""); setSignataire(""); setObs("");
        setPieces(PIECES_DEFAUT.map((p) => ({ piece: p, etat: "bon", remarque: "" })));
      },
    });
  };

  const etatColor = (e: string) =>
    e === "bon" ? "bg-success/10 text-success" : e === "moyen" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Nouvel état des lieux</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>État des lieux</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contrat</Label>
                  <Select value={contratId} onValueChange={setContratId}>
                    <SelectTrigger><SelectValue placeholder="Choisir un contrat" /></SelectTrigger>
                    <SelectContent>
                      {contrats.map((c) => {
                        const appt = appartements.find((a) => a.id === c.appartement_id);
                        return (
                          <SelectItem key={c.id} value={c.id}>
                            {c.locataire} — Appt {appt?.numero ?? "?"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrée">Entrée</SelectItem>
                      <SelectItem value="sortie">Sortie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={dateEtat} onChange={(e) => setDateEtat(e.target.value)} />
                </div>
                <div>
                  <Label>État général</Label>
                  <Select value={etatGeneral} onValueChange={setEtatGeneral}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="mauvais">Mauvais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Compteur eau</Label>
                  <Input value={eau} onChange={(e) => setEau(e.target.value)} placeholder="m³" />
                </div>
                <div>
                  <Label>Compteur électricité</Label>
                  <Input value={elec} onChange={(e) => setElec(e.target.value)} placeholder="kWh" />
                </div>
              </div>
              <div>
                <Label>Signataire</Label>
                <Input value={signataire} onChange={(e) => setSignataire(e.target.value)} placeholder="Nom de la personne ayant signé" />
              </div>
              <div>
                <Label>Détail par pièce</Label>
                <div className="space-y-2 mt-1">
                  {pieces.map((p, i) => (
                    <div key={i} className="grid grid-cols-[1fr_120px_2fr] gap-2 items-center">
                      <span className="text-sm font-medium">{p.piece}</span>
                      <Select
                        value={p.etat}
                        onValueChange={(v) => setPieces((arr) => arr.map((x, j) => j === i ? { ...x, etat: v } : x))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bon">Bon</SelectItem>
                          <SelectItem value="moyen">Moyen</SelectItem>
                          <SelectItem value="mauvais">Mauvais</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Remarque"
                        value={p.remarque}
                        onChange={(e) => setPieces((arr) => arr.map((x, j) => j === i ? { ...x, remarque: e.target.value } : x))}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Observations</Label>
                <Textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={submit} disabled={!contratId || ajouterEtatLieux.isPending}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Locataire / Appt</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">État général</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Compteurs</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Signataire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {etats.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                <ClipboardCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Aucun état des lieux enregistré.
              </td></tr>
            ) : etats.map((e: any) => (
              <tr key={e.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">{new Date(e.date_etat).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{e.type}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{e.contrats_bail?.locataire ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">Appt {e.appartements?.numero ?? "—"}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={etatColor(e.etat_general)} variant="outline">{e.etat_general}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  Eau: {e.compteur_eau ?? "—"}<br/>Élec: {e.compteur_elec ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.signataire ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
