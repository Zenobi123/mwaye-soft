import { useMemo, useState } from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

const ACTION_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  login: { label: "Connexion", variant: "outline" },
  logout: { label: "Déconnexion", variant: "outline" },
  "user.invited": { label: "Utilisateur invité", variant: "default" },
  "user.deleted": { label: "Utilisateur supprimé", variant: "destructive" },
  "user.role_assigned": { label: "Rôle attribué", variant: "secondary" },
  "user.role_removed": { label: "Rôle retiré", variant: "secondary" },
  "settings.updated": { label: "Paramètres modifiés", variant: "default" },
};

const ACTION_OPTIONS = Object.keys(ACTION_LABELS);

export function AuditLogTable() {
  const [actorFilter, setActorFilter] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filters = useMemo(
    () => ({
      action: actionFilter === "all" ? undefined : actionFilter,
      actor: actorFilter || undefined,
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(to + "T23:59:59").toISOString() : undefined,
    }),
    [actorFilter, actionFilter, from, to]
  );

  const { logs, loading } = useAuditLogs(filters);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5 min-w-[180px]">
          <label className="text-xs text-muted-foreground">Auteur</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              placeholder="Nom…"
              className="pl-8 h-9"
            />
          </div>
        </div>
        <div className="space-y-1.5 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Action</label>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {ACTION_OPTIONS.map((a) => (
                <SelectItem key={a} value={a}>{ACTION_LABELS[a].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Du</label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Au</label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">Aucune entrée d'audit pour ces filtres.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Date</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Cible</TableHead>
                <TableHead>Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const meta = ACTION_LABELS[log.action] ?? { label: log.action, variant: "outline" as const };
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-sm">{log.actor_name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={meta.variant} className="text-xs">{meta.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.entity_label ?? log.entity_id ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[280px] truncate">
                      {log.details ? JSON.stringify(log.details) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Affichage des 500 dernières entrées. Les journaux de plus d'un an sont supprimés automatiquement.
      </p>
    </div>
  );
}
