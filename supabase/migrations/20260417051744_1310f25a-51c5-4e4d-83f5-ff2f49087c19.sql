-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID,
  actor_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_label TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs (actor_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs (action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = actor_id OR actor_id IS NULL);

-- ============ APP SETTINGS ============
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complex_name TEXT NOT NULL DEFAULT 'MWAYE HOUSE',
  currency TEXT NOT NULL DEFAULT 'FCFA',
  locale TEXT NOT NULL DEFAULT 'fr-FR',
  tva_rate NUMERIC NOT NULL DEFAULT 19.25,
  late_fee_rate NUMERIC NOT NULL DEFAULT 10,
  default_sport_price NUMERIC NOT NULL DEFAULT 15000,
  default_hammam_price NUMERIC NOT NULL DEFAULT 3000,
  default_event_hall_price NUMERIC NOT NULL DEFAULT 150000,
  cnps_employee_rate NUMERIC NOT NULL DEFAULT 4.2,
  cnps_employer_rate NUMERIC NOT NULL DEFAULT 11.2,
  notification_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view app settings"
  ON public.app_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update app settings"
  ON public.app_settings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert app settings"
  ON public.app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default row
INSERT INTO public.app_settings (complex_name, currency, locale, tva_rate, late_fee_rate)
VALUES ('MWAYE HOUSE', 'FCFA', 'fr-FR', 19.25, 10);