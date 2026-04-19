-- Table des bilans mensuels figés
CREATE TABLE public.bilans_mensuels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mois DATE NOT NULL UNIQUE,
  total_recettes NUMERIC NOT NULL DEFAULT 0,
  total_depenses NUMERIC NOT NULL DEFAULT 0,
  benefice NUMERIC NOT NULL DEFAULT 0,
  marge_nette NUMERIC NOT NULL DEFAULT 0,
  nb_recettes INTEGER NOT NULL DEFAULT 0,
  nb_depenses INTEGER NOT NULL DEFAULT 0,
  detail_recettes JSONB NOT NULL DEFAULT '{}'::jsonb,
  detail_depenses JSONB NOT NULL DEFAULT '{}'::jsonb,
  statut TEXT NOT NULL DEFAULT 'auto',
  genere_par UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bilans_mensuels_mois ON public.bilans_mensuels(mois DESC);

ALTER TABLE public.bilans_mensuels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view bilans"
  ON public.bilans_mensuels FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin/comptable can insert bilans"
  ON public.bilans_mensuels FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'comptable'::app_role));

CREATE POLICY "Admin/comptable can update bilans"
  ON public.bilans_mensuels FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'comptable'::app_role));

CREATE POLICY "Admins can delete bilans"
  ON public.bilans_mensuels FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_bilans_mensuels_updated
  BEFORE UPDATE ON public.bilans_mensuels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extensions journal_caisse
ALTER TABLE public.journal_caisse
  ADD COLUMN IF NOT EXISTS date_cloture TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cloture_par UUID,
  ADD COLUMN IF NOT EXISTS cloture_auto BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_caisse_date_unique
  ON public.journal_caisse(date_journal);

CREATE INDEX IF NOT EXISTS idx_recettes_date ON public.recettes(date_recette DESC);
CREATE INDEX IF NOT EXISTS idx_depenses_date ON public.depenses(date_depense DESC);

-- Fonction de clôture journalière
CREATE OR REPLACE FUNCTION public.cloturer_journal_jour(p_date DATE)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_rec NUMERIC := 0;
  v_total_dep NUMERIC := 0;
  v_solde_prev NUMERIC := 0;
  v_id UUID;
BEGIN
  SELECT COALESCE(SUM(montant), 0) INTO v_total_rec
  FROM public.recettes WHERE date_recette = p_date;

  SELECT COALESCE(SUM(montant), 0) INTO v_total_dep
  FROM public.depenses WHERE date_depense = p_date;

  SELECT COALESCE(solde_cloture, 0) INTO v_solde_prev
  FROM public.journal_caisse
  WHERE date_journal < p_date
  ORDER BY date_journal DESC LIMIT 1;

  INSERT INTO public.journal_caisse(
    date_journal, solde_ouverture, total_recettes, total_depenses,
    solde_cloture, statut, date_cloture, cloture_auto, user_id
  )
  VALUES (
    p_date, v_solde_prev, v_total_rec, v_total_dep,
    v_solde_prev + v_total_rec - v_total_dep,
    'clôturé', now(), true, auth.uid()
  )
  ON CONFLICT (date_journal) DO UPDATE SET
    total_recettes = EXCLUDED.total_recettes,
    total_depenses = EXCLUDED.total_depenses,
    solde_ouverture = EXCLUDED.solde_ouverture,
    solde_cloture = EXCLUDED.solde_cloture,
    statut = 'clôturé',
    date_cloture = now(),
    cloture_auto = true,
    updated_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Fonction de calcul du bilan mensuel
CREATE OR REPLACE FUNCTION public.calculer_bilan_mensuel(p_mois DATE)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_debut DATE := date_trunc('month', p_mois)::date;
  v_fin DATE := (date_trunc('month', p_mois) + interval '1 month - 1 day')::date;
  v_total_rec NUMERIC := 0;
  v_total_dep NUMERIC := 0;
  v_nb_rec INTEGER := 0;
  v_nb_dep INTEGER := 0;
  v_detail_rec JSONB := '{}'::jsonb;
  v_detail_dep JSONB := '{}'::jsonb;
  v_benefice NUMERIC;
  v_marge NUMERIC;
  v_id UUID;
BEGIN
  SELECT COALESCE(SUM(montant), 0), COUNT(*),
         COALESCE(jsonb_object_agg(categorie, montant_cat), '{}'::jsonb)
  INTO v_total_rec, v_nb_rec, v_detail_rec
  FROM (
    SELECT categorie, SUM(montant) AS montant_cat, SUM(montant) AS montant
    FROM public.recettes
    WHERE date_recette BETWEEN v_debut AND v_fin
    GROUP BY categorie
  ) t;

  SELECT COALESCE(SUM(montant), 0), COUNT(*),
         COALESCE(jsonb_object_agg(categorie, montant_cat), '{}'::jsonb)
  INTO v_total_dep, v_nb_dep, v_detail_dep
  FROM (
    SELECT categorie, SUM(montant) AS montant_cat, SUM(montant) AS montant
    FROM public.depenses
    WHERE date_depense BETWEEN v_debut AND v_fin
    GROUP BY categorie
  ) t;

  v_benefice := v_total_rec - v_total_dep;
  v_marge := CASE WHEN v_total_rec > 0 THEN ROUND((v_benefice / v_total_rec) * 100, 2) ELSE 0 END;

  INSERT INTO public.bilans_mensuels(
    mois, total_recettes, total_depenses, benefice, marge_nette,
    nb_recettes, nb_depenses, detail_recettes, detail_depenses,
    statut, genere_par
  )
  VALUES (
    v_debut, v_total_rec, v_total_dep, v_benefice, v_marge,
    v_nb_rec, v_nb_dep, v_detail_rec, v_detail_dep, 'auto', auth.uid()
  )
  ON CONFLICT (mois) DO UPDATE SET
    total_recettes = EXCLUDED.total_recettes,
    total_depenses = EXCLUDED.total_depenses,
    benefice = EXCLUDED.benefice,
    marge_nette = EXCLUDED.marge_nette,
    nb_recettes = EXCLUDED.nb_recettes,
    nb_depenses = EXCLUDED.nb_depenses,
    detail_recettes = EXCLUDED.detail_recettes,
    detail_depenses = EXCLUDED.detail_depenses,
    updated_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;