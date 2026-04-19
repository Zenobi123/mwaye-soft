DROP POLICY IF EXISTS "Authenticated can insert quittances" ON public.quittances;
CREATE POLICY "Privileged can insert quittances" ON public.quittances FOR INSERT TO authenticated 
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'comptable') OR has_role(auth.uid(), 'resp_immobilier'));

DROP POLICY IF EXISTS "Authenticated can insert rappels" ON public.rappels_echeance;
CREATE POLICY "Privileged can insert rappels" ON public.rappels_echeance FOR INSERT TO authenticated 
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'resp_immobilier') OR has_role(auth.uid(), 'comptable'));