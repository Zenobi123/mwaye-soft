-- ============================================================================
-- MIGRATION : Conformité OHADA / Cameroun (Priorité 1)
-- ============================================================================
-- Cette migration corrige les écarts critiques identifiés vs :
--   - SYSCOHADA / AUDCIF (mentions obligatoires factures)
--   - Code Général des Impôts du Cameroun (CGI 2024) : NIU, RC, TVA
--   - Code du Travail Cameroun + CNPS : CFC, FNE, RAV, TDL, AT
--   - Barème IRPP Cameroun : progressif au lieu du taux plat 10 %
-- ============================================================================

-- ============ 1) IDENTITÉ FISCALE DE L'ENTREPRISE ============
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS niu             text,
  ADD COLUMN IF NOT EXISTS rccm            text,
  ADD COLUMN IF NOT EXISTS adresse         text,
  ADD COLUMN IF NOT EXISTS telephone       text,
  ADD COLUMN IF NOT EXISTS email_societe   text,
  ADD COLUMN IF NOT EXISTS regime_fiscal   text DEFAULT 'reel',
  ADD COLUMN IF NOT EXISTS secteur_at      text DEFAULT 'B',          -- A/B/C selon décret
  ADD COLUMN IF NOT EXISTS taux_at         numeric DEFAULT 2.5,        -- accidents du travail
  ADD COLUMN IF NOT EXISTS taux_cfc_emp    numeric DEFAULT 1.0,        -- Crédit Foncier salarié
  ADD COLUMN IF NOT EXISTS taux_cfc_pat    numeric DEFAULT 1.5,        -- Crédit Foncier employeur
  ADD COLUMN IF NOT EXISTS taux_fne        numeric DEFAULT 1.0,        -- FNE employeur
  ADD COLUMN IF NOT EXISTS plafond_cnps    numeric DEFAULT 750000;     -- plafond cotisable CNPS

COMMENT ON COLUMN public.app_settings.niu IS 'Numéro d''Identifiant Unique DGI (mention obligatoire facture)';
COMMENT ON COLUMN public.app_settings.rccm IS 'Registre du Commerce et du Crédit Mobilier (mention obligatoire facture)';
COMMENT ON COLUMN public.app_settings.regime_fiscal IS 'reel | simplifie | non_assujetti';
COMMENT ON COLUMN public.app_settings.secteur_at IS 'Secteur de risque AT (A=1.75% / B=2.5% / C=5%)';

-- ============ 2) NIU CLIENT (obligatoire facture B2B >= 100 000 F) ============
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS niu text;

COMMENT ON COLUMN public.clients.niu IS 'NIU du client (obligatoire facture B2B >= 100 000 FCFA)';

-- ============ 3) BULLETIN DE PAIE COMPLET ============
ALTER TABLE public.bulletins_paie
  ADD COLUMN IF NOT EXISTS cfc_employe        numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cfc_employeur      numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fne_employeur      numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rav                numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tdl                numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS accidents_travail  numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS jours_travailles   integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS heures_normales    numeric DEFAULT 173.33; -- 40h/sem * 52 / 12

-- ============ 4) MATRICULES EMPLOYÉ (CNPS + DGI) ============
ALTER TABLE public.employes
  ADD COLUMN IF NOT EXISTS matricule_cnps text,
  ADD COLUMN IF NOT EXISTS niu_employe    text;

COMMENT ON COLUMN public.employes.matricule_cnps IS 'Numéro d''immatriculation CNPS Cameroun';
COMMENT ON COLUMN public.employes.niu_employe IS 'NIU contribuable de l''employé (DGI Cameroun)';

-- ============================================================================
-- 5) FONCTION : Calcul IRPP Cameroun selon barème progressif
-- ============================================================================
-- Référence : CGI Cameroun art. 69 et s.
-- Base : brut imposable mensuel = brut - CNPS salarié - 30% frais pro - 41 667 F abattement
-- Barème mensuel (annuel /12) :
--   0      → 166 667    : 11 %
--   166 667 → 250 000   : 16,5 %
--   250 000 → 416 667   : 27,5 %
--   > 416 667           : 38,5 %
-- Le barème ci-dessus inclut déjà les CAC (10 % d'additionnel sur l'IRPP).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.calcul_irpp_cameroun(p_brut_imposable numeric)
RETURNS numeric LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  v_irpp numeric := 0;
  v_base numeric;
BEGIN
  v_base := p_brut_imposable;
  IF v_base <= 0 THEN RETURN 0; END IF;

  IF v_base <= 166667 THEN
    v_irpp := v_base * 0.11;
  ELSIF v_base <= 250000 THEN
    v_irpp := 166667 * 0.11 + (v_base - 166667) * 0.165;
  ELSIF v_base <= 416667 THEN
    v_irpp := 166667 * 0.11 + (250000 - 166667) * 0.165 + (v_base - 250000) * 0.275;
  ELSE
    v_irpp := 166667 * 0.11 + (250000 - 166667) * 0.165 + (416667 - 250000) * 0.275 + (v_base - 416667) * 0.385;
  END IF;

  RETURN round(v_irpp, 0);
END;
$$;

-- ============================================================================
-- 6) FONCTION : Calcul RAV Cameroun selon barème
-- ============================================================================
-- Référence : ordonnance n° 89/004 + lois de finances successives.
-- Base : salaire net mensuel imposable.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.calcul_rav_cameroun(p_net_imposable numeric)
RETURNS numeric LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF p_net_imposable < 50000   THEN RETURN 0;     END IF;
  IF p_net_imposable < 100000  THEN RETURN 750;   END IF;
  IF p_net_imposable < 200000  THEN RETURN 1950;  END IF;
  IF p_net_imposable < 300000  THEN RETURN 3250;  END IF;
  IF p_net_imposable < 500000  THEN RETURN 4550;  END IF;
  IF p_net_imposable < 700000  THEN RETURN 5850;  END IF;
  IF p_net_imposable < 1000000 THEN RETURN 7150;  END IF;
  IF p_net_imposable < 1500000 THEN RETURN 8450;  END IF;
  IF p_net_imposable < 2000000 THEN RETURN 9750;  END IF;
  IF p_net_imposable < 3000000 THEN RETURN 11050; END IF;
  IF p_net_imposable < 4000000 THEN RETURN 12350; END IF;
  RETURN 13750;
END;
$$;

-- ============================================================================
-- 7) FONCTION : Calcul TDL Cameroun (mensuel)
-- ============================================================================
-- TDL = Taxe de Développement Local. Barème annuel ramené au mois.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.calcul_tdl_cameroun(p_brut_mensuel numeric)
RETURNS numeric LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF p_brut_mensuel < 62000  THEN RETURN 0;             END IF;
  IF p_brut_mensuel < 75000  THEN RETURN round(3000/12);  END IF;
  IF p_brut_mensuel < 100000 THEN RETURN round(6000/12);  END IF;
  IF p_brut_mensuel < 125000 THEN RETURN round(9000/12);  END IF;
  IF p_brut_mensuel < 150000 THEN RETURN round(12000/12); END IF;
  IF p_brut_mensuel < 200000 THEN RETURN round(15000/12); END IF;
  IF p_brut_mensuel < 250000 THEN RETURN round(18000/12); END IF;
  IF p_brut_mensuel < 300000 THEN RETURN round(21000/12); END IF;
  IF p_brut_mensuel < 500000 THEN RETURN round(24000/12); END IF;
  RETURN round(27000/12);
END;
$$;

-- ============================================================================
-- 8) FONCTION : Génération bulletins mensuels (refonte conforme Cameroun)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generer_bulletins_mensuels(p_mois date)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count           INTEGER := 0;
  v_debut           DATE := date_trunc('month', p_mois)::date;
  v_settings        RECORD;
  v_numero          TEXT;
  v_brut            NUMERIC;
  v_brut_cotisable  NUMERIC;
  v_cnps_emp        NUMERIC;
  v_cnps_pat_pvid   NUMERIC;
  v_cnps_pat_pf     NUMERIC;
  v_cnps_pat_at     NUMERIC;
  v_cnps_pat_total  NUMERIC;
  v_cfc_emp         NUMERIC;
  v_cfc_pat         NUMERIC;
  v_fne_pat         NUMERIC;
  v_brut_imposable  NUMERIC;
  v_irpp            NUMERIC;
  v_rav             NUMERIC;
  v_tdl             NUMERIC;
  v_net             NUMERIC;
  v_cout            NUMERIC;
  e                 RECORD;
BEGIN
  -- Charger les paramètres entreprise (taux + plafond)
  SELECT
    COALESCE(cnps_employee_rate, 4.2)  AS taux_cnps_emp,
    COALESCE(cnps_employer_rate, 7.0)  AS taux_cnps_pat_pvid,  -- ATTENTION : représente PVID employeur uniquement (4,2%) + Prestations Familiales (7%) → 7% en base, voir doc
    COALESCE(taux_at, 2.5)             AS taux_at,
    COALESCE(taux_cfc_emp, 1.0)        AS taux_cfc_emp,
    COALESCE(taux_cfc_pat, 1.5)        AS taux_cfc_pat,
    COALESCE(taux_fne, 1.0)            AS taux_fne,
    COALESCE(plafond_cnps, 750000)     AS plafond_cnps
  INTO v_settings
  FROM public.app_settings LIMIT 1;

  IF v_settings IS NULL THEN
    -- Valeurs par défaut Cameroun si app_settings vide
    v_settings.taux_cnps_emp      := 4.2;
    v_settings.taux_cnps_pat_pvid := 7.0;
    v_settings.taux_at            := 2.5;
    v_settings.taux_cfc_emp       := 1.0;
    v_settings.taux_cfc_pat       := 1.5;
    v_settings.taux_fne           := 1.0;
    v_settings.plafond_cnps       := 750000;
  END IF;

  FOR e IN
    SELECT id, salaire FROM public.employes
    WHERE statut = 'actif'
      AND NOT EXISTS (
        SELECT 1 FROM public.bulletins_paie b
        WHERE b.employe_id = employes.id AND b.mois = v_debut
      )
  LOOP
    v_brut := COALESCE(e.salaire, 0);

    -- Plafonnement CNPS (PVID uniquement plafonné, PF/AT non plafonnés selon textes)
    v_brut_cotisable := LEAST(v_brut, v_settings.plafond_cnps);

    -- CNPS
    v_cnps_emp       := round(v_brut_cotisable * v_settings.taux_cnps_emp / 100, 0);
    v_cnps_pat_pvid  := round(v_brut_cotisable * 4.2 / 100, 0);            -- PVID 4,2% employeur
    v_cnps_pat_pf    := round(v_brut * 7.0 / 100, 0);                       -- Prestations Familiales 7%
    v_cnps_pat_at    := round(v_brut * v_settings.taux_at / 100, 0);        -- Accidents du travail
    v_cnps_pat_total := v_cnps_pat_pvid + v_cnps_pat_pf + v_cnps_pat_at;

    -- CFC
    v_cfc_emp := round(v_brut * v_settings.taux_cfc_emp / 100, 0);
    v_cfc_pat := round(v_brut * v_settings.taux_cfc_pat / 100, 0);

    -- FNE
    v_fne_pat := round(v_brut * v_settings.taux_fne / 100, 0);

    -- IRPP : base = brut - CNPS salarié - 30 % frais pro - 41 667 F abattement mensuel
    v_brut_imposable := v_brut - v_cnps_emp - round(v_brut * 0.30) - 41667;
    IF v_brut_imposable < 0 THEN v_brut_imposable := 0; END IF;
    v_irpp := public.calcul_irpp_cameroun(v_brut_imposable);

    -- RAV (basée sur le brut mensuel après CNPS)
    v_rav := public.calcul_rav_cameroun(v_brut - v_cnps_emp);

    -- TDL (basée sur brut mensuel)
    v_tdl := public.calcul_tdl_cameroun(v_brut);

    -- Net à payer
    v_net := v_brut - v_cnps_emp - v_cfc_emp - v_irpp - v_rav - v_tdl;

    -- Coût employeur total
    v_cout := v_brut + v_cnps_pat_total + v_cfc_pat + v_fne_pat;

    v_numero := 'BUL-' || to_char(v_debut, 'YYYY-MM') || '-' || lpad(nextval('bulletin_seq')::text, 4, '0');

    INSERT INTO public.bulletins_paie(
      numero, employe_id, mois,
      salaire_brut,
      cnps_employe, cnps_employeur, accidents_travail,
      cfc_employe, cfc_employeur, fne_employeur,
      irpp, rav, tdl,
      salaire_net, cout_total_employeur,
      user_id
    )
    VALUES (
      v_numero, e.id, v_debut,
      v_brut,
      v_cnps_emp, v_cnps_pat_total, v_cnps_pat_at,
      v_cfc_emp, v_cfc_pat, v_fne_pat,
      v_irpp, v_rav, v_tdl,
      v_net, v_cout,
      auth.uid()
    );
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;
