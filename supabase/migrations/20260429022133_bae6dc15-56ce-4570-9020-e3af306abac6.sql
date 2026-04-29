-- Bucket privé pour les sauvegardes
INSERT INTO storage.buckets (id, name, public)
VALUES ('backups', 'backups', false)
ON CONFLICT (id) DO NOTHING;

-- Table de log des sauvegardes
CREATE TABLE IF NOT EXISTS public.backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_backup TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  tables_count INTEGER NOT NULL DEFAULT 0,
  rows_count INTEGER NOT NULL DEFAULT 0,
  type_backup TEXT NOT NULL DEFAULT 'manuel',
  statut TEXT NOT NULL DEFAULT 'succès',
  observations TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view backup logs"
ON public.backup_logs FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert backup logs"
ON public.backup_logs FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete backup logs"
ON public.backup_logs FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Politiques storage : admins seulement
CREATE POLICY "Admins can view backup files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'backups' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can upload backup files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'backups' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete backup files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'backups' AND has_role(auth.uid(), 'admin'::app_role));

-- Fonction de nettoyage : supprime les logs > 90 jours (rétention)
CREATE OR REPLACE FUNCTION public.purger_anciens_backups(p_jours_retention INTEGER DEFAULT 90)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  DELETE FROM public.backup_logs
  WHERE date_backup < (now() - (p_jours_retention || ' days')::interval);
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;