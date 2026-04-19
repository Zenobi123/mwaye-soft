import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/hooks/bilan-mensuel")({
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

        let body: { mois?: string } = {};
        try { body = (await request.json()) as { mois?: string }; } catch { /* empty */ }

        // Default: previous month, first day
        let targetMois = body.mois;
        if (!targetMois) {
          const now = new Date();
          const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          targetMois = prev.toISOString().slice(0, 10);
        }

        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL!,
          token,
          { auth: { autoRefreshToken: false, persistSession: false } },
        );

        const { data, error } = await supabase.rpc("calculer_bilan_mensuel", { p_mois: targetMois });

        if (error) {
          console.error("calculer_bilan_mensuel error:", error);
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500, headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, bilan_id: data, mois: targetMois }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
