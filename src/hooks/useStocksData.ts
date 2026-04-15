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

  const addArticle = useMutation({
    mutationFn: async (values: { nom: string; categorie?: string; quantite?: number; quantite_min?: number; prix_unitaire?: number; unite?: string; emplacement?: string }) => {
      const { error } = await supabase.from("articles_stock").insert({ ...values, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["articles_stock"] }); toast.success("Article ajouté"); },
    onError: (e) => toast.error(e.message),
  });

  const addMouvement = useMutation({
    mutationFn: async (values: { article_id: string; type_mouvement: string; quantite: number; motif?: string }) => {
      const { error } = await supabase.from("mouvements_stock").insert({ ...values, user_id: user!.id });
      if (error) throw error;
      // Update article quantity
      const article = (articlesQuery.data ?? []).find(a => a.id === values.article_id);
      if (article) {
        const newQty = values.type_mouvement === "entrée"
          ? article.quantite + values.quantite
          : Math.max(0, article.quantite - values.quantite);
        await supabase.from("articles_stock").update({ quantite: newQty }).eq("id", values.article_id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles_stock"] });
      queryClient.invalidateQueries({ queryKey: ["mouvements_stock"] });
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

  const articles = articlesQuery.data ?? [];
  const mouvements = mouvementsQuery.data ?? [];
  const alertes = articles.filter(a => a.quantite <= a.quantite_min);

  return { articles, mouvements, alertes, isLoading: articlesQuery.isLoading, addArticle, addMouvement, deleteArticle };
}
