import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, formatAmount } from "@/config/app";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { RecetteForm } from "@/components/comptabilite/RecetteForm";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/recettes")({
  component: RecettesPage,
  head: () => ({
    meta: [
      { title: "Recettes — MWAYE HOUSE" },
      { name: "description", content: "Suivi des recettes du complexe" },
    ],
  }),
});

interface RecetteRow {
  id: string;
  libelle: string;
  montant: number;
  categorie: string;
  mode_paiement: string;
  date_recette: string;
  reference: string | null;
  notes: string | null;
}

function RecettesPage() {
  const { user, loading: authLoading } = useAuth();
  const [recettes, setRecettes] = useState<RecetteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchRecettes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("recettes")
      .select("id, libelle, montant, categorie, mode_paiement, date_recette, reference, notes")
      .order("date_recette", { ascending: false })
      .limit(100);
    setRecettes((data as RecetteRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchRecettes();
  }, [user, fetchRecettes]);

  const total = recettes.reduce((s, r) => s + Number(r.montant), 0);

  if (authLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></AppLayout>;
  }

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
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" /> Nouvelle recette
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recettes.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Aucune recette enregistrée. Cliquez sur « Nouvelle recette » pour commencer.
            </div>
          ) : (
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
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{r.libelle}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", CATEGORY_COLORS[r.categorie] || "bg-muted text-muted-foreground")}>
                        {r.categorie}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {new Date(r.date_recette).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{r.mode_paiement}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">
                      +{formatAmount(Number(r.montant))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <RecetteForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchRecettes(); }}
        />
      )}
    </AppLayout>
  );
}
