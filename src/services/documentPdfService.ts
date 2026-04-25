import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatAmount } from "@/config/app";

export interface LigneDoc {
  description: string;
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export interface SocieteIdentite {
  nom: string;
  niu?: string | null;
  rccm?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  regime_fiscal?: string;
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
  client_niu?: string | null;
  lignes: LigneDoc[];
  montant_total: number;
  tva_rate?: number;
  notes?: string | null;
  statut?: string;
  mode_paiement?: string | null;
  date_paiement?: string | null;
  societe: SocieteIdentite;
}

function fmtDate(d?: string | null) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
}

export function exportDocumentPDF(doc_data: DocumentPDFData) {
  const pdf = new jsPDF();
  const isFacture = doc_data.type === "FACTURE";
  const s = doc_data.societe;
  const tvaRate = doc_data.tva_rate ?? 0;
  const tvaApplicable = tvaRate > 0;
  const regime = s.regime_fiscal ?? "reel";

  // ========== En-tête société ==========
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(s.nom, 14, 18);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100);
  let y = 23;
  if (s.adresse)   { pdf.text(s.adresse, 14, y);   y += 4; }
  const contactSoc = [s.telephone, s.email].filter(Boolean).join(" — ");
  if (contactSoc)  { pdf.text(contactSoc, 14, y);  y += 4; }
  const ids = [
    s.niu  ? `NIU : ${s.niu}`   : null,
    s.rccm ? `RCCM : ${s.rccm}` : null,
  ].filter(Boolean).join(" — ");
  if (ids)         { pdf.text(ids, 14, y);         y += 4; }
  pdf.setTextColor(0);

  // ========== Titre + numéro ==========
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

  // ========== Encadré client ==========
  const yClient = Math.max(y, 44) + 4;
  pdf.setDrawColor(200);
  pdf.rect(14, yClient, 182, 32);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("FACTURÉ À", 18, yClient + 6);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(doc_data.client_nom, 18, yClient + 13);
  pdf.setFontSize(9);
  pdf.setTextColor(100);
  let yc = yClient + 19;
  if (doc_data.client_adresse) { pdf.text(doc_data.client_adresse, 18, yc); yc += 4; }
  const contactCli = [doc_data.client_telephone, doc_data.client_email].filter(Boolean).join(" — ");
  if (contactCli) { pdf.text(contactCli, 18, yc); yc += 4; }
  if (doc_data.client_niu) { pdf.text(`NIU client : ${doc_data.client_niu}`, 18, yc); }
  pdf.setTextColor(0);

  // ========== Tableau lignes ==========
  autoTable(pdf, {
    startY: yClient + 38,
    head: [["Description", "Qté", "P.U.", "Montant HT"]],
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
    styles: { fontSize: 9 },
  });

  // ========== Totaux ==========
  const finalY = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  const ht = doc_data.montant_total;
  const tva = Math.round((ht * tvaRate) / 100);
  const ttc = ht + tva;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Total HT :", 140, finalY);
  pdf.text(formatAmount(ht), 196, finalY, { align: "right" });
  if (tvaApplicable) {
    pdf.text(`TVA (${tvaRate}%) :`, 140, finalY + 6);
    pdf.text(formatAmount(tva), 196, finalY + 6, { align: "right" });
  }
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("TOTAL TTC :", 140, finalY + (tvaApplicable ? 14 : 8));
  pdf.text(formatAmount(ttc), 196, finalY + (tvaApplicable ? 14 : 8), { align: "right" });

  // ========== Statut paiement ==========
  let yInfo = finalY + (tvaApplicable ? 26 : 20);
  if (isFacture && doc_data.statut) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const statutLabel = doc_data.statut === "payee" ? "PAYÉE" :
                        doc_data.statut === "en_retard" ? "EN RETARD" :
                        doc_data.statut === "emise" ? "À PAYER" :
                        doc_data.statut.toUpperCase();
    const color: [number, number, number] = doc_data.statut === "payee" ? [22, 163, 74] :
                                             doc_data.statut === "en_retard" ? [220, 80, 50] : [180, 140, 60];
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.text(`Statut : ${statutLabel}`, 14, yInfo);
    pdf.setTextColor(0);
    if (doc_data.statut === "payee" && doc_data.date_paiement) {
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Payée le ${fmtDate(doc_data.date_paiement)}${doc_data.mode_paiement ? ` par ${doc_data.mode_paiement}` : ""}`,
        14, yInfo + 6,
      );
    }
    yInfo += 14;
  }

  // ========== Notes ==========
  if (doc_data.notes) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Notes :", 14, yInfo);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(doc_data.notes, 180);
    pdf.text(lines, 14, yInfo + 5);
    yInfo += 5 + (lines.length as number) * 4;
  }

  // ========== Mentions légales ==========
  pdf.setFontSize(8);
  pdf.setTextColor(120);
  const yMentions = 270;

  if (isFacture) {
    if (regime === "non_assujetti") {
      pdf.text("TVA non applicable — art. 128 du CGI Cameroun.", 105, yMentions, { align: "center" });
    } else if (tvaApplicable) {
      pdf.text(
        "TVA appliquée conformément aux articles 125 et s. du CGI Cameroun.",
        105, yMentions, { align: "center" },
      );
    }
    pdf.text(
      "Pénalité de retard : 1 % par mois (CGI art. L96). Escompte pour paiement anticipé : néant.",
      105, yMentions + 5, { align: "center" },
    );
  } else {
    pdf.text(
      "Devis valable jusqu'à la date indiquée — Acceptation requise pour conversion en facture.",
      105, yMentions, { align: "center" },
    );
    pdf.text(
      "Document non engageant tant qu'il n'est pas accepté et signé par le client.",
      105, yMentions + 5, { align: "center" },
    );
  }
  pdf.text(`${s.nom} — Document généré le ${new Date().toLocaleString("fr-FR")}`, 105, yMentions + 12, { align: "center" });

  pdf.save(`${doc_data.type.toLowerCase()}_${doc_data.numero}.pdf`);
}
