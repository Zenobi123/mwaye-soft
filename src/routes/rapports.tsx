import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/rapports")({
  component: RapportsPage,
  head: () => ({
    meta: [
      { title: "Rapports — GestiComplex" },
      { name: "description", content: "Rapports financiers quotidiens et hebdomadaires" },
    ],
  }),
});

const weeklyData = [
  { name: "Sem 1", recettes: 420000, depenses: 185000 },
  { name: "Sem 2", recettes: 385000, depenses: 160000 },
  { name: "Sem 3", recettes: 510000, depenses: 210000 },
  { name: "Sem 4", recettes: 475000, depenses: 175000 },
];

const categoryData = [
  { name: "Sport", value: 400000 },
  { name: "Événements", value: 440000 },
  { name: "Appartements", value: 214000 },
  { name: "Hammam", value: 124000 },
];

const COLORS = ["var(--color-primary)", "var(--color-warning)", "var(--color-info)", "var(--color-accent)"];

function RapportsPage() {
  const totalRecettes = weeklyData.reduce((s, w) => s + w.recettes, 0);
  const totalDepenses = weeklyData.reduce((s, w) => s + w.depenses, 0);
  const benefice = totalRecettes - totalDepenses;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapports</h1>
            <p className="text-sm text-muted-foreground mt-1">Avril 2026</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" /> Rapport quotidien
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" /> Exporter
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total recettes</p>
            <p className="text-2xl font-bold text-success mt-1">{totalRecettes.toLocaleString("fr-FR")} DA</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total dépenses</p>
            <p className="text-2xl font-bold text-destructive mt-1">{totalDepenses.toLocaleString("fr-FR")} DA</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Bénéfice net</p>
            <p className="text-2xl font-bold text-primary mt-1">{benefice.toLocaleString("fr-FR")} DA</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Recettes vs Dépenses par semaine</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} DA`]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="recettes" name="Recettes" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="depenses" name="Dépenses" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Recettes par catégorie</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} DA`]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
