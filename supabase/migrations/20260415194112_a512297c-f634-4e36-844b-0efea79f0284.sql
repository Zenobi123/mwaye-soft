
-- ===== CLIENTS =====
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  type_client TEXT NOT NULL DEFAULT 'Particulier',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update clients" ON public.clients FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete clients" ON public.clients FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== DEVIS =====
CREATE TABLE public.devis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  numero TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  date_devis DATE NOT NULL DEFAULT CURRENT_DATE,
  date_validite DATE,
  montant_total NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'brouillon',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view devis" ON public.devis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert devis" ON public.devis FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update devis" ON public.devis FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete devis" ON public.devis FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_devis_updated_at BEFORE UPDATE ON public.devis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== FACTURES =====
CREATE TABLE public.factures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  numero TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  devis_id UUID REFERENCES public.devis(id) ON DELETE SET NULL,
  date_facture DATE NOT NULL DEFAULT CURRENT_DATE,
  date_echeance DATE,
  montant_total NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'brouillon',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view factures" ON public.factures FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert factures" ON public.factures FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update factures" ON public.factures FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete factures" ON public.factures FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON public.factures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== LIGNES DOCUMENT (shared for devis & factures) =====
CREATE TABLE public.lignes_document (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  devis_id UUID REFERENCES public.devis(id) ON DELETE CASCADE,
  facture_id UUID REFERENCES public.factures(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantite NUMERIC NOT NULL DEFAULT 1,
  prix_unitaire NUMERIC NOT NULL DEFAULT 0,
  montant NUMERIC NOT NULL DEFAULT 0,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lignes_document_parent_check CHECK (devis_id IS NOT NULL OR facture_id IS NOT NULL)
);
ALTER TABLE public.lignes_document ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view lignes_document" ON public.lignes_document FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert lignes_document" ON public.lignes_document FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update lignes_document" ON public.lignes_document FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete lignes_document" ON public.lignes_document FOR DELETE TO authenticated USING (auth.uid() = user_id);
