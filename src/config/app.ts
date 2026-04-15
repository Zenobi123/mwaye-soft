export const APP_NAME = "MWAYE HOUSE";
export const APP_SUBTITLE = "Gestion commerciale";
export const CURRENCY = "FCFA";
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
  accepté: "bg-success/10 text-success",
  refusé: "bg-destructive/10 text-destructive",
  payée: "bg-success/10 text-success",
  "en retard": "bg-destructive/10 text-destructive",
  annulée: "bg-destructive/10 text-destructive",
};
