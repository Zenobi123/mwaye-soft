import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const inputSchema = z.object({
  user_id: z.string().uuid(),
});

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    // Vérifier que l'appelant est admin
    const { data: callerRoles, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);

    if (roleErr) {
      return { ok: false as const, error: "Erreur de vérification des droits" };
    }
    const isAdmin = (callerRoles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) {
      return { ok: false as const, error: "Accès refusé : rôle administrateur requis" };
    }

    // Empêcher l'auto-suppression
    if (data.user_id === context.userId) {
      return { ok: false as const, error: "Vous ne pouvez pas supprimer votre propre compte" };
    }

    // Empêcher la suppression du dernier admin
    if (data.user_id !== context.userId) {
      const { data: targetRoles } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user_id);
      const targetIsAdmin = (targetRoles ?? []).some((r) => r.role === "admin");
      if (targetIsAdmin) {
        const { count } = await supabaseAdmin
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin");
        if ((count ?? 0) <= 1) {
          return { ok: false as const, error: "Impossible de supprimer le dernier administrateur" };
        }
      }
    }

    // Retirer tous les rôles
    const { error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id);
    if (rolesErr) {
      return { ok: false as const, error: `Échec retrait des rôles : ${rolesErr.message}` };
    }

    // Supprimer le profil (le compte auth disparaît via la suppression ci-dessous)
    await supabaseAdmin.from("profiles").delete().eq("user_id", data.user_id);

    // Désactiver / supprimer le compte auth
    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (authErr) {
      return { ok: false as const, error: `Échec suppression compte : ${authErr.message}` };
    }

    return { ok: true as const };
  });
