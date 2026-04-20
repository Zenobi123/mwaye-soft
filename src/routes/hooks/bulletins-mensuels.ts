import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/hooks/bulletins-mensuels")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!auth) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });

        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL!,
          auth,
          { auth: { persistSession: false, autoRefreshToken: false } }
        );

        const mois = new Date();
        mois.setDate(1);
        const moisStr = mois.toISOString().slice(0, 10);

        const { data, error } = await supabase.rpc("generer_bulletins_mensuels", { p_mois: moisStr });
        if (error) {
          console.error("[bulletins-mensuels] err", error);
          return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
        }
        return new Response(JSON.stringify({ ok: true, generated: data, mois: moisStr }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
