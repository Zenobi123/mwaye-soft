import { createFileRoute } from "@tanstack/react-router";
import { runDatabaseBackup, purgeOldBackups } from "@/server/backupDatabase.functions";

export const Route = createFileRoute("/api/public/hooks/monthly-backup")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const result = await runDatabaseBackup({ data: { type: "auto-mensuel" } });
          const purge = await purgeOldBackups({ data: { retention_days: 90 } });
          return new Response(
            JSON.stringify({ ...result, purged: purge.deleted }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (e) {
          return new Response(
            JSON.stringify({ success: false, error: (e as Error).message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
