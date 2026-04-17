import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User, ShieldAlert, Loader2, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { canAccessRoute } from "@/config/roleAccess";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const { roles, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const location = useLocation();

  // Persisté : préférence utilisateur de réduction du sidebar desktop
  const [collapsed, setCollapsed] = usePersistedState("sidebar:collapsed", false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ferme automatiquement le drawer mobile quand on change de route
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  // Spinner global d'initialisation
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const hasAccess = rolesLoading || canAccessRoute(location.pathname, roles);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Bouton hamburger mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="h-9 w-48 lg:w-64 rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {hasAccess ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Accès restreint</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Vous n'avez pas les droits nécessaires pour accéder à cette section. Contactez un administrateur pour obtenir les permissions requises.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
