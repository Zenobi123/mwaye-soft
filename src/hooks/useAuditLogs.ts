import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditFilters {
  action?: string;
  actor?: string;
  from?: string; // ISO date
  to?: string;
}

export function useAuditLogs(filters: AuditFilters = {}) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (filters.action) q = q.eq("action", filters.action);
    if (filters.actor) q = q.ilike("actor_name", `%${filters.actor}%`);
    if (filters.from) q = q.gte("created_at", filters.from);
    if (filters.to) q = q.lte("created_at", filters.to);

    const { data, error } = await q;
    if (!error && data) setLogs(data as AuditLog[]);
    setLoading(false);
  }, [filters.action, filters.actor, filters.from, filters.to]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, refetch: fetchLogs };
}
