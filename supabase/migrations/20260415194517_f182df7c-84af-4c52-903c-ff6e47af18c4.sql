
-- ===== ARTICLES STOCK =====
CREATE TABLE public.articles_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL DEFAULT 'Général',
  quantite INTEGER NOT NULL DEFAULT 0,
  quantite_min INTEGER NOT NULL DEFAULT 5,
  prix_unitaire NUMERIC NOT NULL DEFAULT 0,
  unite TEXT NOT NULL DEFAULT 'unité',
  emplacement TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.articles_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view articles_stock" ON public.articles_stock FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert articles_stock" ON public.articles_stock FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update articles_stock" ON public.articles_stock FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete articles_stock" ON public.articles_stock FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_articles_stock_updated_at BEFORE UPDATE ON public.articles_stock FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== MOUVEMENTS STOCK =====
CREATE TABLE public.mouvements_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles_stock(id) ON DELETE CASCADE,
  type_mouvement TEXT NOT NULL DEFAULT 'entrée',
  quantite INTEGER NOT NULL DEFAULT 1,
  motif TEXT,
  date_mouvement DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mouvements_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view mouvements_stock" ON public.mouvements_stock FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert mouvements_stock" ON public.mouvements_stock FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can delete mouvements_stock" ON public.mouvements_stock FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ===== EMPLOYES =====
CREATE TABLE public.employes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom TEXT NOT NULL,
  poste TEXT NOT NULL,
  departement TEXT NOT NULL DEFAULT 'Général',
  telephone TEXT,
  email TEXT,
  date_embauche DATE NOT NULL DEFAULT CURRENT_DATE,
  salaire NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'actif',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.employes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view employes" ON public.employes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert employes" ON public.employes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update employes" ON public.employes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete employes" ON public.employes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_employes_updated_at BEFORE UPDATE ON public.employes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== PRESENCES =====
CREATE TABLE public.presences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  employe_id UUID NOT NULL REFERENCES public.employes(id) ON DELETE CASCADE,
  date_presence DATE NOT NULL DEFAULT CURRENT_DATE,
  heure_arrivee TEXT,
  heure_depart TEXT,
  statut TEXT NOT NULL DEFAULT 'présent',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.presences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view presences" ON public.presences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert presences" ON public.presences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update presences" ON public.presences FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete presences" ON public.presences FOR DELETE TO authenticated USING (auth.uid() = user_id);
