import * as XLSX from "xlsx";

interface RecetteRow {
  date_recette: string;
  libelle?: string;
  categorie: string;
  montant: number;
  mode_paiement: string;
}
interface DepenseRow {
  date_depense: string;
  libelle?: string;
  categorie: string;
  montant: number;
  mode_paiement: string;
}

function setColWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws["!cols"] = widths.map((w) => ({ wch: w }));
}

export function exportRapportExcel(
  recettes: RecetteRow[],
  depenses: DepenseRow[],
  stats: {
    totalRecettes: number;
    totalDepenses: number;
    benefice: number;
    nbRecettes: number;
    nbDepenses: number;
    recettesParCategorie: Record<string, number>;
    depensesParCategorie: Record<string, number>;
    parModePaiement: Record<string, number>;
    weeklyData: { name: string; recettes: number; depenses: number }[];
  },
  dateDebut: string,
  dateFin: string,
) {
  const wb = XLSX.utils.book_new();
  const marge = stats.totalRecettes > 0 ? Math.round((stats.benefice / stats.totalRecettes) * 100) : 0;

  // 1. Synthèse
  const synthese = [
    ["MWAYE HOUSE — Rapport financier"],
    [`Période : du ${dateDebut} au ${dateFin}`],
    [`Généré le ${new Date().toLocaleString("fr-FR")}`],
    [],
    ["Indicateur", "Valeur"],
    ["Total recettes (FCFA)", stats.totalRecettes],
    ["Total dépenses (FCFA)", stats.totalDepenses],
    ["Bénéfice net (FCFA)", stats.benefice],
    ["Marge nette (%)", marge],
    ["Nombre de recettes", stats.nbRecettes],
    ["Nombre de dépenses", stats.nbDepenses],
  ];
  const wsSyn = XLSX.utils.aoa_to_sheet(synthese);
  setColWidths(wsSyn, [32, 22]);
  XLSX.utils.book_append_sheet(wb, wsSyn, "Synthèse");

  // 2. Recettes
  const recData = [
    ["Date", "Libellé", "Catégorie", "Montant (FCFA)", "Mode paiement"],
    ...recettes.map((r) => [r.date_recette, r.libelle || "", r.categorie, Number(r.montant), r.mode_paiement]),
    [],
    ["", "", "TOTAL", stats.totalRecettes, ""],
  ];
  const wsRec = XLSX.utils.aoa_to_sheet(recData);
  setColWidths(wsRec, [12, 32, 18, 16, 16]);
  XLSX.utils.book_append_sheet(wb, wsRec, "Recettes");

  // 3. Dépenses
  const depData = [
    ["Date", "Libellé", "Catégorie", "Montant (FCFA)", "Mode paiement"],
    ...depenses.map((d) => [d.date_depense, d.libelle || "", d.categorie, Number(d.montant), d.mode_paiement]),
    [],
    ["", "", "TOTAL", stats.totalDepenses, ""],
  ];
  const wsDep = XLSX.utils.aoa_to_sheet(depData);
  setColWidths(wsDep, [12, 32, 18, 16, 16]);
  XLSX.utils.book_append_sheet(wb, wsDep, "Dépenses");

  // 4. Par catégorie
  const catRows: (string | number)[][] = [["Type", "Catégorie", "Montant (FCFA)", "Part (%)"]];
  Object.entries(stats.recettesParCategorie)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, val]) =>
      catRows.push([
        "Recette",
        cat,
        val,
        stats.totalRecettes > 0 ? Math.round((val / stats.totalRecettes) * 100) : 0,
      ]),
    );
  Object.entries(stats.depensesParCategorie)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, val]) =>
      catRows.push([
        "Dépense",
        cat,
        val,
        stats.totalDepenses > 0 ? Math.round((val / stats.totalDepenses) * 100) : 0,
      ]),
    );
  const wsCat = XLSX.utils.aoa_to_sheet(catRows);
  setColWidths(wsCat, [12, 22, 18, 12]);
  XLSX.utils.book_append_sheet(wb, wsCat, "Par catégorie");

  // 5. Par mode de paiement
  const modeRows: (string | number)[][] = [["Mode de paiement", "Montant cumulé (FCFA)"]];
  Object.entries(stats.parModePaiement)
    .sort(([, a], [, b]) => b - a)
    .forEach(([mode, val]) => modeRows.push([mode, val]));
  const wsMode = XLSX.utils.aoa_to_sheet(modeRows);
  setColWidths(wsMode, [22, 22]);
  XLSX.utils.book_append_sheet(wb, wsMode, "Par mode paiement");

  // 6. Évolution
  const evolRows: (string | number)[][] = [
    ["Période", "Recettes (FCFA)", "Dépenses (FCFA)", "Bénéfice (FCFA)"],
    ...stats.weeklyData.map((w) => [w.name, w.recettes, w.depenses, w.recettes - w.depenses]),
  ];
  const wsEvol = XLSX.utils.aoa_to_sheet(evolRows);
  setColWidths(wsEvol, [16, 18, 18, 18]);
  XLSX.utils.book_append_sheet(wb, wsEvol, "Évolution");

  XLSX.writeFile(wb, `rapport_${dateDebut}_${dateFin}.xlsx`);
}
