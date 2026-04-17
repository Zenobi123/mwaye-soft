import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Helper serveur pour journaliser une action d'audit.
 * Utilise le client Supabase authentifié de l'appelant (RLS enforced).
 */
export async function logServerAudit(
  supabase: SupabaseClient,
  actorId: string,
  input: {
    action: string;
    entity_type: string;
    entity_id?: string | null;
    entity_label?: string | null;
    details?: Record<string, unknown> | null;
    ip_address?: string | null;
  }
): Promise<void> {
  try {
    let actorName: string | null = null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", actorId)
      .maybeSingle();
    actorName = profile?.full_name ?? null;

    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      actor_name: actorName,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      entity_label: input.entity_label ?? null,
      details: (input.details as never) ?? null,
      ip_address: input.ip_address ?? null,
    });
  } catch (e) {
    console.warn("[server-audit] échec:", e);
  }
}
