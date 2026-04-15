import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookOpen, Lock, Unlock, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatAmount, STATUS_COLORS } from "@/config/app";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/journal-caisse")({
  component: JournalCaissePage,
  head: () => ({
    meta: [
      { title: "Journal de caisse — MWAYE HOUSE" },
      { name: "description", content: "Journal de caisse quotidien" },
    ],
  }),
});

interface JournalRow {
  id: string;
  date_journal: string;
  solde_ouverture: number;
  total_recettes: number;
  total_depenses: number;
  solde_cloture: number;
  statut: string;
  observations: string | null;
}

function JournalCaissePage() {
  const { user, loading: authLoading } = useAuth();
  const [journals, setJournals] = useState<JournalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchJournals = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("journal_caisse")
      .select("*")
      .order("date_journal", { ascending: false })
      .limit(30);
    setJournals((data as JournalRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchJournals();
  }, [user, fetchJournals]);

  const handleOpenDay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { setError("Non connecté"); setCreating(false); return; }

    const dateJournal = form.get("date_journal") as string;
    const soldeOuverture = parseFloat(form.get("solde_ouverture") as string) || 0;

    // Fetch today's recettes and depenses
    const [recRes, depRes] = await Promise.all([
      supabase.from("recettes").select("montant").eq("date_recette", dateJournal),
      supabase.from("depenses").select("montant").eq("date_depense", dateJournal),
    ]);

    const totalRecettes = (recRes.data || []).reduce((s, r) => s + Number(r.montant), 0);
    const totalDepenses = (depRes.data || []).reduce((s, d) => s + Number(d.montant), 0);

    const { error: insertError } = await supabase.from("journal_caisse").insert({
      user_id: u.id,
      date_journal: dateJournal,
      solde_ouverture: soldeOuverture,
      total_recettes: totalRecettes,
      total_depenses: totalDepenses,
      solde_cloture: soldeOuverture + totalRecettes - totalDepenses,
    });

    if (insertError) {
      setError(insertError.message.includes("unique") ? "Une entrée existe déjà pour cette date." : insertError.message);
    } else {
      setShowNew(false);
      fetchJournals();
    }
    setCreating(false);
  };

  const handleClose = async (id: string) => {
    await supabase.from("journal_caisse").update({ statut: "clôturé" }).eq("id", id);
    fetchJournals();
  };

  if (authLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Journal de caisse</h1>
            <p className="text-sm text-muted-foreground mt-1">Suivi quotidien de la caisse</p>
          </div>
          <Button size="sm" onClick={() => setShowNew(true)}>
            <Plus className="h-4 w-4 mr-1" /> Ouvrir une journée
          </Button>
        </div>

        {showNew && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Nouvelle journée de caisse</h3>
            {error && <div className="mb-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</div>}
            <form onSubmit={handleOpenDay} className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label htmlFor="date_journal">Date</Label>
                <Input id="date_journal" name="date_journal" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="solde_ouverture">Solde d'ouverture (FCFA)</Label>
                <Input id="solde_ouverture" name="solde_ouverture" type="number" step="1" defaultValue="0" />
              </div>
              <Button type="submit" disabled={creating}>
                {creating ? "Création..." : "Ouvrir la journée"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Annuler</Button>
            </form>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : journals.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Aucune journée de caisse. Cliquez sur « Ouvrir une journée » pour commencer.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Ouverture</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Recettes</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Dépenses</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Clôture</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {journals.map((j) => (
                  <tr key={j.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">
                      {new Date(j.date_journal).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">{formatAmount(Number(j.solde_ouverture))}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-success font-medium">+{formatAmount(Number(j.total_recettes))}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-destructive font-medium">-{formatAmount(Number(j.total_depenses))}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-card-foreground">{formatAmount(Number(j.solde_cloture))}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        j.statut === "ouvert" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      )}>
                        {j.statut === "ouvert" ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {j.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {j.statut === "ouvert" && (
                        <Button size="sm" variant="outline" onClick={() => handleClose(j.id)}>
                          Clôturer
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
