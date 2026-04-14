import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Lun", recettes: 45000, depenses: 12000 },
  { name: "Mar", recettes: 38000, depenses: 8000 },
  { name: "Mer", recettes: 52000, depenses: 15000 },
  { name: "Jeu", recettes: 61000, depenses: 9500 },
  { name: "Ven", recettes: 78000, depenses: 22000 },
  { name: "Sam", recettes: 95000, depenses: 18000 },
  { name: "Dim", recettes: 42000, depenses: 7000 },
];

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">
        Recettes vs Dépenses — Cette semaine
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
          <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `${v / 1000}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value.toLocaleString("fr-FR")} DA`]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="recettes" name="Recettes" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="depenses" name="Dépenses" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
