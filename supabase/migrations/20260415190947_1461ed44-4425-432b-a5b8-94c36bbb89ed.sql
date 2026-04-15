
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'directeur', 'comptable', 'resp_sport', 'resp_evenement', 'resp_immobilier', 'caissier');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Recettes (Income) table
CREATE TABLE public.recettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  libelle TEXT NOT NULL,
  montant NUMERIC(12,2) NOT NULL CHECK (montant > 0),
  categorie TEXT NOT NULL CHECK (categorie IN ('Sport', 'Événement', 'Appartement', 'Hammam', 'Autre')),
  mode_paiement TEXT NOT NULL DEFAULT 'Espèces' CHECK (mode_paiement IN ('Espèces', 'Virement', 'Chèque', 'Mobile Money', 'Carte')),
  reference TEXT,
  notes TEXT,
  date_recette DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recettes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view recettes" ON public.recettes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert recettes" ON public.recettes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update recettes" ON public.recettes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete recettes" ON public.recettes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_recettes_updated_at BEFORE UPDATE ON public.recettes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Depenses (Expenses) table
CREATE TABLE public.depenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  libelle TEXT NOT NULL,
  montant NUMERIC(12,2) NOT NULL CHECK (montant > 0),
  categorie TEXT NOT NULL CHECK (categorie IN ('Salaires', 'Électricité', 'Eau', 'Fournitures', 'Maintenance', 'Équipements', 'Autre')),
  statut TEXT NOT NULL DEFAULT 'en attente' CHECK (statut IN ('en attente', 'approuvé', 'rejeté', 'payé')),
  mode_paiement TEXT NOT NULL DEFAULT 'Espèces' CHECK (mode_paiement IN ('Espèces', 'Virement', 'Chèque', 'Mobile Money', 'Carte')),
  reference TEXT,
  justificatif_url TEXT,
  notes TEXT,
  date_depense DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.depenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view depenses" ON public.depenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert depenses" ON public.depenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update depenses" ON public.depenses FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creator can delete depenses" ON public.depenses FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_depenses_updated_at BEFORE UPDATE ON public.depenses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Journal de caisse (Daily cash journal)
CREATE TABLE public.journal_caisse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  date_journal DATE NOT NULL UNIQUE,
  solde_ouverture NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_recettes NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_depenses NUMERIC(12,2) NOT NULL DEFAULT 0,
  solde_cloture NUMERIC(12,2) NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'clôturé')),
  observations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_caisse ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view journal" ON public.journal_caisse FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert journal" ON public.journal_caisse FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creator can update journal" ON public.journal_caisse FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_journal_caisse_updated_at BEFORE UPDATE ON public.journal_caisse
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_recettes_date ON public.recettes(date_recette);
CREATE INDEX idx_recettes_categorie ON public.recettes(categorie);
CREATE INDEX idx_depenses_date ON public.depenses(date_depense);
CREATE INDEX idx_depenses_categorie ON public.depenses(categorie);
CREATE INDEX idx_depenses_statut ON public.depenses(statut);
CREATE INDEX idx_journal_date ON public.journal_caisse(date_journal);
