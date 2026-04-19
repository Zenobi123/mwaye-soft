import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/hooks/quittances-mensuelles")({
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
        try { body = (await request.json()) as { mois?: string }; } catch { /* */ }
        const mois = body.mois ?? new Date().toISOString().slice(0, 10);

        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL!,
          token,
          { auth: { autoRefreshToken: false, persistSession: false } },
        );

        const { data, error } = await supabase.rpc("generer_quittances_mensuelles", { p_mois: mois });

        if (error) {
          console.error("generer_quittances_mensuelles error:", error);
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500, headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, count: data, mois }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
