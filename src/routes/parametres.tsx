import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Shield, Users, Bell, Building } from "lucide-react";

export const Route = createFileRoute("/parametres")({
  component: ParametresPage,
  head: () => ({
    meta: [
      { title: "Paramètres — GestiComplex" },
      { name: "description", content: "Configuration du système" },
    ],
  }),
});

const sections = [
  {
    icon: Building,
    title: "Informations du complexe",
    description: "Nom, adresse, coordonnées et logo",
  },
  {
    icon: Users,
    title: "Gestion des utilisateurs",
    description: "Ajouter, modifier ou supprimer des comptes utilisateurs",
  },
  {
    icon: Shield,
    title: "Rôles et privilèges",
    description: "Configurer les droits d'accès : Admin, Gérant, Caissier, Comptable",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Alertes de paiement, rappels d'expiration, événements",
  },
];

function ParametresPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-1">Configuration générale du système</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <div
              key={s.title}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Rôles disponibles</h3>
          <div className="space-y-3">
            {[
              { role: "Administrateur", desc: "Accès complet à toutes les fonctionnalités", count: 1 },
              { role: "Gérant", desc: "Gestion des opérations quotidiennes, recettes et dépenses", count: 2 },
              { role: "Caissier", desc: "Enregistrement des recettes et des entrées", count: 3 },
              { role: "Comptable", desc: "Consultation des rapports et données financières", count: 1 },
            ].map((r) => (
              <div key={r.role} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{r.role}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground">{r.count} utilisateur(s)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
