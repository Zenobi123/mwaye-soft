import { useState, useEffect } from "react";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

export function SettingsForm() {
  const { settings, loading, updateSettings } = useAppSettings();
  const { isAdmin } = useUserRoles();
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(settings), [settings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const update = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await updateSettings({
      complex_name: draft.complex_name,
      currency: draft.currency,
      locale: draft.locale,
      tva_rate: Number(draft.tva_rate),
      late_fee_rate: Number(draft.late_fee_rate),
      default_sport_price: Number(draft.default_sport_price),
      default_hammam_price: Number(draft.default_hammam_price),
      default_event_hall_price: Number(draft.default_event_hall_price),
      cnps_employee_rate: Number(draft.cnps_employee_rate),
      cnps_employer_rate: Number(draft.cnps_employer_rate),
      notification_email: draft.notification_email,
      // Identité fiscale
      niu: draft.niu,
      rccm: draft.rccm,
      adresse: draft.adresse,
      telephone: draft.telephone,
      email_societe: draft.email_societe,
      regime_fiscal: draft.regime_fiscal,
      // Cotisations Cameroun
      secteur_at: draft.secteur_at,
      taux_at: Number(draft.taux_at),
      taux_cfc_emp: Number(draft.taux_cfc_emp),
      taux_cfc_pat: Number(draft.taux_cfc_pat),
      taux_fne: Number(draft.taux_fne),
      plafond_cnps: Number(draft.plafond_cnps),
    });
    setSaving(false);
  };

  const disabled = !isAdmin;

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Identité du complexe</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom du complexe">
            <Input value={draft.complex_name} disabled={disabled} onChange={(e) => update("complex_name", e.target.value)} />
          </Field>
          <Field label="Email de notification">
            <Input
              type="email"
              value={draft.notification_email ?? ""}
              disabled={disabled}
              onChange={(e) => update("notification_email", e.target.value || null)}
            />
          </Field>
          <Field label="Devise">
            <Input value={draft.currency} disabled={disabled} onChange={(e) => update("currency", e.target.value)} />
          </Field>
          <Field label="Locale">
            <Input value={draft.locale} disabled={disabled} onChange={(e) => update("locale", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Identité fiscale (mentions obligatoires factures — Cameroun / OHADA)
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="NIU (Numéro d'Identifiant Unique DGI) *">
            <Input
              value={draft.niu ?? ""}
              disabled={disabled}
              placeholder="P012345678901A"
              onChange={(e) => update("niu", e.target.value || null)}
            />
          </Field>
          <Field label="RCCM (Registre du Commerce) *">
            <Input
              value={draft.rccm ?? ""}
              disabled={disabled}
              placeholder="RC/DLA/2026/B/12345"
              onChange={(e) => update("rccm", e.target.value || null)}
            />
          </Field>
          <Field label="Adresse complète du siège *">
            <Input
              value={draft.adresse ?? ""}
              disabled={disabled}
              placeholder="BP 1234, Quartier Bonapriso, Douala"
              onChange={(e) => update("adresse", e.target.value || null)}
            />
          </Field>
          <Field label="Téléphone">
            <Input
              value={draft.telephone ?? ""}
              disabled={disabled}
              placeholder="+237 6XX XX XX XX"
              onChange={(e) => update("telephone", e.target.value || null)}
            />
          </Field>
          <Field label="Email société">
            <Input
              type="email"
              value={draft.email_societe ?? ""}
              disabled={disabled}
              placeholder="contact@mwayehouse.cm"
              onChange={(e) => update("email_societe", e.target.value || null)}
            />
          </Field>
          <Field label="Régime fiscal">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={draft.regime_fiscal}
              disabled={disabled}
              onChange={(e) => update("regime_fiscal", e.target.value)}
            >
              <option value="reel">Réel</option>
              <option value="simplifie">Simplifié</option>
              <option value="non_assujetti">Non assujetti TVA</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Paramètres financiers</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="TVA (%)">
            <Input type="number" step="0.01" value={draft.tva_rate} disabled={disabled} onChange={(e) => update("tva_rate", Number(e.target.value))} />
          </Field>
          <Field label="Pénalité retard loyer (% / mois)">
            <Input type="number" step="0.01" value={draft.late_fee_rate} disabled={disabled} onChange={(e) => update("late_fee_rate", Number(e.target.value))} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Cotisations sociales et fiscales (Cameroun)
        </h3>
        <p className="text-xs text-muted-foreground">
          IRPP (barème progressif), RAV et TDL sont calculés automatiquement selon les barèmes
          officiels DGI Cameroun. Ne pas modifier sauf changement réglementaire.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="CNPS PVID — salarié (%)">
            <Input type="number" step="0.01" value={draft.cnps_employee_rate} disabled={disabled} onChange={(e) => update("cnps_employee_rate", Number(e.target.value))} />
          </Field>
          <Field label="CNPS — employeur global (%)">
            <Input type="number" step="0.01" value={draft.cnps_employer_rate} disabled={disabled} onChange={(e) => update("cnps_employer_rate", Number(e.target.value))} />
          </Field>
          <Field label="Plafond CNPS mensuel (FCFA)">
            <Input type="number" value={draft.plafond_cnps} disabled={disabled} onChange={(e) => update("plafond_cnps", Number(e.target.value))} />
          </Field>
          <Field label="Secteur Accidents du Travail">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={draft.secteur_at}
              disabled={disabled}
              onChange={(e) => update("secteur_at", e.target.value)}
            >
              <option value="A">A — Risque faible (1,75 %)</option>
              <option value="B">B — Risque moyen (2,5 %)</option>
              <option value="C">C — Risque élevé (5 %)</option>
            </select>
          </Field>
          <Field label="Taux AT appliqué (%)">
            <Input type="number" step="0.01" value={draft.taux_at} disabled={disabled} onChange={(e) => update("taux_at", Number(e.target.value))} />
          </Field>
          <Field label="CFC — salarié (%)">
            <Input type="number" step="0.01" value={draft.taux_cfc_emp} disabled={disabled} onChange={(e) => update("taux_cfc_emp", Number(e.target.value))} />
          </Field>
          <Field label="CFC — employeur (%)">
            <Input type="number" step="0.01" value={draft.taux_cfc_pat} disabled={disabled} onChange={(e) => update("taux_cfc_pat", Number(e.target.value))} />
          </Field>
          <Field label="FNE — employeur (%)">
            <Input type="number" step="0.01" value={draft.taux_fne} disabled={disabled} onChange={(e) => update("taux_fne", Number(e.target.value))} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Tarifs par défaut</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Abonnement sport (FCFA)">
            <Input type="number" value={draft.default_sport_price} disabled={disabled} onChange={(e) => update("default_sport_price", Number(e.target.value))} />
          </Field>
          <Field label="Entrée hammam (FCFA)">
            <Input type="number" value={draft.default_hammam_price} disabled={disabled} onChange={(e) => update("default_hammam_price", Number(e.target.value))} />
          </Field>
          <Field label="Salle de fête / jour (FCFA)">
            <Input type="number" value={draft.default_event_hall_price} disabled={disabled} onChange={(e) => update("default_event_hall_price", Number(e.target.value))} />
          </Field>
        </div>
      </section>

      {isAdmin ? (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-right">
          Seuls les administrateurs peuvent modifier les paramètres.
        </p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
