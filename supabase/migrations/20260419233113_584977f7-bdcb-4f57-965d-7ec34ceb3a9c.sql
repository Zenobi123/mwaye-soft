-- 1. Séquence pour numéro de quittance
CREATE SEQUENCE IF NOT EXISTS public.quittance_seq START 1;

-- 2. Table quittances
CREATE TABLE public.quittances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL UNIQUE,
  contrat_id UUID NOT NULL REFERENCES public.contrats_bail(id) ON DELETE CASCADE,
  appartement_id UUID NOT NULL REFERENCES public.appartements(id) ON DELETE CASCADE,
  mois_concerne DATE NOT NULL,
  date_echeance DATE NOT NULL,
  loyer_base NUMERIC NOT NULL DEFAULT 0,
  penalite NUMERIC NOT NULL DEFAULT 0,
  montant_total NUMERIC NOT NULL DEFAULT 0,
  montant_paye NUMERIC NOT NULL DEFAULT 0,
  mode_paiement TEXT,
  date_paiement DATE,
  statut TEXT NOT NULL DEFAULT 'impayée',
  notes TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contrat_id, mois_concerne)
);
CREATE INDEX idx_quittances_contrat ON public.quittances(contrat_id);
CREATE INDEX idx_quittances_mois ON public.quittances(mois_concerne);
CREATE INDEX idx_quittances_statut ON public.quittances(statut);

ALTER TABLE public.quittances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view quittances" ON public.quittances FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert quittances" ON public.quittances FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin/comptable/immobilier can update quittances" ON public.quittances FOR UPDATE TO authenticated 
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'comptable') OR has_role(auth.uid(), 'resp_immobilier'));
CREATE POLICY "Admins can delete quittances" ON public.quittances FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_quittances_updated_at BEFORE UPDATE ON public.quittances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Table etats_lieux
CREATE TABLE public.etats_lieux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrat_id UUID NOT NULL REFERENCES public.contrats_bail(id) ON DELETE CASCADE,
  appartement_id UUID NOT NULL REFERENCES public.appartements(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'entrée',
  date_etat DATE NOT NULL DEFAULT CURRENT_DATE,
  etat_general TEXT NOT NULL DEFAULT 'bon',
  compteur_eau TEXT,
  compteur_elec TEXT,
  signataire TEXT,
  observations TEXT,
  pieces_detail JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_etats_contrat ON public.etats_lieux(contrat_id);

ALTER TABLE public.etats_lieux ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view etats_lieux" ON public.etats_lieux FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert etats_lieux" ON public.etats_lieux FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update etats_lieux" ON public.etats_lieux FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete etats_lieux" ON public.etats_lieux FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_etats_lieux_updated_at BEFORE UPDATE ON public.etats_lieux
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Table rappels_echeance
CREATE TABLE public.rappels_echeance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quittance_id UUID NOT NULL REFERENCES public.quittances(id) ON DELETE CASCADE,
  contrat_id UUID NOT NULL REFERENCES public.contrats_bail(id) ON DELETE CASCADE,
  niveau INTEGER NOT NULL DEFAULT 1,
  jours_retard INTEGER NOT NULL DEFAULT 0,
  envoye_le TIMESTAMPTZ,
  statut TEXT NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quittance_id, niveau)
);
CREATE INDEX idx_rappels_quittance ON public.rappels_echeance(quittance_id);
CREATE INDEX idx_rappels_statut ON public.rappels_echeance(statut);

ALTER TABLE public.rappels_echeance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view rappels" ON public.rappels_echeance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert rappels" ON public.rappels_echeance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update rappels" ON public.rappels_echeance FOR UPDATE TO authenticated 
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'resp_immobilier') OR has_role(auth.uid(), 'comptable'));

-- 5. Fonction : générer quittances mensuelles
CREATE OR REPLACE FUNCTION public.generer_quittances_mensuelles(p_mois DATE)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INTEGER := 0;
  v_debut DATE := date_trunc('month', p_mois)::date;
  v_echeance DATE := v_debut + 4;
  v_numero TEXT;
  c RECORD;
BEGIN
  FOR c IN 
    SELECT cb.id, cb.appartement_id, cb.loyer_mensuel
    FROM public.contrats_bail cb
    WHERE cb.statut = 'actif' 
      AND cb.date_debut <= v_debut + interval '1 month - 1 day'
      AND cb.date_fin >= v_debut
      AND NOT EXISTS (
        SELECT 1 FROM public.quittances q 
        WHERE q.contrat_id = cb.id AND q.mois_concerne = v_debut
      )
  LOOP
    v_numero := 'QTC-' || to_char(v_debut, 'YYYY-MM') || '-' || lpad(nextval('quittance_seq')::text, 4, '0');
    INSERT INTO public.quittances(numero, contrat_id, appartement_id, mois_concerne, date_echeance, loyer_base, montant_total)
    VALUES (v_numero, c.id, c.appartement_id, v_debut, v_echeance, c.loyer_mensuel, c.loyer_mensuel);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- 6. Fonction : appliquer pénalités
CREATE OR REPLACE FUNCTION public.appliquer_penalites_retard()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INTEGER := 0;
  v_rate NUMERIC;
  q RECORD;
  v_jours INTEGER;
  v_penalite NUMERIC;
BEGIN
  SELECT late_fee_rate INTO v_rate FROM public.app_settings LIMIT 1;
  IF v_rate IS NULL THEN v_rate := 10; END IF;
  
  FOR q IN 
    SELECT id, loyer_base, date_echeance FROM public.quittances 
    WHERE statut IN ('impayée', 'partielle')
  LOOP
    v_jours := GREATEST(0, (CURRENT_DATE - q.date_echeance)::int);
    IF v_jours > 5 THEN
      v_penalite := round(q.loyer_base * v_rate / 100, 0);
      UPDATE public.quittances 
      SET penalite = v_penalite, montant_total = loyer_base + v_penalite, updated_at = now()
      WHERE id = q.id;
      v_count := v_count + 1;
    END IF;
  END LOOP;
  RETURN v_count;
END;
$$;

-- 7. Fonction : générer rappels
CREATE OR REPLACE FUNCTION public.generer_rappels_echeance()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INTEGER := 0;
  q RECORD;
  v_jours INTEGER;
  v_niveau INTEGER;
BEGIN
  FOR q IN 
    SELECT id, contrat_id, date_echeance FROM public.quittances 
    WHERE statut IN ('impayée', 'partielle')
  LOOP
    v_jours := (CURRENT_DATE - q.date_echeance)::int;
    v_niveau := CASE 
      WHEN v_jours >= 15 THEN 3
      WHEN v_jours >= 10 THEN 2
      WHEN v_jours >= 5 THEN 1
      ELSE 0
    END;
    IF v_niveau > 0 THEN
      INSERT INTO public.rappels_echeance(quittance_id, contrat_id, niveau, jours_retard)
      VALUES (q.id, q.contrat_id, v_niveau, v_jours)
      ON CONFLICT (quittance_id, niveau) DO UPDATE SET jours_retard = EXCLUDED.jours_retard;
      v_count := v_count + 1;
    END IF;
  END LOOP;
  RETURN v_count;
END;
$$;