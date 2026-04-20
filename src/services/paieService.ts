import jsPDF from "jspdf";
import { formatAmount } from "@/config/app";

interface BulletinData {
  numero: string;
  mois: string;
  employe_nom: string;
  employe_poste?: string | null;
  salaire_brut: number;
  prime: number;
  heures_sup: number;
  cnps_employe: number;
  cnps_employeur: number;
  irpp: number;
  autres_retenues: number;
  salaire_net: number;
  cout_total_employeur: number;
}

export function genererBulletinPDF(b: BulletinData): jsPDF {
  const doc = new jsPDF();
  const moisLabel = new Date(b.mois).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // En-tête
  doc.setFontSize(18); doc.setFont("helvetica", "bold");
  doc.text("MWAYE HOUSE", 14, 18);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text("Bulletin de paie", 14, 25);

  doc.setFontSize(10);
  doc.text(`N° ${b.numero}`, 196, 18, { align: "right" });
  doc.text(`Période : ${moisLabel}`, 196, 25, { align: "right" });

  doc.setLineWidth(0.5); doc.line(14, 30, 196, 30);

  // Employé
  doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("Employé", 14, 40);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(`Nom : ${b.employe_nom}`, 14, 47);
  if (b.employe_poste) doc.text(`Poste : ${b.employe_poste}`, 14, 53);

  // Détail
  let y = 70;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("Détail de la rémunération", 14, y); y += 8;

  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  const ligne = (label: string, value: number, bold = false) => {
    if (bold) doc.setFont("helvetica", "bold");
    doc.text(label, 14, y);
    doc.text(formatAmount(value), 196, y, { align: "right" });
    if (bold) doc.setFont("helvetica", "normal");
    y += 7;
  };

  ligne("Salaire brut", b.salaire_brut);
  if (b.prime) ligne("Prime", b.prime);
  if (b.heures_sup) ligne("Heures supplémentaires", b.heures_sup);
  doc.line(14, y - 2, 196, y - 2); y += 3;

  doc.setTextColor(180, 0, 0);
  ligne("CNPS employé (4,2%)", -b.cnps_employe);
  ligne("IRPP", -b.irpp);
  if (b.autres_retenues) ligne("Autres retenues", -b.autres_retenues);
  doc.setTextColor(0, 0, 0);
  doc.line(14, y - 2, 196, y - 2); y += 3;

  ligne("SALAIRE NET À PAYER", b.salaire_net, true);

  // Charges patronales
  y += 10;
  doc.setFont("helvetica", "bold"); doc.text("Charges patronales", 14, y); y += 7;
  doc.setFont("helvetica", "normal");
  ligne("CNPS employeur (11,2%)", b.cnps_employeur);
  ligne("Coût total employeur", b.cout_total_employeur, true);

  // Pied
  y = 270;
  doc.setFontSize(8); doc.setTextColor(120, 120, 120);
  doc.text("MWAYE HOUSE — Bulletin généré automatiquement", 105, y, { align: "center" });
  doc.text(new Date().toLocaleString("fr-FR"), 105, y + 4, { align: "center" });

  return doc;
}

export function telechargerBulletin(b: BulletinData) {
  const doc = genererBulletinPDF(b);
  doc.save(`Bulletin_${b.numero}_${b.employe_nom.replace(/\s+/g, "_")}.pdf`);
}
