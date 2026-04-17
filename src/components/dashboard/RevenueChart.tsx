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

interface RevenueChartProps {
  data: { name: string; recettes: number; depenses: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
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
            formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} F CFA`]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="recettes" name="Recettes" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="depenses" name="Dépenses" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
