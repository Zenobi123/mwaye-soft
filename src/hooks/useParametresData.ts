import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type UserRole = Tables<"user_roles">;

export interface UserWithRoles extends Profile {
  roles: UserRole[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrateur",
  directeur: "Directeur",
  comptable: "Comptable",
  resp_sport: "Resp. Sport",
  resp_evenement: "Resp. Événement",
  resp_immobilier: "Resp. Immobilier",
  caissier: "Caissier",
};

const ALL_ROLES = Object.keys(ROLE_LABELS) as Array<
  "admin" | "directeur" | "comptable" | "resp_sport" | "resp_evenement" | "resp_immobilier" | "caissier"
>;

export function useParametresData() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);

    if (profilesRes.error) {
      toast.error("Erreur chargement utilisateurs");
      setLoading(false);
      return;
    }

    const profiles = profilesRes.data ?? [];
    const roles = rolesRes.data ?? [];

    const merged: UserWithRoles[] = profiles.map((p) => ({
      ...p,
      roles: roles.filter((r) => r.user_id === p.user_id),
    }));

    setUsers(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const assignRole = useCallback(
    async (userId: string, role: typeof ALL_ROLES[number]) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) {
        if (error.code === "23505") {
          toast.info("Ce rôle est déjà attribué");
        } else {
          toast.error("Erreur attribution rôle");
        }
        return;
      }
      toast.success("Rôle attribué");
      fetchUsers();
    },
    [fetchUsers]
  );

  const removeRole = useCallback(
    async (roleId: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) {
        toast.error("Erreur suppression rôle");
        return;
      }
      toast.success("Rôle retiré");
      fetchUsers();
    },
    [fetchUsers]
  );

  return { users, loading, fetchUsers, assignRole, removeRole, ALL_ROLES, ROLE_LABELS };
}
