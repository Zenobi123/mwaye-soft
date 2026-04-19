import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send } from "lucide-react";
import { formatAmount } from "@/config/app";
import { useImmobilier } from "@/hooks/useImmobilier";

export function RappelsTab() {
  const { rappels, marquerRappelEnvoye } = useImmobilier();

  const niveauColor = (n: number) =>
    n === 3 ? "bg-destructive text-destructive-foreground" : n === 2 ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground";
  const niveauLabel = (n: number) => `Niveau ${n} · ${n === 1 ? "rappel doux" : n === 2 ? "rappel ferme" : "mise en demeure"}`;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Quittance</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Locataire / Appt</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Niveau</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Retard</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rappels.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Aucun rappel actif. Tous les loyers sont à jour.
            </td></tr>
          ) : rappels.map((r: any) => (
            <tr key={r.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs">{r.quittances?.numero ?? "—"}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{r.quittances?.contrats_bail?.locataire ?? "—"}</div>
                <div className="text-xs text-muted-foreground">Appt {r.quittances?.appartements?.numero ?? "—"}</div>
              </td>
              <td className="px-4 py-3">
                <Badge className={niveauColor(r.niveau)}>{niveauLabel(r.niveau)}</Badge>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-destructive">{r.jours_retard}j</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatAmount(Number(r.quittances?.montant_total ?? 0))}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">{r.statut}</Badge>
                {r.envoye_le && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(r.envoye_le).toLocaleString("fr-FR")}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {r.statut === "en_attente" && (
                  <Button size="sm" variant="outline" onClick={() => marquerRappelEnvoye.mutate(r.id)}>
                    <Send className="h-3 w-3 mr-1" /> Marquer envoyé
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
