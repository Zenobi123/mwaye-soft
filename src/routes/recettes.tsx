import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRecettes } from "@/hooks/useRecettes";
import { CATEGORY_COLORS, formatAmount } from "@/config/app";

export const Route = createFileRoute("/recettes")({
  component: RecettesPage,
  head: () => ({
    meta: [
      { title: "Recettes — MWAYE HOUSE" },
      { name: "description", content: "Suivi des recettes du complexe" },
    ],
  }),
});

function RecettesPage() {
  const { recettes, total } = useRecettes();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recettes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total : {formatAmount(total)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filtrer
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Nouvelle recette
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Description</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Paiement</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recettes.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{r.label}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", CATEGORY_COLORS[r.category])}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.date}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.method}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">
                    +{formatAmount(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
