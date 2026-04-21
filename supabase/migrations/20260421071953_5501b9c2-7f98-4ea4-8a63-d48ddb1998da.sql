
-- ============ EXTENSIONS DES TABLES EXISTANTES ============
ALTER TABLE public.articles_stock 
  ADD COLUMN IF NOT EXISTS valeur_stock NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pmp NUMERIC NOT NULL DEFAULT 0;

ALTER TABLE public.mouvements_stock
  ADD COLUMN IF NOT EXISTS prix_unitaire NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valeur_mouvement NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lot_id UUID,
  ADD COLUMN IF NOT EXISTS depense_id UUID,
  ADD COLUMN IF NOT EXISTS fournisseur TEXT;

-- ============ TABLE LOTS_STOCK (FIFO) ============
CREATE TABLE IF NOT EXISTS public.lots_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles_stock(id) ON DELETE CASCADE,
  date_entree DATE NOT NULL DEFAULT CURRENT_DATE,
  quantite_initiale INTEGER NOT NULL DEFAULT 0,
  quantite_restante INTEGER NOT NULL DEFAULT 0,
  prix_unitaire NUMERIC NOT NULL DEFAULT 0,
  fournisseur TEXT,
  reference_achat TEXT,
  depense_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lots_article ON public.lots_stock(article_id, date_entree);

ALTER TABLE public.lots_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view lots_stock" ON public.lots_stock FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert lots_stock" ON public.lots_stock FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update lots_stock" ON public.lots_stock FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete lots_stock" ON public.lots_stock FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_lots_stock_updated BEFORE UPDATE ON public.lots_stock
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TABLE INVENTAIRES ============
CREATE TABLE IF NOT EXISTS public.inventaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL,
  date_inventaire DATE NOT NULL DEFAULT CURRENT_DATE,
  statut TEXT NOT NULL DEFAULT 'brouillon',
  ecart_total_valeur NUMERIC NOT NULL DEFAULT 0,
  observations TEXT,
  valide_par UUID,
  valide_le TIMESTAMPTZ,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inventaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view inventaires" ON public.inventaires FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert inventaires" ON public.inventaires FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update inventaires" ON public.inventaires FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete inventaires" ON public.inventaires FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_inventaires_updated BEFORE UPDATE ON public.inventaires
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TABLE INVENTAIRE_LIGNES ============
CREATE TABLE IF NOT EXISTS public.inventaire_lignes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventaire_id UUID NOT NULL REFERENCES public.inventaires(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles_stock(id) ON DELETE CASCADE,
  quantite_theorique INTEGER NOT NULL DEFAULT 0,
  quantite_physique INTEGER NOT NULL DEFAULT 0,
  ecart INTEGER NOT NULL DEFAULT 0,
  valeur_ecart NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inv_lignes_inv ON public.inventaire_lignes(inventaire_id);

ALTER TABLE public.inventaire_lignes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view inventaire_lignes" ON public.inventaire_lignes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert inventaire_lignes" ON public.inventaire_lignes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update inventaire_lignes" ON public.inventaire_lignes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete inventaire_lignes" ON public.inventaire_lignes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ SEQUENCE INVENTAIRE ============
CREATE SEQUENCE IF NOT EXISTS public.inventaire_seq START 1;

-- ============ FONCTION: VALORISER UN ARTICLE (PMP + valeur) ============
CREATE OR REPLACE FUNCTION public.valoriser_article(p_article_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_qte NUMERIC := 0;
  v_total_val NUMERIC := 0;
  v_pmp NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(quantite_restante), 0),
         COALESCE(SUM(quantite_restante * prix_unitaire), 0)
  INTO v_total_qte, v_total_val
  FROM public.lots_stock
  WHERE article_id = p_article_id AND quantite_restante > 0;

  v_pmp := CASE WHEN v_total_qte > 0 THEN v_total_val / v_total_qte ELSE 0 END;

  UPDATE public.articles_stock
  SET valeur_stock = v_total_val,
      pmp = v_pmp,
      quantite = v_total_qte,
      updated_at = now()
  WHERE id = p_article_id;
END;
$$;

-- ============ FONCTION: CONSOMMER STOCK FIFO ============
CREATE OR REPLACE FUNCTION public.consommer_stock_fifo(p_article_id UUID, p_quantite INTEGER)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_restant INTEGER := p_quantite;
  v_valeur NUMERIC := 0;
  v_consomme INTEGER;
  l RECORD;
BEGIN
  FOR l IN
    SELECT id, quantite_restante, prix_unitaire
    FROM public.lots_stock
    WHERE article_id = p_article_id AND quantite_restante > 0
    ORDER BY date_entree ASC, created_at ASC
  LOOP
    EXIT WHEN v_restant <= 0;
    v_consomme := LEAST(v_restant, l.quantite_restante);
    UPDATE public.lots_stock
    SET quantite_restante = quantite_restante - v_consomme,
        updated_at = now()
    WHERE id = l.id;
    v_valeur := v_valeur + (v_consomme * l.prix_unitaire);
    v_restant := v_restant - v_consomme;
  END LOOP;

  PERFORM public.valoriser_article(p_article_id);
  RETURN v_valeur;
END;
$$;

-- ============ TRIGGER SUR MOUVEMENTS_STOCK ============
CREATE OR REPLACE FUNCTION public.handle_mouvement_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lot_id UUID;
  v_valeur NUMERIC := 0;
BEGIN
  IF NEW.type_mouvement = 'entrée' THEN
    INSERT INTO public.lots_stock(article_id, date_entree, quantite_initiale, quantite_restante, prix_unitaire, fournisseur, reference_achat, depense_id, user_id)
    VALUES (NEW.article_id, NEW.date_mouvement, NEW.quantite, NEW.quantite, COALESCE(NEW.prix_unitaire, 0), NEW.fournisseur, NEW.motif, NEW.depense_id, NEW.user_id)
    RETURNING id INTO v_lot_id;
    NEW.lot_id := v_lot_id;
    NEW.valeur_mouvement := NEW.quantite * COALESCE(NEW.prix_unitaire, 0);
    PERFORM public.valoriser_article(NEW.article_id);
  ELSIF NEW.type_mouvement = 'sortie' THEN
    v_valeur := public.consommer_stock_fifo(NEW.article_id, NEW.quantite);
    NEW.valeur_mouvement := v_valeur;
    IF NEW.quantite > 0 THEN
      NEW.prix_unitaire := v_valeur / NEW.quantite;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mouvement_stock ON public.mouvements_stock;
CREATE TRIGGER trg_mouvement_stock BEFORE INSERT ON public.mouvements_stock
  FOR EACH ROW EXECUTE FUNCTION public.handle_mouvement_stock();

-- ============ FONCTION: VALIDER UN INVENTAIRE ============
CREATE OR REPLACE FUNCTION public.valider_inventaire(p_inventaire_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
  v_total NUMERIC := 0;
  v_inv RECORD;
  l RECORD;
BEGIN
  SELECT * INTO v_inv FROM public.inventaires WHERE id = p_inventaire_id;
  IF v_inv IS NULL THEN RAISE EXCEPTION 'Inventaire introuvable'; END IF;
  IF v_inv.statut <> 'brouillon' THEN RAISE EXCEPTION 'Inventaire déjà validé'; END IF;

  FOR l IN
    SELECT il.*, a.pmp FROM public.inventaire_lignes il
    JOIN public.articles_stock a ON a.id = il.article_id
    WHERE il.inventaire_id = p_inventaire_id AND il.ecart <> 0
  LOOP
    IF l.ecart > 0 THEN
      INSERT INTO public.mouvements_stock(article_id, type_mouvement, quantite, motif, prix_unitaire, user_id)
      VALUES (l.article_id, 'entrée', l.ecart, 'Ajustement inventaire ' || v_inv.reference, COALESCE(l.pmp, 0), v_inv.user_id);
    ELSE
      INSERT INTO public.mouvements_stock(article_id, type_mouvement, quantite, motif, user_id)
      VALUES (l.article_id, 'sortie', ABS(l.ecart), 'Ajustement inventaire ' || v_inv.reference, v_inv.user_id);
    END IF;
    v_total := v_total + l.valeur_ecart;
    v_count := v_count + 1;
  END LOOP;

  UPDATE public.inventaires
  SET statut = 'validé', valide_par = auth.uid(), valide_le = now(),
      ecart_total_valeur = v_total, updated_at = now()
  WHERE id = p_inventaire_id;

  RETURN v_count;
END;
$$;
