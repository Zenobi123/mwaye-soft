import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatAmount } from "@/config/app";

export interface QuittancePDFData {
  numero: string;
  mois_concerne: string;
  date_echeance: string;
  loyer_base: number;
  penalite: number;
  montant_total: number;
  statut: string;
  date_paiement?: string | null;
  mode_paiement?: string | null;
  locataire: string;
  appartement_numero: string;
  appartement_type: string;
}

function formatMois(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR");
}

export function exportQuittancePDF(q: QuittancePDFData) {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("MWAYE HOUSE", 14, 20);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Complexe résidentiel et commercial — Cameroun", 14, 26);
  doc.setTextColor(0);

  // Numéro & date
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("QUITTANCE DE LOYER", 14, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N° ${q.numero}`, 14, 49);
  doc.text(`Émise le ${new Date().toLocaleDateString("fr-FR")}`, 196, 49, { align: "right" });

  // Encadré locataire
  doc.setDrawColor(200);
  doc.rect(14, 56, 182, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Locataire :", 18, 64);
  doc.setFont("helvetica", "normal");
  doc.text(q.locataire, 50, 64);
  doc.setFont("helvetica", "bold");
  doc.text("Bien loué :", 18, 72);
  doc.setFont("helvetica", "normal");
  doc.text(`Appartement ${q.appartement_numero} (${q.appartement_type})`, 50, 72);
  doc.setFont("helvetica", "bold");
  doc.text("Période :", 18, 80);
  doc.setFont("helvetica", "normal");
  doc.text(formatMois(q.mois_concerne), 50, 80);

  // Détail des montants
  autoTable(doc, {
    startY: 92,
    head: [["Désignation", "Montant"]],
    body: [
      ["Loyer mensuel", formatAmount(q.loyer_base)],
      ...(q.penalite > 0 ? [[`Pénalité de retard`, formatAmount(q.penalite)]] : []),
      [{ content: "TOTAL DÛ", styles: { fontStyle: "bold" } }, { content: formatAmount(q.montant_total), styles: { fontStyle: "bold" } }],
    ],
    headStyles: { fillColor: [180, 140, 60], textColor: 255 },
    columnStyles: { 1: { halign: "right" } },
    margin: { left: 14, right: 14 },
  });

  // Statut & paiement
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Statut :", 14, finalY);
  doc.setFont("helvetica", "normal");
  const statutLabel = q.statut === "payée" ? "PAYÉ" : q.statut === "partielle" ? "PARTIEL" : "IMPAYÉ";
  doc.setTextColor(q.statut === "payée" ? 22 : 200, q.statut === "payée" ? 163 : 80, q.statut === "payée" ? 74 : 50);
  doc.text(statutLabel, 35, finalY);
  doc.setTextColor(0);

  if (q.statut === "payée" && q.date_paiement) {
    doc.text(`Payé le ${formatDate(q.date_paiement)}${q.mode_paiement ? ` par ${q.mode_paiement}` : ""}`, 14, finalY + 7);
  } else {
    doc.text(`Date d'échéance : ${formatDate(q.date_echeance)}`, 14, finalY + 7);
  }

  // Pied de page
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    "Quittance générée automatiquement par le système MWAYE HOUSE — vaut reçu officiel.",
    105, 285, { align: "center" },
  );

  // Zone signature
  doc.setDrawColor(180);
  doc.line(130, 250, 196, 250);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text("Signature & cachet", 163, 256, { align: "center" });

  doc.save(`quittance_${q.numero}.pdf`);
}
