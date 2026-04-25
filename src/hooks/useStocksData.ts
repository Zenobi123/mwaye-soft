import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useStocksData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const articlesQuery = useQuery({
    queryKey: ["articles_stock"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles_stock").select("*").order("nom");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const mouvementsQuery = useQuery({
    queryKey: ["mouvements_stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mouvements_stock")
        .select("*, articles_stock(nom)")
        .order("date_mouvement", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const lotsQuery = useQuery({
    queryKey: ["lots_stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lots_stock")
        .select("*, articles_stock(nom, unite)")
        .gt("quantite_restante", 0)
        .order("date_entree", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const inventairesQuery = useQuery({
    queryKey: ["inventaires"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventaires")
        .select("*")
        .order("date_inventaire", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addArticle = useMutation({
    mutationFn: async (values: { nom: string; categorie?: string; quantite?: number; quantite_min?: number; prix_unitaire?: number; unite?: string; emplacement?: string }) => {
      const { error } = await supabase.from("articles_stock").insert({ ...values, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["articles_stock"] }); toast.success("Article ajouté"); },
    onError: (e) => toast.error(e.message),
  });

  const addMouvement = useMutation({
    mutationFn: async (values: {
      article_id: string; type_mouvement: string; quantite: number; motif?: string;
      prix_unitaire?: number; fournisseur?: string; creer_depense?: boolean;
    }) => {
      let depense_id: string | undefined;
      if (values.creer_depense && values.type_mouvement === "entrée" && values.prix_unitaire) {
        const article = (articlesQuery.data ?? []).find(a => a.id === values.article_id);
        const montant = values.quantite * values.prix_unitaire;
        const { data: dep, error: depErr } = await supabase.from("depenses").insert({
          libelle: `Achat stock — ${article?.nom ?? "article"}${values.fournisseur ? ` (${values.fournisseur})` : ""}`,
          montant,
          categorie: "Approvisionnement",
          statut: "en attente",
          mode_paiement: "Espèces",
          user_id: user!.id,
        }).select("id").single();
        if (depErr) throw depErr;
        depense_id = dep.id;
      }
      const { error } = await supabase.from("mouvements_stock").insert({
        article_id: values.article_id,
        type_mouvement: values.type_mouvement,
        quantite: values.quantite,
        motif: values.motif,
        prix_unitaire: values.prix_unitaire ?? 0,
        fournisseur: values.fournisseur,
        depense_id,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles_stock"] });
      queryClient.invalidateQueries({ queryKey: ["mouvements_stock"] });
      queryClient.invalidateQueries({ queryKey: ["lots_stock"] });
      queryClient.invalidateQueries({ queryKey: ["depenses"] });
      toast.success("Mouvement enregistré");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles_stock").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["articles_stock"] }); toast.success("Article supprimé"); },
    onError: (e) => toast.error(e.message),
  });

  const createInventaire = useMutation({
    mutationFn: async (values: { observations?: string; lignes: { article_id: string; quantite_theorique: number; quantite_physique: number; pmp: number }[] }) => {
      const reference = `INV-${new Date().toISOString().slice(0, 10)}-${Date.now().toString().slice(-4)}`;
      const { data: inv, error } = await supabase.from("inventaires").insert({
        reference, observations: values.observations, user_id: user!.id,
      }).select("id").single();
      if (error) throw error;
      const lignes = values.lignes.map(l => ({
        inventaire_id: inv.id,
        article_id: l.article_id,
        quantite_theorique: l.quantite_theorique,
        quantite_physique: l.quantite_physique,
        ecart: l.quantite_physique - l.quantite_theorique,
        valeur_ecart: (l.quantite_physique - l.quantite_theorique) * l.pmp,
        user_id: user!.id,
      }));
      if (lignes.length > 0) {
        const { error: e2 } = await supabase.from("inventaire_lignes").insert(lignes);
        if (e2) throw e2;
      }
      return inv.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventaires"] });
      toast.success("Inventaire créé en brouillon");
    },
    onError: (e) => toast.error(e.message),
  });

  const validerInventaire = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("valider_inventaire" as never, { p_inventaire_id: id } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventaires"] });
      queryClient.invalidateQueries({ queryKey: ["articles_stock"] });
      queryClient.invalidateQueries({ queryKey: ["mouvements_stock"] });
      queryClient.invalidateQueries({ queryKey: ["lots_stock"] });
      toast.success("Inventaire validé, ajustements appliqués");
    },
    onError: (e) => toast.error(e.message),
  });

  const articles = articlesQuery.data ?? [];
  const mouvements = mouvementsQuery.data ?? [];
  const lots = lotsQuery.data ?? [];
  const inventaires = inventairesQuery.data ?? [];
  const alertes = articles.filter(a => a.quantite <= a.quantite_min);
  const valeurStockTotal = articles.reduce((s, a) => s + Number(a.valeur_stock ?? 0), 0);

  return {
    articles, mouvements, lots, inventaires, alertes, valeurStockTotal,
    isLoading: articlesQuery.isLoading,
    addArticle, addMouvement, deleteArticle, createInventaire, validerInventaire,
  };
}
