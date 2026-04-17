import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Shield, Users, Bell, Building, Plus, X, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParametresData } from "@/hooks/useParametresData";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { BackButton } from "@/components/layout/BackButton";
import { InviteUserDialog } from "@/components/parametres/InviteUserDialog";

export const Route = createFileRoute("/parametres")({
  component: ParametresPage,
  head: () => ({
    meta: [
      { title: "Paramètres — MWAYE HOUSE" },
      { name: "description", content: "Configuration du système" },
    ],
  }),
});

function ParametresPage() {
  const { users, loading, fetchUsers, assignRole, removeRole, ALL_ROLES, ROLE_LABELS } = useParametresData();
  const { user: currentUser } = useAuth();
  const { isAdmin } = useUserRoles();
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({});

  const handleAssign = async (userId: string) => {
    const role = selectedRole[userId];
    if (!role) return;
    await assignRole(userId, role as any);
    setSelectedRole((prev) => ({ ...prev, [userId]: "" }));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-1">Configuration générale du système</p>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" />Utilisateurs</TabsTrigger>
            <TabsTrigger value="roles" className="gap-2"><Shield className="h-4 w-4" />Rôles</TabsTrigger>
            <TabsTrigger value="config" className="gap-2"><Building className="h-4 w-4" />Configuration</TabsTrigger>
          </TabsList>

          {/* ── Utilisateurs + Attribution des rôles ── */}
          <TabsContent value="users">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                <h3 className="text-sm font-semibold text-card-foreground">Gestion des utilisateurs et rôles</h3>
                {isAdmin && <InviteUserDialog onCreated={fetchUsers} />}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">Aucun utilisateur trouvé</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôles actuels</TableHead>
                      <TableHead>Attribuer un rôle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => {
                      const existingRoles = u.roles.map((r) => r.role);
                      const availableRoles = ALL_ROLES.filter((r) => !existingRoles.includes(r));

                      return (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            {u.full_name || "Sans nom"}
                            {u.user_id === currentUser?.id && (
                              <Badge variant="outline" className="ml-2 text-xs">Vous</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{u.phone || "—"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {u.roles.length === 0 && <span className="text-xs text-muted-foreground">Aucun</span>}
                              {u.roles.map((r) => (
                                <Badge key={r.id} variant="secondary" className="gap-1 text-xs">
                                  {ROLE_LABELS[r.role] ?? r.role}
                                  <button onClick={() => removeRole(r.id)} className="ml-0.5 hover:text-destructive">
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {availableRoles.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <Select
                                  value={selectedRole[u.user_id] ?? ""}
                                  onValueChange={(v) => setSelectedRole((p) => ({ ...p, [u.user_id]: v }))}
                                >
                                  <SelectTrigger className="w-[160px] h-8 text-xs">
                                    <SelectValue placeholder="Choisir…" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableRoles.map((r) => (
                                      <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button size="sm" variant="outline" className="h-8" onClick={() => handleAssign(u.user_id)} disabled={!selectedRole[u.user_id]}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Tous attribués</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ── Descriptif des rôles ── */}
          <TabsContent value="roles">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Rôles et privilèges</h3>
              <div className="space-y-3">
                {[
                  { role: "Administrateur", code: "admin", desc: "Accès complet à toutes les fonctionnalités", count: users.filter((u) => u.roles.some((r) => r.role === "admin")).length },
                  { role: "Directeur", code: "directeur", desc: "Supervision globale, rapports et paramètres", count: users.filter((u) => u.roles.some((r) => r.role === "directeur")).length },
                  { role: "Comptable", code: "comptable", desc: "Recettes, dépenses, journal de caisse, rapports financiers", count: users.filter((u) => u.roles.some((r) => r.role === "comptable")).length },
                  { role: "Resp. Sport", code: "resp_sport", desc: "Gestion des salles de sport, abonnements et séances", count: users.filter((u) => u.roles.some((r) => r.role === "resp_sport")).length },
                  { role: "Resp. Événement", code: "resp_evenement", desc: "Gestion des salles de fêtes et réservations", count: users.filter((u) => u.roles.some((r) => r.role === "resp_evenement")).length },
                  { role: "Resp. Immobilier", code: "resp_immobilier", desc: "Gestion des appartements et contrats de bail", count: users.filter((u) => u.roles.some((r) => r.role === "resp_immobilier")).length },
                  { role: "Caissier", code: "caissier", desc: "Enregistrement des recettes et entrées quotidiennes", count: users.filter((u) => u.roles.some((r) => r.role === "caissier")).length },
                ].map((r) => (
                  <div key={r.code} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{r.role}</p>
                      <p className="text-xs text-muted-foreground">{r.desc}</p>
                    </div>
                    <Badge variant="outline">{r.count} utilisateur(s)</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Configuration globale ── */}
          <TabsContent value="config">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Building, title: "Informations du complexe", description: "MWAYE HOUSE — Cameroun. Devise : F CFA" },
                { icon: Bell, title: "Notifications", description: "Alertes de paiement, rappels d'expiration, événements" },
              ].map((s) => (
                <div
                  key={s.title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
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

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm mt-4">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">Paramètres financiers</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Devise</span>
                  <span className="font-medium">F CFA</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">TVA applicable</span>
                  <span className="font-medium">19,25 %</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Pénalité retard loyer</span>
                  <span className="font-medium">10 % / mois</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Locale</span>
                  <span className="font-medium">fr-FR</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
