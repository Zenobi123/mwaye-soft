import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatAmount } from "@/config/app";

export interface BulletinData {
  numero: string;
  mois: string;
  // Employé
  employe_nom: string;
  employe_poste?: string | null;
  employe_matricule_cnps?: string | null;
  employe_niu?: string | null;
  employe_date_embauche?: string | null;
  // Période travaillée
  jours_travailles?: number | null;
  heures_normales?: number | null;
  // Rémunération
  salaire_brut: number;
  prime: number;
  heures_sup: number;
  // Cotisations / impôts (Cameroun complet)
  cnps_employe: number;
  cfc_employe: number;
  irpp: number;
  rav: number;
  tdl: number;
  autres_retenues: number;
  salaire_net: number;
  // Charges patronales
  cnps_employeur: number;
  accidents_travail: number;
  cfc_employeur: number;
  fne_employeur: number;
  cout_total_employeur: number;
  // Identité société
  societe_nom: string;
  societe_niu?: string | null;
  societe_rccm?: string | null;
  societe_adresse?: string | null;
  societe_telephone?: string | null;
}

function fmtMois(d: string): string {
  return new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

function fmtDate(d?: string | null): string {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
}

export function genererBulletinPDF(b: BulletinData): jsPDF {
  const doc = new jsPDF();
  const moisLabel = fmtMois(b.mois);

  // ========== En-tête société ==========
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(b.societe_nom, 14, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  let y = 23;
  if (b.societe_adresse) { doc.text(b.societe_adresse, 14, y); y += 4; }
  const ligneIds = [
    b.societe_niu ? `NIU : ${b.societe_niu}` : null,
    b.societe_rccm ? `RCCM : ${b.societe_rccm}` : null,
    b.societe_telephone ? `Tél : ${b.societe_telephone}` : null,
  ].filter(Boolean).join(" — ");
  if (ligneIds) { doc.text(ligneIds, 14, y); y += 4; }
  doc.setTextColor(0);

  // Titre
  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text("BULLETIN DE PAIE", 196, 18, { align: "right" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(`N° ${b.numero}`, 196, 24, { align: "right" });
  doc.text(`Période : ${moisLabel}`, 196, 29, { align: "right" });

  doc.setLineWidth(0.3); doc.line(14, 36, 196, 36);

  // ========== Employé ==========
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("Employé", 14, 43);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  let yE = 48;
  doc.text(`Nom : ${b.employe_nom}`, 14, yE); yE += 4;
  if (b.employe_poste)        { doc.text(`Poste : ${b.employe_poste}`, 14, yE); yE += 4; }
  if (b.employe_matricule_cnps) { doc.text(`Matricule CNPS : ${b.employe_matricule_cnps}`, 14, yE); yE += 4; }
  if (b.employe_niu)            { doc.text(`NIU : ${b.employe_niu}`, 14, yE); yE += 4; }
  if (b.employe_date_embauche)  { doc.text(`Date d'embauche : ${fmtDate(b.employe_date_embauche)}`, 14, yE); yE += 4; }

  // Période travaillée à droite
  doc.setFont("helvetica", "bold"); doc.text("Période", 130, 43);
  doc.setFont("helvetica", "normal");
  let yP = 48;
  doc.text(`Jours travaillés : ${b.jours_travailles ?? 30}`, 130, yP); yP += 4;
  doc.text(`Heures normales : ${(b.heures_normales ?? 173.33).toFixed(2)}`, 130, yP); yP += 4;
  if (b.heures_sup > 0) { doc.text(`Heures supp. : ${b.heures_sup}`, 130, yP); yP += 4; }

  const yStart = Math.max(yE, yP) + 4;

  // ========== Tableau gains ==========
  const gainsRows: [string, string][] = [
    ["Salaire de base (brut)", formatAmount(b.salaire_brut)],
  ];
  if (b.prime > 0)      gainsRows.push(["Prime", formatAmount(b.prime)]);
  if (b.heures_sup > 0) gainsRows.push(["Heures supplémentaires", formatAmount(b.heures_sup)]);
  const totalGains = b.salaire_brut + b.prime + b.heures_sup;
  gainsRows.push(["TOTAL BRUT", formatAmount(totalGains)]);

  autoTable(doc, {
    startY: yStart,
    head: [["Gains", "Montant"]],
    body: gainsRows,
    headStyles: { fillColor: [60, 140, 80], textColor: 255 },
    columnStyles: { 1: { halign: "right", cellWidth: 50 } },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
    didParseCell: (data) => {
      if (data.row.index === gainsRows.length - 1 && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
  });

  // ========== Tableau retenues salariales ==========
  const retenuesRows: [string, string, string][] = [
    ["CNPS (PVID)", "4,2 %", `-${formatAmount(b.cnps_employe)}`],
    ["CFC (Crédit Foncier)", "1 %", `-${formatAmount(b.cfc_employe)}`],
    ["IRPP (barème progressif)", "—", `-${formatAmount(b.irpp)}`],
    ["RAV (Redevance Audiovisuelle)", "barème", `-${formatAmount(b.rav)}`],
    ["TDL (Taxe Dév. Local)", "barème", `-${formatAmount(b.tdl)}`],
  ];
  if (b.autres_retenues > 0) retenuesRows.push(["Autres retenues", "—", `-${formatAmount(b.autres_retenues)}`]);
  const totalRet = b.cnps_employe + b.cfc_employe + b.irpp + b.rav + b.tdl + b.autres_retenues;
  retenuesRows.push(["TOTAL RETENUES", "", `-${formatAmount(totalRet)}`]);

  autoTable(doc, {
    head: [["Retenues salariales", "Taux", "Montant"]],
    body: retenuesRows,
    headStyles: { fillColor: [180, 60, 60], textColor: 255 },
    columnStyles: { 1: { halign: "center", cellWidth: 30 }, 2: { halign: "right", cellWidth: 50 } },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
    didParseCell: (data) => {
      if (data.row.index === retenuesRows.length - 1 && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
  });

  // ========== Net à payer ==========
  const yNet = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
  doc.setFillColor(180, 140, 60);
  doc.rect(14, yNet, 182, 10, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("NET À PAYER", 18, yNet + 7);
  doc.text(formatAmount(b.salaire_net), 192, yNet + 7, { align: "right" });
  doc.setTextColor(0);

  // ========== Charges patronales ==========
  const yCharges = yNet + 16;
  const chargesRows: [string, string, string][] = [
    ["CNPS PVID + Prestations Familiales", "11,2 %", formatAmount(b.cnps_employeur - b.accidents_travail)],
    ["CNPS Accidents du Travail", `${((b.accidents_travail / Math.max(b.salaire_brut, 1)) * 100).toFixed(2)} %`, formatAmount(b.accidents_travail)],
    ["CFC employeur", "1,5 %", formatAmount(b.cfc_employeur)],
    ["FNE", "1 %", formatAmount(b.fne_employeur)],
    ["COÛT TOTAL EMPLOYEUR", "", formatAmount(b.cout_total_employeur)],
  ];

  autoTable(doc, {
    startY: yCharges,
    head: [["Charges patronales (à titre informatif)", "Taux", "Montant"]],
    body: chargesRows,
    headStyles: { fillColor: [80, 80, 130], textColor: 255 },
    columnStyles: { 1: { halign: "center", cellWidth: 30 }, 2: { halign: "right", cellWidth: 50 } },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
    didParseCell: (data) => {
      if (data.row.index === chargesRows.length - 1 && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
  });

  // ========== Signature & pied ==========
  const ySig = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14;
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Pour acquit, le ......................", 14, ySig);
  doc.text("Signature de l'employé", 14, ySig + 12);
  doc.line(14, ySig + 14, 80, ySig + 14);
  doc.text("Cachet et signature de l'employeur", 130, ySig + 12);
  doc.line(130, ySig + 14, 196, ySig + 14);

  // Pied
  doc.setFontSize(7); doc.setTextColor(120);
  doc.text(
    "Bulletin établi conformément au Code du travail camerounais et au Code Général des Impôts en vigueur — à conserver 5 ans.",
    105, 285, { align: "center" },
  );
  doc.text(`Document généré le ${new Date().toLocaleString("fr-FR")}`, 105, 290, { align: "center" });

  return doc;
}

export function telechargerBulletin(b: BulletinData) {
  const doc = genererBulletinPDF(b);
  doc.save(`Bulletin_${b.numero}_${b.employe_nom.replace(/\s+/g, "_")}.pdf`);
}
