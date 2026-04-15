import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Trash2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientsData } from "@/hooks/useClientsData";
import { ClientForm } from "@/components/commercial/ClientForm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clients")({
  component: ClientsPage,
  head: () => ({
    meta: [
      { title: "Clients — MWAYE HOUSE" },
      { name: "description", content: "Gestion des clients" },
    ],
  }),
});

function ClientsPage() {
  const { clients, isLoading, addClient, deleteClient } = useClientsData();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clients</h1>
            <p className="text-sm text-muted-foreground mt-1">{clients.length} client(s) enregistré(s)</p>
          </div>
          <ClientForm onSubmit={(v) => addClient.mutate(v)} isPending={addClient.isPending} />
        </div>

        {clients.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun client. Ajoutez votre premier client.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-card-foreground">{c.nom}</h3>
                  <div className="flex items-center gap-1">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      c.type_client === "Entreprise" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>{c.type_client}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteClient.mutate(c.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
                {c.telephone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{c.telephone}</p>}
                {c.email && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" />{c.email}</p>}
                {c.adresse && <p className="text-xs text-muted-foreground mt-1">{c.adresse}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
