import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  runDatabaseBackup,
  getBackupDownloadUrl,
  deleteBackup,
  purgeOldBackups,
} from "@/server/backupDatabase.functions";

export interface BackupLog {
  id: string;
  date_backup: string;
  file_path: string;
  file_size_bytes: number;
  tables_count: number;
  rows_count: number;
  type_backup: string;
  statut: string;
  observations: string | null;
}

export function useBackups() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const runBackupFn = useServerFn(runDatabaseBackup);
  const getUrlFn = useServerFn(getBackupDownloadUrl);
  const deleteFn = useServerFn(deleteBackup);
  const purgeFn = useServerFn(purgeOldBackups);

  const logsQuery = useQuery({
    queryKey: ["backup_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("backup_logs")
        .select("*")
        .order("date_backup", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as BackupLog[];
    },
    enabled: !!user,
  });

  const runBackup = useMutation({
    mutationFn: () => runBackupFn({ data: { type: "manuel" } }),
    onSuccess: (r) => {
      toast.success(`Sauvegarde créée · ${r.rows_count} lignes (${r.tables_count} tables)`);
      qc.invalidateQueries({ queryKey: ["backup_logs"] });
    },
    onError: (e: Error) => toast.error("Échec sauvegarde", { description: e.message }),
  });

  const downloadBackup = useMutation({
    mutationFn: async (filePath: string) => {
      const { url } = await getUrlFn({ data: { file_path: filePath } });
      return url;
    },
    onSuccess: (url) => {
      window.open(url, "_blank");
    },
    onError: (e: Error) => toast.error("Échec téléchargement", { description: e.message }),
  });

  const removeBackup = useMutation({
    mutationFn: (b: { id: string; file_path: string }) =>
      deleteFn({ data: { id: b.id, file_path: b.file_path } }),
    onSuccess: () => {
      toast.success("Sauvegarde supprimée");
      qc.invalidateQueries({ queryKey: ["backup_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const purgeOld = useMutation({
    mutationFn: (days: number) => purgeFn({ data: { retention_days: days } }),
    onSuccess: (r) => {
      toast.success(`${r.deleted} ancienne(s) sauvegarde(s) supprimée(s)`);
      qc.invalidateQueries({ queryKey: ["backup_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    logs: logsQuery.data ?? [],
    isLoading: logsQuery.isLoading,
    runBackup,
    downloadBackup,
    removeBackup,
    purgeOld,
  };
}
