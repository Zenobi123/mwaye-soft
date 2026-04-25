import { useComparaisonMensuelle } from "@/hooks/useComparaisonMensuelle";
import { formatAmount } from "@/config/app";
import { ArrowDown, ArrowUp, Minus, Loader2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

function variation(actuel: number, precedent: number) {
  if (precedent === 0) return actuel === 0 ? 0 : 100;
  return Math.round(((actuel - precedent) / Math.abs(precedent)) * 100);
}

function VarBadge({ value }: { value: number }) {
  if (value === 0)
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  const positive = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 font-medium ${positive ? "text-success" : "text-destructive"}`}>
      {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(value)}%
    </span>
  );
}

export function ComparaisonMensuelle({ nbMois = 6 }: { nbMois?: number }) {
  const { data, isLoading } = useComparaisonMensuelle(nbMois);

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Loader2 className="h-5 w-5 animate-spin inline text-muted-foreground" />
      </div>
    );
  }

  const reversed = [...data].reverse();
  const courant = reversed[0];
  const precedent = reversed[1];

  return (
    <div className="space-y-6">
      {courant && precedent && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Recettes</p>
            <p className="text-xl font-bold text-success mt-1">{formatAmount(courant.recettes)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatAmount(precedent.recettes)} <VarBadge value={variation(courant.recettes, precedent.recettes)} />
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Dépenses</p>
            <p className="text-xl font-bold text-destructive mt-1">{formatAmount(courant.depenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatAmount(precedent.depenses)} <VarBadge value={variation(courant.depenses, precedent.depenses)} />
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Bénéfice</p>
            <p className={`text-xl font-bold mt-1 ${courant.benefice >= 0 ? "text-primary" : "text-destructive"}`}>
              {formatAmount(courant.benefice)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatAmount(precedent.benefice)} <VarBadge value={variation(courant.benefice, precedent.benefice)} />
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Évolution sur {nbMois} mois</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${Number(v).toLocaleString("fr-FR")} F CFA`]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="recettes" name="Recettes" stroke="var(--color-success)" strokeWidth={2} />
            <Line type="monotone" dataKey="depenses" name="Dépenses" stroke="var(--color-destructive)" strokeWidth={2} />
            <Line type="monotone" dataKey="benefice" name="Bénéfice" stroke="var(--color-primary)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold">Tableau comparatif</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Mois</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Recettes</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Dépenses</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Bénéfice</th>
              <th className="px-5 py-3 text-right font-medium text-muted-foreground">Var. bénéf.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((m, i) => {
              const prev = i > 0 ? data[i - 1] : null;
              return (
                <tr key={m.mois} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium capitalize">{m.label}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-success">{formatAmount(m.recettes)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-destructive">{formatAmount(m.depenses)}</td>
                  <td className={`px-5 py-3 text-right tabular-nums font-semibold ${m.benefice >= 0 ? "text-primary" : "text-destructive"}`}>
                    {formatAmount(m.benefice)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {prev ? <VarBadge value={variation(m.benefice, prev.benefice)} /> : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
