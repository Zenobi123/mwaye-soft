import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/hooks/penalites-rappels")({
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

        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL!,
          token,
          { auth: { autoRefreshToken: false, persistSession: false } },
        );

        const [pen, rap] = await Promise.all([
          supabase.rpc("appliquer_penalites_retard"),
          supabase.rpc("generer_rappels_echeance"),
        ]);

        if (pen.error || rap.error) {
          console.error("penalites/rappels error:", pen.error, rap.error);
          return new Response(JSON.stringify({
            success: false,
            error: pen.error?.message || rap.error?.message,
          }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({
          success: true,
          penalites_appliquees: pen.data,
          rappels_generes: rap.data,
        }), { headers: { "Content-Type": "application/json" } });
      },
    },
  },
});
