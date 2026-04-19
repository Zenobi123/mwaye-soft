import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, RefreshCw, Loader2 } from "lucide-react";
import { useBilansMensuels, genererBilanMois } from "@/hooks/useBilansMensuels";
import { exportBilanPDF, exportBilanExcel, type BilanMensuel } from "@/services/exportService";
import { formatAmount } from "@/config/app";
import { toast } from "sonner";

function formatMois(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function BilansMensuels() {
  const { data: bilans, isLoading } = useBilansMensuels();
  const queryClient = useQueryClient();
  const now = new Date();
  const defaultMois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const [moisCible, setMoisCible] = useState(defaultMois);
  const [generating, setGenerating] = useState(false);

  const handleGenerer = async () => {
    setGenerating(true);
    try {
      await genererBilanMois(moisCible);
      await queryClient.invalidateQueries({ queryKey: ["bilans_mensuels"] });
      toast.success(`Bilan ${formatMois(moisCible)} généré`);
    } catch (e) {
      toast.error("Échec génération", { description: (e as Error).message });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border px-5 py-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Bilans mensuels</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Génération automatique le 1er de chaque mois</p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <Label className="text-xs">Mois cible</Label>
            <Input
              type="month"
              value={moisCible.slice(0, 7)}
              onChange={(e) => setMoisCible(`${e.target.value}-01`)}
              className="w-40"
            />
          </div>
          <Button size="sm" onClick={handleGenerer} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Générer
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin inline text-muted-foreground" /></div>
      ) : !bilans || bilans.length === 0 ? (
        <p className="px-5 py-8 text-center text-muted-foreground text-sm">Aucun bilan. Cliquez sur « Générer ».</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Mois</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Recettes</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Dépenses</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Bénéfice</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Marge</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Exports</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bilans.map((b) => {
              const bilan: BilanMensuel = {
                mois: b.mois,
                total_recettes: Number(b.total_recettes),
                total_depenses: Number(b.total_depenses),
                benefice: Number(b.benefice),
                marge_nette: Number(b.marge_nette),
                nb_recettes: b.nb_recettes,
                nb_depenses: b.nb_depenses,
                detail_recettes: (b.detail_recettes as Record<string, number>) || {},
                detail_depenses: (b.detail_depenses as Record<string, number>) || {},
              };
              return (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-card-foreground capitalize">{formatMois(b.mois)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-success font-medium">{formatAmount(bilan.total_recettes)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-destructive font-medium">{formatAmount(bilan.total_depenses)}</td>
                  <td className={`px-5 py-3 text-right tabular-nums font-semibold ${bilan.benefice >= 0 ? "text-primary" : "text-destructive"}`}>
                    {formatAmount(bilan.benefice)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">{bilan.marge_nette}%</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => exportBilanPDF(bilan)}>
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => exportBilanExcel(bilan)}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
