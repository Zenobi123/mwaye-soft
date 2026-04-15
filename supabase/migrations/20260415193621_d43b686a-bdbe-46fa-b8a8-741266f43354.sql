
-- ===== HAMMAM SECTIONS =====
CREATE TABLE public.hammam_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'ouvert',
  capacite INTEGER NOT NULL DEFAULT 20,
  visiteurs INTEGER NOT NULL DEFAULT 0,
  temperature TEXT DEFAULT '—',
  revenu_mensuel NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hammam_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view hammam_sections" ON public.hammam_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert hammam_sections" ON public.hammam_sections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update hammam_sections" ON public.hammam_sections FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete hammam_sections" ON public.hammam_sections FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_hammam_sections_updated_at BEFORE UPDATE ON public.hammam_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== HAMMAM ENTREES =====
CREATE TABLE public.hammam_entrees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section_id UUID NOT NULL REFERENCES public.hammam_sections(id) ON DELETE CASCADE,
  heure TEXT NOT NULL,
  nom_client TEXT NOT NULL,
  type_service TEXT NOT NULL DEFAULT 'Entrée simple',
  montant NUMERIC NOT NULL DEFAULT 0,
  date_entree DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hammam_entrees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view hammam_entrees" ON public.hammam_entrees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert hammam_entrees" ON public.hammam_entrees FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update hammam_entrees" ON public.hammam_entrees FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete hammam_entrees" ON public.hammam_entrees FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_hammam_entrees_updated_at BEFORE UPDATE ON public.hammam_entrees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== SALLES FETES =====
CREATE TABLE public.salles_fetes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom TEXT NOT NULL,
  capacite INTEGER NOT NULL DEFAULT 100,
  prix_journalier NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'disponible',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.salles_fetes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view salles_fetes" ON public.salles_fetes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert salles_fetes" ON public.salles_fetes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update salles_fetes" ON public.salles_fetes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete salles_fetes" ON public.salles_fetes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_salles_fetes_updated_at BEFORE UPDATE ON public.salles_fetes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== RESERVATIONS EVENEMENTS =====
CREATE TABLE public.reservations_evenements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  salle_id UUID NOT NULL REFERENCES public.salles_fetes(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  date_evenement DATE NOT NULL,
  heure_debut TEXT NOT NULL,
  heure_fin TEXT NOT NULL,
  nombre_invites INTEGER NOT NULL DEFAULT 0,
  montant NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'en attente',
  contact_nom TEXT,
  contact_telephone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reservations_evenements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view reservations_evenements" ON public.reservations_evenements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert reservations_evenements" ON public.reservations_evenements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update reservations_evenements" ON public.reservations_evenements FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete reservations_evenements" ON public.reservations_evenements FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_reservations_evenements_updated_at BEFORE UPDATE ON public.reservations_evenements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== APPARTEMENTS =====
CREATE TABLE public.appartements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  numero TEXT NOT NULL,
  type_appartement TEXT NOT NULL DEFAULT 'Meublé',
  nombre_pieces INTEGER NOT NULL DEFAULT 2,
  loyer NUMERIC NOT NULL DEFAULT 0,
  locataire TEXT DEFAULT '—',
  statut TEXT NOT NULL DEFAULT 'disponible',
  paye BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appartements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view appartements" ON public.appartements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert appartements" ON public.appartements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update appartements" ON public.appartements FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete appartements" ON public.appartements FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_appartements_updated_at BEFORE UPDATE ON public.appartements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== CONTRATS BAIL =====
CREATE TABLE public.contrats_bail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  appartement_id UUID NOT NULL REFERENCES public.appartements(id) ON DELETE CASCADE,
  locataire TEXT NOT NULL,
  telephone TEXT,
  date_debut DATE NOT NULL DEFAULT CURRENT_DATE,
  date_fin DATE NOT NULL,
  loyer_mensuel NUMERIC NOT NULL DEFAULT 0,
  caution NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'actif',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contrats_bail ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view contrats_bail" ON public.contrats_bail FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert contrats_bail" ON public.contrats_bail FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update contrats_bail" ON public.contrats_bail FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete contrats_bail" ON public.contrats_bail FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_contrats_bail_updated_at BEFORE UPDATE ON public.contrats_bail FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
