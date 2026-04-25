export const APP_NAME = "MWAYE HOUSE";
export const APP_SUBTITLE = "Gestion commerciale";
// Espace insécable (U+00A0) entre "F" et "CFA" pour éviter une coupure de ligne.
export const CURRENCY = "F\u00A0CFA";
export const LOCALE = "fr-FR";

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString(LOCALE)} ${CURRENCY}`;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Sport: "bg-primary/10 text-primary",
  Appartement: "bg-info/10 text-info",
  Événement: "bg-warning/10 text-warning",
  Hammam: "bg-accent/10 text-accent",
};

export const STATUS_COLORS: Record<string, string> = {
  payé: "bg-success/10 text-success",
  "en attente": "bg-warning/10 text-warning",
  annulé: "bg-destructive/10 text-destructive",
  actif: "bg-success/10 text-success",
  expiré: "bg-destructive/10 text-destructive",
  suspendu: "bg-warning/10 text-warning",
  loué: "bg-success/10 text-success",
  disponible: "bg-info/10 text-info",
  maintenance: "bg-destructive/10 text-destructive",
  réservée: "bg-warning/10 text-warning",
  confirmé: "bg-success/10 text-success",
  ouvert: "bg-success/10 text-success",
  fermé: "bg-destructive/10 text-destructive",
  active: "bg-success/10 text-success",
  fermée: "bg-destructive/10 text-destructive",
  brouillon: "bg-muted text-muted-foreground",
  envoyé: "bg-info/10 text-info",
  envoyée: "bg-info/10 text-info",
  emise: "bg-info/10 text-info",
  accepté: "bg-success/10 text-success",
  accepte: "bg-success/10 text-success",
  refusé: "bg-destructive/10 text-destructive",
  refuse: "bg-destructive/10 text-destructive",
  converti: "bg-primary/10 text-primary",
  payée: "bg-success/10 text-success",
  payee: "bg-success/10 text-success",
  partiellement_payee: "bg-warning/10 text-warning",
  "en retard": "bg-destructive/10 text-destructive",
  en_retard: "bg-destructive/10 text-destructive",
  annulée: "bg-destructive/10 text-destructive",
  annulee: "bg-destructive/10 text-destructive",
};
