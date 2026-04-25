-- Extensions nécessaires (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Nettoyer d'éventuels jobs existants (idempotence)
DO $$
DECLARE j RECORD;
BEGIN
  FOR j IN SELECT jobid, jobname FROM cron.job WHERE jobname IN (
    'mwaye_cloture_journal_quotidienne',
    'mwaye_penalites_et_rappels_quotidiens',
    'mwaye_generation_mensuelle'
  ) LOOP
    PERFORM cron.unschedule(j.jobid);
  END LOOP;
END $$;

-- 1. Clôture automatique du journal de caisse — chaque jour à 23h55
SELECT cron.schedule(
  'mwaye_cloture_journal_quotidienne',
  '55 23 * * *',
  $$ SELECT public.cloturer_journal_jour(CURRENT_DATE); $$
);

-- 2. Pénalités, rappels et factures en retard — chaque jour à 06h00
SELECT cron.schedule(
  'mwaye_penalites_et_rappels_quotidiens',
  '0 6 * * *',
  $$
    SELECT public.appliquer_penalites_retard();
    SELECT public.generer_rappels_echeance();
    SELECT public.marquer_factures_en_retard();
  $$
);

-- 3. Génération mensuelle (quittances mois courant, bulletins + bilan mois précédent)
--    le 1er de chaque mois à 02h00
SELECT cron.schedule(
  'mwaye_generation_mensuelle',
  '0 2 1 * *',
  $$
    SELECT public.generer_quittances_mensuelles(date_trunc('month', CURRENT_DATE)::date);
    SELECT public.generer_bulletins_mensuels((date_trunc('month', CURRENT_DATE) - interval '1 month')::date);
    SELECT public.calculer_bilan_mensuel((date_trunc('month', CURRENT_DATE) - interval '1 month')::date);
  $$
);