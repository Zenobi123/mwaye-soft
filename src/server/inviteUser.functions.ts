import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { logServerAudit } from "@/server/auditLogger";

const ROLES = [
  "admin",
  "directeur",
  "comptable",
  "resp_sport",
  "resp_evenement",
  "resp_immobilier",
  "caissier",
] as const;

const inputSchema = z.object({
  email: z.string().trim().email().max(255),
  full_name: z.string().trim().min(1).max(120),
  role: z.enum(ROLES),
  mode: z.enum(["invite", "password"]),
  password: z.string().min(8).max(72).optional(),
});

export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    // Vérifier que l'appelant est admin (RLS via le client middleware)
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

    if (data.mode === "password" && !data.password) {
      return { ok: false as const, error: "Mot de passe requis" };
    }

    let userId: string;

    if (data.mode === "invite") {
      const { data: inv, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        data.email,
        { data: { full_name: data.full_name } }
      );
      if (error || !inv?.user) {
        return { ok: false as const, error: error?.message ?? "Échec de l'invitation" };
      }
      userId = inv.user.id;
    } else {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password!,
        email_confirm: true,
        user_metadata: { full_name: data.full_name },
      });
      if (error || !created?.user) {
        return { ok: false as const, error: error?.message ?? "Échec de la création" };
      }
      userId = created.user.id;
    }

    // S'assurer que le profil reflète le nom (le trigger handle_new_user le crée déjà,
    // mais on met à jour au cas où)
    await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId, full_name: data.full_name }, { onConflict: "user_id" });

    // Attribuer le rôle initial (ignorer doublon)
    const { error: roleInsertErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: data.role });

    if (roleInsertErr && roleInsertErr.code !== "23505") {
      await logServerAudit(context.supabase, context.userId, {
        action: "user.invited",
        entity_type: "user",
        entity_id: userId,
        entity_label: data.full_name,
        details: { email: data.email, mode: data.mode, role: data.role, role_warning: roleInsertErr.message },
      });
      return {
        ok: true as const,
        userId,
        warning: `Utilisateur créé mais l'attribution du rôle a échoué : ${roleInsertErr.message}`,
      };
    }

    await logServerAudit(context.supabase, context.userId, {
      action: "user.invited",
      entity_type: "user",
      entity_id: userId,
      entity_label: data.full_name,
      details: { email: data.email, mode: data.mode, role: data.role },
    });

    return { ok: true as const, userId };
  });
