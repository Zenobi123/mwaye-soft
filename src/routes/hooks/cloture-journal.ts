import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/hooks/cloture-journal")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        const token = auth?.replace("Bearer ", "");
        if (!token) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401, headers: { "Content-Type": "application/json" },
          });
        }

        let body: { date?: string } = {};
        try { body = (await request.json()) as { date?: string }; } catch { /* empty body */ }
        const targetDate = body.date ?? new Date().toISOString().slice(0, 10);

        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL!,
          token,
          { auth: { autoRefreshToken: false, persistSession: false } },
        );

        const { data, error } = await supabase.rpc("cloturer_journal_jour", { p_date: targetDate });

        if (error) {
          console.error("cloturer_journal_jour error:", error);
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500, headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, journal_id: data, date: targetDate }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
