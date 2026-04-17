import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

const CATEGORIES = ["Sport", "Événement", "Appartement", "Hammam", "Autre"] as const;
const MODES = ["Espèces", "Virement", "Chèque", "Mobile Money", "Carte"] as const;

interface RecetteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function RecetteForm({ onClose, onSuccess }: RecetteFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Non connecté"); setLoading(false); return; }

    const { error: insertError } = await supabase.from("recettes").insert({
      user_id: user.id,
      libelle: form.get("libelle") as string,
      montant: parseFloat(form.get("montant") as string),
      categorie: form.get("categorie") as string,
      mode_paiement: form.get("mode_paiement") as string,
      reference: (form.get("reference") as string) || null,
      notes: (form.get("notes") as string) || null,
      date_recette: form.get("date_recette") as string,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Nouvelle recette</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mb-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="libelle">Libellé *</Label>
            <Input id="libelle" name="libelle" required placeholder="Abonnement salle - Client X" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="montant">Montant (F CFA) *</Label>
              <Input id="montant" name="montant" type="number" min="1" step="1" required placeholder="50000" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="date_recette">Date *</Label>
              <Input id="date_recette" name="date_recette" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="categorie">Catégorie *</Label>
              <select id="categorie" name="categorie" required className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="mode_paiement">Mode de paiement</Label>
              <select id="mode_paiement" name="mode_paiement" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="reference">Référence</Label>
            <Input id="reference" name="reference" placeholder="N° facture, reçu..." />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" placeholder="Remarques..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
