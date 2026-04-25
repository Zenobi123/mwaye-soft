import { useRecettesParActivite } from "@/hooks/useComparaisonMensuelle";
import { formatAmount } from "@/config/app";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const ACTIVITE_COLORS: Record<string, string> = {
  Sport: "var(--color-primary)",
  Hammam: "var(--color-info)",
  Événementiel: "var(--color-warning)",
  Immobilier: "var(--color-success)",
  Commerce: "var(--color-accent)",
  Autres: "var(--color-muted-foreground)",
};

function colorFor(activite: string, idx: number) {
  return ACTIVITE_COLORS[activite] || ["var(--color-primary)", "var(--color-info)", "var(--color-warning)", "var(--color-success)", "var(--color-accent)"][idx % 5];
}

export function RevenusParActivite({ nbMois = 6 }: { nbMois?: number }) {
  const { data, isLoading } = useRecettesParActivite(nbMois);

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Loader2 className="h-5 w-5 animate-spin inline text-muted-foreground" />
      </div>
    );
  }

  const total = data.repartition.reduce((s, r) => s + r.recettes, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Recettes par activité — {nbMois} derniers mois</h3>
        {data.parMois.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">Aucune donnée</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.parMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${Number(v).toLocaleString("fr-FR")} F CFA`]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {data.activites.map((a, i) => (
                <Bar key={a} dataKey={a} stackId="rev" fill={colorFor(a, i)} radius={i === data.activites.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Répartition</h3>
        {data.repartition.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">Aucune donnée</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.repartition} dataKey="recettes" nameKey="activite" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {data.repartition.map((r, i) => (
                    <Cell key={r.activite} fill={colorFor(r.activite, i)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${Number(v).toLocaleString("fr-FR")} F CFA`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-3 space-y-1.5 text-sm">
              {data.repartition.map((r, i) => (
                <li key={r.activite} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorFor(r.activite, i) }} />
                    {r.activite}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatAmount(r.recettes)} <span className="text-xs">({total > 0 ? Math.round((r.recettes / total) * 100) : 0}%)</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
