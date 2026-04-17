import { formatAmount } from "@/config/app";

interface ExportRow {
  date: string;
  type: string;
  libelle?: string;
  categorie: string;
  montant: number;
  mode_paiement: string;
}

export function exportCSV(
  recettes: { date_recette: string; categorie: string; montant: number; mode_paiement: string }[],
  depenses: { date_depense: string; categorie: string; montant: number; mode_paiement: string }[],
  dateDebut: string,
  dateFin: string,
) {
  const rows: ExportRow[] = [
    ...recettes.map((r) => ({
      date: r.date_recette,
      type: "Recette",
      categorie: r.categorie,
      montant: Number(r.montant),
      mode_paiement: r.mode_paiement,
    })),
    ...depenses.map((d) => ({
      date: d.date_depense,
      type: "Dépense",
      categorie: d.categorie,
      montant: Number(d.montant),
      mode_paiement: d.mode_paiement,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const header = "Date,Type,Catégorie,Montant (F CFA),Mode de paiement";
  const csvRows = rows.map(
    (r) => `${r.date},${r.type},${r.categorie},${r.montant},${r.mode_paiement}`,
  );

  const totalRecettes = recettes.reduce((s, r) => s + Number(r.montant), 0);
  const totalDepenses = depenses.reduce((s, d) => s + Number(d.montant), 0);

  const footer = [
    "",
    `Total Recettes,,, ${totalRecettes},`,
    `Total Dépenses,,, ${totalDepenses},`,
    `Bénéfice net,,, ${totalRecettes - totalDepenses},`,
  ];

  const csv = [header, ...csvRows, ...footer].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rapport_${dateDebut}_${dateFin}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRapportPDF(
  stats: {
    totalRecettes: number;
    totalDepenses: number;
    benefice: number;
    nbRecettes: number;
    nbDepenses: number;
    recettesParCategorie: Record<string, number>;
    depensesParCategorie: Record<string, number>;
  },
  dateDebut: string,
  dateFin: string,
) {
  // Generate a printable HTML report and trigger print dialog
  const catRecRows = Object.entries(stats.recettesParCategorie)
    .map(([cat, val]) => `<tr><td>${cat}</td><td style="text-align:right">${formatAmount(val)}</td></tr>`)
    .join("");
  const catDepRows = Object.entries(stats.depensesParCategorie)
    .map(([cat, val]) => `<tr><td>${cat}</td><td style="text-align:right">${formatAmount(val)}</td></tr>`)
    .join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Rapport MWAYE HOUSE</title>
<style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#222}
  h1{font-size:22px;margin-bottom:4px}
  h2{font-size:16px;margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:4px}
  .sub{color:#888;font-size:13px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin:16px 0}
  .card{border:1px solid #ddd;border-radius:8px;padding:16px}
  .card .label{font-size:12px;color:#888}
  .card .val{font-size:22px;font-weight:700;margin-top:4px}
  .green{color:#16a34a} .red{color:#dc2626} .blue{color:#2563eb}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #eee;font-size:13px}
  th{background:#f8f8f8;font-weight:600}
  @media print{body{padding:20px}}
</style></head><body>
<h1>MWAYE HOUSE — Rapport financier</h1>
<p class="sub">Période : ${dateDebut} au ${dateFin} · ${stats.nbRecettes} recettes · ${stats.nbDepenses} dépenses</p>
<div class="grid">
  <div class="card"><div class="label">Total recettes</div><div class="val green">${formatAmount(stats.totalRecettes)}</div></div>
  <div class="card"><div class="label">Total dépenses</div><div class="val red">${formatAmount(stats.totalDepenses)}</div></div>
  <div class="card"><div class="label">Bénéfice net</div><div class="val blue">${formatAmount(stats.benefice)}</div></div>
</div>
<h2>Recettes par catégorie</h2>
<table><thead><tr><th>Catégorie</th><th style="text-align:right">Montant</th></tr></thead><tbody>${catRecRows || "<tr><td colspan='2'>Aucune donnée</td></tr>"}</tbody></table>
<h2>Dépenses par catégorie</h2>
<table><thead><tr><th>Catégorie</th><th style="text-align:right">Montant</th></tr></thead><tbody>${catDepRows || "<tr><td colspan='2'>Aucune donnée</td></tr>"}</tbody></table>
<p class="sub" style="margin-top:32px;text-align:center">Généré le ${new Date().toLocaleDateString("fr-FR")} — MWAYE HOUSE</p>
</body></html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }
}
