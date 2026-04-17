import { supabase } from "@/integrations/supabase/client";

export type AuditAction =
  | "login"
  | "logout"
  | "user.invited"
  | "user.deleted"
  | "user.role_assigned"
  | "user.role_removed"
  | "settings.updated"
  | "data.created"
  | "data.updated"
  | "data.deleted";

export interface LogAuditInput {
  action: AuditAction | string;
  entity_type: string;
  entity_id?: string | null;
  entity_label?: string | null;
  details?: Record<string, unknown> | null;
}

/**
 * Enregistre une action sensible dans le journal d'audit.
 * Échec silencieux : ne bloque jamais l'action principale.
 */
export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    let actorName: string | null = null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle();
    actorName = profile?.full_name ?? user.email ?? null;

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      actor_name: actorName,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      entity_label: input.entity_label ?? null,
      details: (input.details as never) ?? null,
    });
  } catch (e) {
    // Audit ne doit jamais bloquer
    console.warn("[audit] échec d'écriture:", e);
  }
}
