import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Package, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStocksData } from "@/hooks/useStocksData";
import { formatAmount } from "@/config/app";
import { ArticleForm } from "@/components/stocks/ArticleForm";
import { MouvementForm } from "@/components/stocks/MouvementForm";

export const Route = createFileRoute("/stocks")({
  component: StocksPage,
  head: () => ({
    meta: [
      { title: "Stocks — MWAYE HOUSE" },
      { name: "description", content: "Gestion des stocks et inventaire" },
    ],
  }),
});

function StocksPage() {
  const { articles, mouvements, alertes, isLoading, addArticle, addMouvement, deleteArticle } = useStocksData();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stocks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {articles.length} article(s) · {alertes.length > 0 && <span className="text-warning font-semibold">{alertes.length} alerte(s)</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <MouvementForm articles={articles} onSubmit={(v) => addMouvement.mutate(v)} isPending={addMouvement.isPending} />
            <ArticleForm onSubmit={(v) => addArticle.mutate(v)} isPending={addArticle.isPending} />
          </div>
        </div>

        {alertes.length > 0 && (
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold text-warning">Stock bas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {alertes.map(a => (
                <span key={a.id} className="rounded-full bg-warning/10 text-warning px-3 py-1 text-xs font-medium">
                  {a.nom} ({a.quantite}/{a.quantite_min})
                </span>
              ))}
            </div>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun article en stock.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Article</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Qté</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Min</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Unité</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Prix unit.</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Emplacement</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{a.nom}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a.categorie}</td>
                    <td className={cn("px-5 py-3.5 text-center font-semibold tabular-nums", a.quantite <= a.quantite_min ? "text-warning" : "text-card-foreground")}>{a.quantite}</td>
                    <td className="px-5 py-3.5 text-center text-muted-foreground tabular-nums">{a.quantite_min}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a.unite}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{formatAmount(Number(a.prix_unitaire))}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a.emplacement ?? "—"}</td>
                    <td className="px-2 py-3.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteArticle.mutate(a.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mouvements.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-card-foreground">Derniers mouvements</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Article</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Quantité</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Motif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mouvements.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-muted-foreground">{m.date_mouvement}</td>
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{(m as any).articles_stock?.nom ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        m.type_mouvement === "entrée" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}>{m.type_mouvement}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-semibold tabular-nums">{m.quantite}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{m.motif ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
