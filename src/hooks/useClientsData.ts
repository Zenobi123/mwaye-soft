import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useClientsData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").order("nom");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addClient = useMutation({
    mutationFn: async (values: { nom: string; email?: string; telephone?: string; adresse?: string; type_client?: string }) => {
      const { error } = await supabase.from("clients").insert({ ...values, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clients"] }); toast.success("Client ajouté"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clients"] }); toast.success("Client supprimé"); },
    onError: (e) => toast.error(e.message),
  });

  return { clients: clientsQuery.data ?? [], isLoading: clientsQuery.isLoading, addClient, deleteClient };
}
