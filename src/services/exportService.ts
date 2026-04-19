import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatAmount } from "@/config/app";

export interface BilanMensuel {
  mois: string;
  total_recettes: number;
  total_depenses: number;
  benefice: number;
  marge_nette: number;
  nb_recettes: number;
  nb_depenses: number;
  detail_recettes: Record<string, number>;
  detail_depenses: Record<string, number>;
}

export interface JournalLigne {
  date_journal: string;
  solde_ouverture: number;
  total_recettes: number;
  total_depenses: number;
  solde_cloture: number;
  statut: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR");
}

function formatMois(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// ============ BILAN MENSUEL PDF ============
export function exportBilanPDF(bilan: BilanMensuel) {
  const doc = new jsPDF();
  const titre = `Bilan mensuel — ${formatMois(bilan.mois)}`;

  doc.setFontSize(16);
  doc.text("MWAYE HOUSE", 14, 18);
  doc.setFontSize(12);
  doc.text(titre, 14, 26);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, 14, 32);
  doc.setTextColor(0);

  // Synthèse
  autoTable(doc, {
    startY: 40,
    head: [["Indicateur", "Valeur"]],
    body: [
      ["Total recettes", formatAmount(bilan.total_recettes)],
      ["Total dépenses", formatAmount(bilan.total_depenses)],
      ["Bénéfice net", formatAmount(bilan.benefice)],
      ["Marge nette", `${bilan.marge_nette}%`],
      ["Nombre de recettes", String(bilan.nb_recettes)],
      ["Nombre de dépenses", String(bilan.nb_depenses)],
    ],
    theme: "grid",
    headStyles: { fillColor: [180, 140, 60] },
  });

  // Détail recettes
  const recRows = Object.entries(bilan.detail_recettes).sort(([, a], [, b]) => Number(b) - Number(a));
  if (recRows.length > 0) {
    autoTable(doc, {
      head: [["Catégorie de recettes", "Montant", "%"]],
      body: recRows.map(([cat, val]) => [
        cat,
        formatAmount(Number(val)),
        bilan.total_recettes > 0 ? `${Math.round((Number(val) / bilan.total_recettes) * 100)}%` : "—",
      ]),
      theme: "striped",
      headStyles: { fillColor: [60, 140, 80] },
    });
  }

  // Détail dépenses
  const depRows = Object.entries(bilan.detail_depenses).sort(([, a], [, b]) => Number(b) - Number(a));
  if (depRows.length > 0) {
    autoTable(doc, {
      head: [["Catégorie de dépenses", "Montant", "%"]],
      body: depRows.map(([cat, val]) => [
        cat,
        formatAmount(Number(val)),
        bilan.total_depenses > 0 ? `${Math.round((Number(val) / bilan.total_depenses) * 100)}%` : "—",
      ]),
      theme: "striped",
      headStyles: { fillColor: [180, 60, 60] },
    });
  }

  doc.save(`bilan-${bilan.mois}.pdf`);
}

// ============ BILAN MENSUEL EXCEL ============
export function exportBilanExcel(bilan: BilanMensuel) {
  const wb = XLSX.utils.book_new();

  const synthese = [
    ["MWAYE HOUSE"],
    [`Bilan mensuel — ${formatMois(bilan.mois)}`],
    [`Généré le ${new Date().toLocaleString("fr-FR")}`],
    [],
    ["Indicateur", "Valeur"],
    ["Total recettes", bilan.total_recettes],
    ["Total dépenses", bilan.total_depenses],
    ["Bénéfice net", bilan.benefice],
    ["Marge nette (%)", bilan.marge_nette],
    ["Nb recettes", bilan.nb_recettes],
    ["Nb dépenses", bilan.nb_depenses],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(synthese), "Synthèse");

  const recettesData = [
    ["Catégorie", "Montant", "%"],
    ...Object.entries(bilan.detail_recettes).map(([cat, val]) => [
      cat,
      Number(val),
      bilan.total_recettes > 0 ? Math.round((Number(val) / bilan.total_recettes) * 100) : 0,
    ]),
    ["Total", bilan.total_recettes, 100],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(recettesData), "Recettes");

  const depensesData = [
    ["Catégorie", "Montant", "%"],
    ...Object.entries(bilan.detail_depenses).map(([cat, val]) => [
      cat,
      Number(val),
      bilan.total_depenses > 0 ? Math.round((Number(val) / bilan.total_depenses) * 100) : 0,
    ]),
    ["Total", bilan.total_depenses, 100],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(depensesData), "Dépenses");

  XLSX.writeFile(wb, `bilan-${bilan.mois}.xlsx`);
}

// ============ JOURNAL DE CAISSE PDF ============
export function exportJournalPDF(lignes: JournalLigne[], titre: string) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("MWAYE HOUSE", 14, 18);
  doc.setFontSize(12);
  doc.text(`Journal de caisse — ${titre}`, 14, 26);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, 14, 32);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 40,
    head: [["Date", "Solde ouv.", "Recettes", "Dépenses", "Solde clôt.", "Statut"]],
    body: lignes.map((l) => [
      formatDate(l.date_journal),
      formatAmount(Number(l.solde_ouverture)),
      formatAmount(Number(l.total_recettes)),
      formatAmount(Number(l.total_depenses)),
      formatAmount(Number(l.solde_cloture)),
      l.statut,
    ]),
    theme: "grid",
    headStyles: { fillColor: [180, 140, 60] },
    styles: { fontSize: 9 },
  });

  // Totaux
  const totalRec = lignes.reduce((s, l) => s + Number(l.total_recettes), 0);
  const totalDep = lignes.reduce((s, l) => s + Number(l.total_depenses), 0);
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(`Total recettes : ${formatAmount(totalRec)}`, 14, finalY);
  doc.text(`Total dépenses : ${formatAmount(totalDep)}`, 14, finalY + 6);
  doc.text(`Solde net : ${formatAmount(totalRec - totalDep)}`, 14, finalY + 12);

  doc.save(`journal-caisse-${titre.replace(/\s+/g, "-")}.pdf`);
}

// ============ JOURNAL DE CAISSE EXCEL ============
export function exportJournalExcel(lignes: JournalLigne[], titre: string) {
  const wb = XLSX.utils.book_new();
  const data = [
    ["Date", "Solde ouverture", "Total recettes", "Total dépenses", "Solde clôture", "Statut"],
    ...lignes.map((l) => [
      l.date_journal,
      Number(l.solde_ouverture),
      Number(l.total_recettes),
      Number(l.total_depenses),
      Number(l.solde_cloture),
      l.statut,
    ]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), "Journal");
  XLSX.writeFile(wb, `journal-caisse-${titre.replace(/\s+/g, "-")}.xlsx`);
}
