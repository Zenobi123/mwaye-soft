
-- Salles de sport
CREATE TABLE public.salles_sport (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom TEXT NOT NULL,
  capacite INTEGER NOT NULL DEFAULT 20,
  occupees INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'active',
  revenu_mensuel NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.salles_sport ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view salles_sport" ON public.salles_sport FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert salles_sport" ON public.salles_sport FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update salles_sport" ON public.salles_sport FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete salles_sport" ON public.salles_sport FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_salles_sport_updated_at BEFORE UPDATE ON public.salles_sport FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Abonnements sport
CREATE TABLE public.abonnements_sport (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  salle_id UUID NOT NULL REFERENCES public.salles_sport(id) ON DELETE CASCADE,
  nom_abonne TEXT NOT NULL,
  telephone TEXT,
  type_abonnement TEXT NOT NULL DEFAULT 'Mensuel',
  date_debut DATE NOT NULL DEFAULT CURRENT_DATE,
  date_fin DATE NOT NULL,
  montant NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'actif',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.abonnements_sport ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view abonnements_sport" ON public.abonnements_sport FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert abonnements_sport" ON public.abonnements_sport FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update abonnements_sport" ON public.abonnements_sport FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete abonnements_sport" ON public.abonnements_sport FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_abonnements_sport_updated_at BEFORE UPDATE ON public.abonnements_sport FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Séances sport
CREATE TABLE public.seances_sport (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  salle_id UUID NOT NULL REFERENCES public.salles_sport(id) ON DELETE CASCADE,
  date_seance DATE NOT NULL DEFAULT CURRENT_DATE,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  type_seance TEXT NOT NULL DEFAULT 'Libre',
  participants INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seances_sport ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view seances_sport" ON public.seances_sport FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert seances_sport" ON public.seances_sport FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update seances_sport" ON public.seances_sport FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete seances_sport" ON public.seances_sport FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_seances_sport_updated_at BEFORE UPDATE ON public.seances_sport FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
