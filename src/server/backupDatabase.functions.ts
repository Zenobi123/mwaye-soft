import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const TABLES = [
  "profiles",
  "user_roles",
  "app_settings",
  "audit_logs",
  "recettes",
  "depenses",
  "journal_caisse",
  "bilans_mensuels",
  "clients",
  "devis",
  "factures",
  "lignes_document",
  "salles_sport",
  "abonnements_sport",
  "hammam_sections",
  "hammam_entrees",
  "salles_fetes",
  "reservations_evenements",
  "appartements",
  "contrats_bail",
  "quittances",
  "etats_lieux",
  "rappels_echeance",
  "articles_stock",
  "lots_stock",
  "mouvements_stock",
  "inventaires",
  "inventaire_lignes",
  "employes",
  "presences",
  "bulletins_paie",
  "conges",
  "plannings",
] as const;

export const runDatabaseBackup = createServerFn({ method: "POST" })
  .inputValidator((input: { type?: string } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const typeBackup = data?.type ?? "manuel";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = `backup-${timestamp}.json`;

    const dump: Record<string, unknown[]> = {};
    let totalRows = 0;
    let tablesCount = 0;
    const errors: string[] = [];

    for (const table of TABLES) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: rows, error } = await (supabaseAdmin as any)
          .from(table)
          .select("*");
        if (error) {
          errors.push(`${table}: ${error.message}`);
          continue;
        }
        dump[table] = rows ?? [];
        totalRows += (rows ?? []).length;
        tablesCount += 1;
      } catch (e) {
        errors.push(`${table}: ${(e as Error).message}`);
      }
    }

    const payload = {
      version: 1,
      generated_at: new Date().toISOString(),
      tables_count: tablesCount,
      rows_count: totalRows,
      data: dump,
    };

    const fileBuffer = new TextEncoder().encode(JSON.stringify(payload));
    const fileSize = fileBuffer.byteLength;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("backups")
      .upload(filePath, fileBuffer, {
        contentType: "application/json",
        upsert: false,
      });

    const statut = uploadError ? "échec" : errors.length > 0 ? "partiel" : "succès";
    const observations = [
      uploadError ? `Upload: ${uploadError.message}` : null,
      errors.length > 0 ? `Erreurs: ${errors.join(" | ")}` : null,
    ]
      .filter(Boolean)
      .join(" • ") || null;

    await supabaseAdmin.from("backup_logs").insert({
      file_path: filePath,
      file_size_bytes: uploadError ? 0 : fileSize,
      tables_count: tablesCount,
      rows_count: totalRows,
      type_backup: typeBackup,
      statut,
      observations,
    });

    if (uploadError) {
      throw new Error(`Échec upload: ${uploadError.message}`);
    }

    return {
      success: true,
      file_path: filePath,
      file_size_bytes: fileSize,
      tables_count: tablesCount,
      rows_count: totalRows,
      statut,
    };
  });

export const getBackupDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((input: { file_path: string }) => input)
  .handler(async ({ data }) => {
    const { data: signed, error } = await supabaseAdmin.storage
      .from("backups")
      .createSignedUrl(data.file_path, 60 * 5);
    if (error || !signed) {
      throw new Error(error?.message ?? "URL non générée");
    }
    return { url: signed.signedUrl };
  });

export const deleteBackup = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; file_path: string }) => input)
  .handler(async ({ data }) => {
    await supabaseAdmin.storage.from("backups").remove([data.file_path]);
    await supabaseAdmin.from("backup_logs").delete().eq("id", data.id);
    return { success: true };
  });

export const purgeOldBackups = createServerFn({ method: "POST" })
  .inputValidator((input: { retention_days?: number } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const days = data?.retention_days ?? 90;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: oldLogs } = await supabaseAdmin
      .from("backup_logs")
      .select("id, file_path")
      .lt("date_backup", cutoff);

    if (oldLogs && oldLogs.length > 0) {
      const paths = oldLogs.map((l) => l.file_path);
      await supabaseAdmin.storage.from("backups").remove(paths);
      await supabaseAdmin
        .from("backup_logs")
        .delete()
        .in(
          "id",
          oldLogs.map((l) => l.id)
        );
    }

    return { deleted: oldLogs?.length ?? 0 };
  });
