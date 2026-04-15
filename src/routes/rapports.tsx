import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { useRapportsData } from "@/hooks/useRapportsData";
import { formatAmount } from "@/config/app";
import { exportCSV, exportRapportPDF } from "@/services/rapportExportService";
import { useState } from "react";

export const Route = createFileRoute("/rapports")({
  component: RapportsPage,
  head: () => ({
    meta: [
      { title: "Rapports — MWAYE HOUSE" },
      { name: "description", content: "Rapports financiers dynamiques" },
    ],
  }),
});

const COLORS = ["var(--color-primary)", "var(--color-warning)", "var(--color-info)", "var(--color-accent)", "var(--color-success)", "var(--color-destructive)"];

function getDefaultDates() {
  const now = new Date();
  const debut = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const fin = now.toISOString().slice(0, 10);
  return { debut, fin };
}

function RapportsPage() {
  const defaults = getDefaultDates();
  const [dateDebut, setDateDebut] = useState(defaults.debut);
  const [dateFin, setDateFin] = useState(defaults.fin);

  const {
    totalRecettes, totalDepenses, benefice,
    weeklyData, categoryPieData, depensesPieData,
    recettesParCategorie, depensesParCategorie,
    nbRecettes, nbDepenses,
    recettes, depenses, isLoading,
  } = useRapportsData({ dateDebut, dateFin });

  const handleExportCSV = () => exportCSV(recettes, depenses, dateDebut, dateFin);
  const handleExportPDF = () => exportRapportPDF(
    { totalRecettes, totalDepenses, benefice, nbRecettes, nbDepenses, recettesParCategorie, depensesParCategorie },
    dateDebut, dateFin,
  );

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapports</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {nbRecettes} recettes · {nbDepenses} dépenses
            </p>
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <Label className="text-xs">Du</Label>
              <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="w-36" />
            </div>
            <div>
              <Label className="text-xs">Au</Label>
              <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="w-36" />
            </div>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total recettes</p>
            <p className="text-2xl font-bold text-success mt-1">{formatAmount(totalRecettes)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total dépenses</p>
            <p className="text-2xl font-bold text-destructive mt-1">{formatAmount(totalDepenses)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Bénéfice net</p>
            <p className={`text-2xl font-bold mt-1 ${benefice >= 0 ? "text-primary" : "text-destructive"}`}>{formatAmount(benefice)}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Recettes vs Dépenses par semaine</h3>
            {weeklyData.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Aucune donnée sur cette période</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="recettes" name="Recettes" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="depenses" name="Dépenses" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Recettes par catégorie</h3>
            {categoryPieData.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Aucune donnée</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {categoryPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tableaux détaillés */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-card-foreground">Recettes par catégorie</h3>
            </div>
            {Object.keys(recettesParCategorie).length === 0 ? (
              <p className="px-5 py-6 text-center text-muted-foreground">Aucune recette</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(recettesParCategorie)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, val]) => (
                      <tr key={cat} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 font-medium text-card-foreground">{cat}</td>
                        <td className="px-5 py-3 text-right font-semibold text-success tabular-nums">{formatAmount(val)}</td>
                        <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                          {totalRecettes > 0 ? `${Math.round((val / totalRecettes) * 100)}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  <tr className="bg-muted/30">
                    <td className="px-5 py-3 font-bold text-card-foreground">Total</td>
                    <td className="px-5 py-3 text-right font-bold text-success tabular-nums">{formatAmount(totalRecettes)}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums">100%</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-card-foreground">Dépenses par catégorie</h3>
            </div>
            {Object.keys(depensesParCategorie).length === 0 ? (
              <p className="px-5 py-6 text-center text-muted-foreground">Aucune dépense</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(depensesParCategorie)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, val]) => (
                      <tr key={cat} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 font-medium text-card-foreground">{cat}</td>
                        <td className="px-5 py-3 text-right font-semibold text-destructive tabular-nums">{formatAmount(val)}</td>
                        <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                          {totalDepenses > 0 ? `${Math.round((val / totalDepenses) * 100)}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  <tr className="bg-muted/30">
                    <td className="px-5 py-3 font-bold text-card-foreground">Total</td>
                    <td className="px-5 py-3 text-right font-bold text-destructive tabular-nums">{formatAmount(totalDepenses)}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums">100%</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
