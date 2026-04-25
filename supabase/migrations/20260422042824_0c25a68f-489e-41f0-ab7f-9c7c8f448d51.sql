
-- Séquences pour numérotation
CREATE SEQUENCE IF NOT EXISTS public.devis_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.facture_seq START 1;

-- Colonnes relances sur factures
ALTER TABLE public.factures
  ADD COLUMN IF NOT EXISTS date_relance DATE,
  ADD COLUMN IF NOT EXISTS niveau_relance INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes_relance TEXT,
  ADD COLUMN IF NOT EXISTS date_paiement DATE,
  ADD COLUMN IF NOT EXISTS recette_id UUID;

-- Fonction : marquer factures en retard
CREATE OR REPLACE FUNCTION public.marquer_factures_en_retard()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  UPDATE public.factures
  SET statut = 'en_retard', updated_at = now()
  WHERE statut IN ('emise', 'envoyee', 'partiellement_payee')
    AND date_echeance IS NOT NULL
    AND date_echeance < CURRENT_DATE;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Fonction : convertir devis en facture
CREATE OR REPLACE FUNCTION public.convertir_devis_en_facture(p_devis_id UUID, p_date_echeance DATE DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_devis RECORD;
  v_facture_id UUID;
  v_numero TEXT;
  v_uid UUID := auth.uid();
BEGIN
  SELECT * INTO v_devis FROM public.devis WHERE id = p_devis_id;
  IF v_devis IS NULL THEN RAISE EXCEPTION 'Devis introuvable'; END IF;
  IF v_devis.statut = 'converti' THEN RAISE EXCEPTION 'Devis déjà converti'; END IF;

  v_numero := 'FAC-' || to_char(CURRENT_DATE, 'YYYY-MM') || '-' || lpad(nextval('facture_seq')::text, 4, '0');

  INSERT INTO public.factures(numero, client_id, devis_id, date_facture, date_echeance, montant_total, statut, notes, user_id)
  VALUES (v_numero, v_devis.client_id, v_devis.id, CURRENT_DATE,
          COALESCE(p_date_echeance, CURRENT_DATE + 30),
          v_devis.montant_total, 'emise', v_devis.notes, COALESCE(v_uid, v_devis.user_id))
  RETURNING id INTO v_facture_id;

  -- Copie des lignes
  INSERT INTO public.lignes_document(facture_id, description, quantite, prix_unitaire, montant, ordre, user_id)
  SELECT v_facture_id, description, quantite, prix_unitaire, montant, ordre, COALESCE(v_uid, v_devis.user_id)
  FROM public.lignes_document WHERE devis_id = p_devis_id ORDER BY ordre;

  UPDATE public.devis SET statut = 'converti', updated_at = now() WHERE id = p_devis_id;
  RETURN v_facture_id;
END;
$$;

-- Fonction : marquer facture payée + créer recette
CREATE OR REPLACE FUNCTION public.marquer_facture_payee(p_facture_id UUID, p_mode_paiement TEXT DEFAULT 'Espèces')
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_fac RECORD;
  v_client_nom TEXT;
  v_recette_id UUID;
  v_uid UUID := auth.uid();
BEGIN
  SELECT * INTO v_fac FROM public.factures WHERE id = p_facture_id;
  IF v_fac IS NULL THEN RAISE EXCEPTION 'Facture introuvable'; END IF;
  IF v_fac.statut = 'payee' THEN RAISE EXCEPTION 'Facture déjà payée'; END IF;

  SELECT nom INTO v_client_nom FROM public.clients WHERE id = v_fac.client_id;

  INSERT INTO public.recettes(libelle, montant, categorie, mode_paiement, date_recette, reference, user_id)
  VALUES ('Facture ' || v_fac.numero || ' - ' || COALESCE(v_client_nom, 'client'),
          v_fac.montant_total, 'Commercial', p_mode_paiement, CURRENT_DATE, v_fac.numero,
          COALESCE(v_uid, v_fac.user_id))
  RETURNING id INTO v_recette_id;

  UPDATE public.factures
  SET statut = 'payee', date_paiement = CURRENT_DATE, recette_id = v_recette_id, updated_at = now()
  WHERE id = p_facture_id;

  RETURN v_recette_id;
END;
$$;
