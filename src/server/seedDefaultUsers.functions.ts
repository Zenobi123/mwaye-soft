import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { logServerAudit } from "@/server/auditLogger";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const DEFAULT_PASSWORD = "Mwaye2026!";

const DEFAULTS: Array<{ email: string; full_name: string; role: AppRole }> = [
  { email: "admin@mwayehouse.cm",      full_name: "Administrateur MWAYE", role: "admin" },
  { email: "directeur@mwayehouse.cm",  full_name: "Directeur Général",    role: "directeur" },
  { email: "comptable@mwayehouse.cm",  full_name: "Comptable",            role: "comptable" },
  { email: "resp.sport@mwayehouse.cm", full_name: "Responsable Sport & Hammam", role: "resp_sport" },
  { email: "caissier@mwayehouse.cm",   full_name: "Caissier",             role: "caissier" },
];

type SeedResult = {
  email: string;
  status: "created" | "exists" | "error";
  message?: string;
};

export const seedDefaultUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Vérifier rôle admin
    const { data: callerRoles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isAdmin = (callerRoles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) {
      return { ok: false as const, error: "Accès refusé : rôle administrateur requis" };
    }

    const results: SeedResult[] = [];

    for (const def of DEFAULTS) {
      try {
        // Chercher si l'utilisateur existe déjà via listUsers (pagination 1000)
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const existing = list?.users.find((u) => u.email?.toLowerCase() === def.email.toLowerCase());

        let userId: string;
        let created = false;

        if (existing) {
          userId = existing.id;
        } else {
          const { data: createdUser, error } = await supabaseAdmin.auth.admin.createUser({
            email: def.email,
            password: DEFAULT_PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: def.full_name },
          });
          if (error || !createdUser?.user) {
            results.push({ email: def.email, status: "error", message: error?.message ?? "Création échouée" });
            continue;
          }
          userId = createdUser.user.id;
          created = true;
        }

        // Profil
        await supabaseAdmin
          .from("profiles")
          .upsert({ user_id: userId, full_name: def.full_name }, { onConflict: "user_id" });

        // Rôle (idempotent)
        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: def.role });
        if (roleErr && roleErr.code !== "23505") {
          results.push({ email: def.email, status: "error", message: roleErr.message });
          continue;
        }

        results.push({ email: def.email, status: created ? "created" : "exists" });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erreur inconnue";
        results.push({ email: def.email, status: "error", message: msg });
      }
    }

    await logServerAudit(context.supabase, context.userId, {
      action: "users.seed_defaults",
      entity_type: "user",
      entity_label: "Comptes par défaut",
      details: { results, password: DEFAULT_PASSWORD },
    });

    return { ok: true as const, results, defaultPassword: DEFAULT_PASSWORD };
  });
