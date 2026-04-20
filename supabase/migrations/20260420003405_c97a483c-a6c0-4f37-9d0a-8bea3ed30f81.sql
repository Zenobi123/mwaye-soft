
-- Séquence pour la numérotation des bulletins
CREATE SEQUENCE IF NOT EXISTS bulletin_seq START 1;

-- ============ BULLETINS DE PAIE ============
CREATE TABLE public.bulletins_paie (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  employe_id uuid NOT NULL REFERENCES public.employes(id) ON DELETE CASCADE,
  mois date NOT NULL,
  salaire_brut numeric NOT NULL DEFAULT 0,
  prime numeric NOT NULL DEFAULT 0,
  heures_sup numeric NOT NULL DEFAULT 0,
  cnps_employe numeric NOT NULL DEFAULT 0,
  cnps_employeur numeric NOT NULL DEFAULT 0,
  irpp numeric NOT NULL DEFAULT 0,
  autres_retenues numeric NOT NULL DEFAULT 0,
  salaire_net numeric NOT NULL DEFAULT 0,
  cout_total_employeur numeric NOT NULL DEFAULT 0,
  statut text NOT NULL DEFAULT 'brouillon',
  date_paiement date,
  mode_paiement text,
  depense_id uuid,
  notes text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employe_id, mois)
);

ALTER TABLE public.bulletins_paie ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view bulletins_paie" ON public.bulletins_paie
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Privileged can insert bulletins_paie" ON public.bulletins_paie
  FOR INSERT TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'directeur'::app_role)
    OR has_role(auth.uid(), 'comptable'::app_role)
  );

CREATE POLICY "Privileged can update bulletins_paie" ON public.bulletins_paie
  FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'directeur'::app_role)
    OR has_role(auth.uid(), 'comptable'::app_role)
  );

CREATE POLICY "Admins can delete bulletins_paie" ON public.bulletins_paie
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_bulletins_paie_updated
  BEFORE UPDATE ON public.bulletins_paie
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CONGES ============
CREATE TABLE public.conges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id uuid NOT NULL REFERENCES public.employes(id) ON DELETE CASCADE,
  type_conge text NOT NULL DEFAULT 'annuel',
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  nb_jours integer NOT NULL DEFAULT 0,
  motif text,
  statut text NOT NULL DEFAULT 'en_attente',
  approuve_par uuid,
  approuve_le timestamptz,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.conges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view conges" ON public.conges
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert conges" ON public.conges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Privileged can update conges" ON public.conges
  FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'directeur'::app_role)
    OR has_role(auth.uid(), 'comptable'::app_role)
    OR auth.uid() = user_id
  );

CREATE POLICY "Privileged can delete conges" ON public.conges
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = user_id);

CREATE TRIGGER trg_conges_updated
  BEFORE UPDATE ON public.conges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour calculer nb_jours
CREATE OR REPLACE FUNCTION public.calculer_nb_jours_conge()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.nb_jours := GREATEST(1, (NEW.date_fin - NEW.date_debut + 1)::int);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_conges_nb_jours
  BEFORE INSERT OR UPDATE OF date_debut, date_fin ON public.conges
  FOR EACH ROW EXECUTE FUNCTION public.calculer_nb_jours_conge();

-- ============ PLANNINGS ============
CREATE TABLE public.plannings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id uuid NOT NULL REFERENCES public.employes(id) ON DELETE CASCADE,
  date_planning date NOT NULL,
  heure_debut time NOT NULL,
  heure_fin time NOT NULL,
  poste_assigne text,
  notes text,
  statut text NOT NULL DEFAULT 'planifié',
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plannings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view plannings" ON public.plannings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert plannings" ON public.plannings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creator can update plannings" ON public.plannings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Creator can delete plannings" ON public.plannings
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_plannings_updated
  BEFORE UPDATE ON public.plannings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ FONCTION : Génération des bulletins mensuels ============
CREATE OR REPLACE FUNCTION public.generer_bulletins_mensuels(p_mois date)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INTEGER := 0;
  v_debut DATE := date_trunc('month', p_mois)::date;
  v_taux_emp NUMERIC;
  v_taux_pat NUMERIC;
  v_numero TEXT;
  v_brut NUMERIC;
  v_cnps_emp NUMERIC;
  v_cnps_pat NUMERIC;
  v_irpp NUMERIC;
  v_net NUMERIC;
  v_cout NUMERIC;
  e RECORD;
BEGIN
  SELECT cnps_employee_rate, cnps_employer_rate INTO v_taux_emp, v_taux_pat
  FROM public.app_settings LIMIT 1;
  IF v_taux_emp IS NULL THEN v_taux_emp := 4.2; END IF;
  IF v_taux_pat IS NULL THEN v_taux_pat := 11.2; END IF;

  FOR e IN
    SELECT id, salaire FROM public.employes
    WHERE statut = 'actif'
      AND NOT EXISTS (
        SELECT 1 FROM public.bulletins_paie b
        WHERE b.employe_id = employes.id AND b.mois = v_debut
      )
  LOOP
    v_brut := COALESCE(e.salaire, 0);
    v_cnps_emp := round(v_brut * v_taux_emp / 100, 0);
    v_cnps_pat := round(v_brut * v_taux_pat / 100, 0);
    -- IRPP simplifié : 10% au-dessus de 62 000 FCFA (abattement)
    v_irpp := CASE WHEN v_brut > 62000 THEN round((v_brut - 62000) * 0.10, 0) ELSE 0 END;
    v_net := v_brut - v_cnps_emp - v_irpp;
    v_cout := v_brut + v_cnps_pat;
    v_numero := 'BUL-' || to_char(v_debut, 'YYYY-MM') || '-' || lpad(nextval('bulletin_seq')::text, 4, '0');

    INSERT INTO public.bulletins_paie(
      numero, employe_id, mois, salaire_brut, cnps_employe, cnps_employeur,
      irpp, salaire_net, cout_total_employeur, user_id
    )
    VALUES (
      v_numero, e.id, v_debut, v_brut, v_cnps_emp, v_cnps_pat,
      v_irpp, v_net, v_cout, auth.uid()
    );
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- ============ FONCTION : Validation et création de dépense ============
CREATE OR REPLACE FUNCTION public.valider_bulletin_et_creer_depense(p_bulletin_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_bul RECORD;
  v_emp_nom TEXT;
  v_dep_id UUID;
BEGIN
  SELECT * INTO v_bul FROM public.bulletins_paie WHERE id = p_bulletin_id;
  IF v_bul IS NULL THEN
    RAISE EXCEPTION 'Bulletin introuvable';
  END IF;
  IF v_bul.statut <> 'brouillon' THEN
    RAISE EXCEPTION 'Bulletin déjà validé';
  END IF;

  SELECT nom INTO v_emp_nom FROM public.employes WHERE id = v_bul.employe_id;

  INSERT INTO public.depenses(libelle, montant, categorie, statut, mode_paiement, date_depense, reference, user_id)
  VALUES (
    'Salaire ' || COALESCE(v_emp_nom, 'employé') || ' - ' || to_char(v_bul.mois, 'MM/YYYY'),
    v_bul.cout_total_employeur,
    'Personnel',
    'en attente',
    'Virement',
    CURRENT_DATE,
    v_bul.numero,
    auth.uid()
  )
  RETURNING id INTO v_dep_id;

  UPDATE public.bulletins_paie
  SET statut = 'validé', depense_id = v_dep_id, updated_at = now()
  WHERE id = p_bulletin_id;

  RETURN v_dep_id;
END;
$$;
