import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { logAudit } from "@/services/auditService";

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
      const target = users.find((u) => u.user_id === userId);
      void logAudit({
        action: "user.role_assigned",
        entity_type: "user_role",
        entity_id: userId,
        entity_label: target?.full_name ?? userId,
        details: { role },
      });
      toast.success("Rôle attribué");
      fetchUsers();
    },
    [fetchUsers, users]
  );

  const removeRole = useCallback(
    async (roleId: string) => {
      // Récupérer le détail avant suppression pour l'audit
      const { data: existing } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("id", roleId)
        .maybeSingle();

      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) {
        toast.error("Erreur suppression rôle");
        return;
      }
      if (existing) {
        const target = users.find((u) => u.user_id === existing.user_id);
        void logAudit({
          action: "user.role_removed",
          entity_type: "user_role",
          entity_id: existing.user_id,
          entity_label: target?.full_name ?? existing.user_id,
          details: { role: existing.role },
        });
      }
      toast.success("Rôle retiré");
      fetchUsers();
    },
    [fetchUsers, users]
  );

  return { users, loading, fetchUsers, assignRole, removeRole, ALL_ROLES, ROLE_LABELS };
}
