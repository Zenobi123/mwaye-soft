import { useBackups } from "@/hooks/useBackups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Download, Trash2, Database, ShieldCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatBytes(b: number): string {
  if (b < 1024) return `${b} o`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} Ko`;
  return `${(b / (1024 * 1024)).toFixed(2)} Mo`;
}

const STATUS_COLORS: Record<string, string> = {
  succès: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  partiel: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  échec: "bg-destructive/15 text-destructive",
};

export function BackupsTab() {
  const { logs, isLoading, runBackup, downloadBackup, removeBackup, purgeOld } = useBackups();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">Stratégie de sauvegarde</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Export complet de la base au format JSON, stocké de manière sécurisée. Une sauvegarde
                automatique est créée le 1<sup>er</sup> de chaque mois. Rétention : 90 jours.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => purgeOld.mutate(90)}
              disabled={purgeOld.isPending}
              className="gap-2"
            >
              {purgeOld.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Purger &gt; 90 j
            </Button>
            <Button
              size="sm"
              onClick={() => runBackup.mutate()}
              disabled={runBackup.isPending}
              className="gap-2"
            >
              {runBackup.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              Lancer une sauvegarde
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Historique des sauvegardes</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            Aucune sauvegarde pour l'instant. Cliquez sur « Lancer une sauvegarde ».
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Tables</TableHead>
                <TableHead className="text-right">Lignes</TableHead>
                <TableHead className="text-right">Taille</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-xs">
                    {new Date(log.date_backup).toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {log.type_backup}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize ${STATUS_COLORS[log.statut] ?? ""}`}>
                      {log.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs">{log.tables_count}</TableCell>
                  <TableCell className="text-right text-xs">{log.rows_count.toLocaleString("fr-FR")}</TableCell>
                  <TableCell className="text-right text-xs">{formatBytes(log.file_size_bytes)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => downloadBackup.mutate(log.file_path)}
                        disabled={downloadBackup.isPending || log.statut === "échec"}
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cette sauvegarde ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Le fichier <span className="font-mono text-xs">{log.file_path}</span> sera
                              supprimé définitivement. Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeBackup.mutate({ id: log.id, file_path: log.file_path })}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
