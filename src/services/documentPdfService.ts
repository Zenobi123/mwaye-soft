import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatAmount } from "@/config/app";

export interface LigneDoc {
  description: string;
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export interface DocumentPDFData {
  type: "DEVIS" | "FACTURE";
  numero: string;
  date: string;
  date_echeance_validite?: string | null;
  client_nom: string;
  client_adresse?: string | null;
  client_telephone?: string | null;
  client_email?: string | null;
  lignes: LigneDoc[];
  montant_total: number;
  tva_rate?: number;
  notes?: string | null;
  statut?: string;
  mode_paiement?: string | null;
  date_paiement?: string | null;
}

function fmtDate(d?: string | null) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
}

export function exportDocumentPDF(doc_data: DocumentPDFData) {
  const pdf = new jsPDF();
  const isFacture = doc_data.type === "FACTURE";

  // En-tête société
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("MWAYE HOUSE", 14, 20);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120);
  pdf.text("Complexe résidentiel et commercial — Cameroun", 14, 26);
  pdf.setTextColor(0);

  // Titre + numéro
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(doc_data.type, 196, 22, { align: "right" });
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`N° ${doc_data.numero}`, 196, 29, { align: "right" });
  pdf.text(`Date : ${fmtDate(doc_data.date)}`, 196, 34, { align: "right" });
  if (doc_data.date_echeance_validite) {
    pdf.text(
      `${isFacture ? "Échéance" : "Valable jusqu'au"} : ${fmtDate(doc_data.date_echeance_validite)}`,
      196, 39, { align: "right" }
    );
  }

  // Encadré client
  pdf.setDrawColor(200);
  pdf.rect(14, 50, 182, 26);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("FACTURÉ À", 18, 57);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(doc_data.client_nom, 18, 64);
  pdf.setFontSize(9);
  pdf.setTextColor(100);
  let yc = 70;
  if (doc_data.client_adresse) { pdf.text(doc_data.client_adresse, 18, yc); yc += 4; }
  const contact = [doc_data.client_telephone, doc_data.client_email].filter(Boolean).join(" • ");
  if (contact) pdf.text(contact, 18, yc);
  pdf.setTextColor(0);

  // Tableau lignes
  autoTable(pdf, {
    startY: 84,
    head: [["Description", "Qté", "P.U.", "Montant"]],
    body: doc_data.lignes.map((l) => [
      l.description,
      l.quantite.toString(),
      formatAmount(l.prix_unitaire),
      formatAmount(l.montant),
    ]),
    headStyles: { fillColor: [180, 140, 60], textColor: 255 },
    columnStyles: {
      1: { halign: "right", cellWidth: 18 },
      2: { halign: "right", cellWidth: 35 },
      3: { halign: "right", cellWidth: 38 },
    },
    margin: { left: 14, right: 14 },
  });

  // Totaux
  const finalY = (pdf as any).lastAutoTable.finalY + 6;
  const ht = doc_data.montant_total;
  const tvaRate = doc_data.tva_rate ?? 0;
  const tva = Math.round(ht * tvaRate / 100);
  const ttc = ht + tva;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Total HT :", 140, finalY);
  pdf.text(formatAmount(ht), 196, finalY, { align: "right" });
  if (tvaRate > 0) {
    pdf.text(`TVA (${tvaRate}%) :`, 140, finalY + 6);
    pdf.text(formatAmount(tva), 196, finalY + 6, { align: "right" });
  }
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("TOTAL TTC :", 140, finalY + (tvaRate > 0 ? 14 : 8));
  pdf.text(formatAmount(ttc), 196, finalY + (tvaRate > 0 ? 14 : 8), { align: "right" });

  // Statut paiement (facture)
  let yInfo = finalY + (tvaRate > 0 ? 26 : 20);
  if (isFacture && doc_data.statut) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const statutLabel = doc_data.statut === "payee" ? "PAYÉE" :
                        doc_data.statut === "en_retard" ? "EN RETARD" :
                        doc_data.statut === "emise" ? "À PAYER" :
                        doc_data.statut.toUpperCase();
    const color: [number, number, number] = doc_data.statut === "payee" ? [22, 163, 74] :
                                             doc_data.statut === "en_retard" ? [220, 80, 50] : [180, 140, 60];
    pdf.setTextColor(...color);
    pdf.text(`Statut : ${statutLabel}`, 14, yInfo);
    pdf.setTextColor(0);
    if (doc_data.statut === "payee" && doc_data.date_paiement) {
      pdf.setFont("helvetica", "normal");
      pdf.text(`Payée le ${fmtDate(doc_data.date_paiement)}${doc_data.mode_paiement ? ` par ${doc_data.mode_paiement}` : ""}`, 14, yInfo + 6);
    }
    yInfo += 14;
  }

  // Notes
  if (doc_data.notes) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Notes :", 14, yInfo);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(doc_data.notes, 180);
    pdf.text(lines, 14, yInfo + 5);
  }

  // Mentions légales / pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(120);
  if (isFacture) {
    pdf.text(
      "TVA non applicable selon régime en vigueur — Pénalité de retard : taux légal en cas de non-paiement à échéance.",
      105, 278, { align: "center" }
    );
  } else {
    pdf.text(
      "Devis valable selon la date indiquée — Acceptation requise pour conversion en facture.",
      105, 278, { align: "center" }
    );
  }
  pdf.text("MWAYE HOUSE — Document généré automatiquement", 105, 285, { align: "center" });

  pdf.save(`${doc_data.type.toLowerCase()}_${doc_data.numero}.pdf`);
}
