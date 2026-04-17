import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, LogOut, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/config/navigation";
import { canAccessRoute } from "@/config/roleAccess";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import logo from "@/assets/logo.png";

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/**
 * Dimensions normalisées (cf. spec) :
 *   - étendu : w-64 = 256 px
 *   - réduit : w-20 = 80 px
 *   - drawer mobile : w-64 = 256 px
 *   - icônes nav : 20×20 px (h-5 w-5)
 *   - icône action (Retour, chevron) : 16×16 px (h-4 w-4)
 *   - transition : 300 ms ease-in-out
 *   - z-index drawer / overlay : 50
 *   - breakpoint bascule : md (768 px)
 */
export function AppSidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { roles, loading: rolesLoading } = useUserRoles();

  const visibleItems = rolesLoading
    ? navItems
    : navItems.filter((item) => canAccessRoute(item.to, roles));

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const renderNav = (isMobile: boolean) => (
    <>
      {/* En-tête sidebar : p-4 (16 px) + bordure inférieure 1 px */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <img
          src={logo}
          alt="MWAYE HOUSE"
          className={cn(
            "shrink-0 object-contain",
            collapsed && !isMobile ? "h-9 w-9" : "h-10 w-10"
          )}
        />
        {(!collapsed || isMobile) && (
          <div className="overflow-hidden flex-1">
            <h1 className="text-sm font-bold text-foreground tracking-wide truncate">
              MWAYE HOUSE
            </h1>
            <p className="text-[11px] text-muted-foreground truncate">
              Gestion commerciale
            </p>
          </div>
        )}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation : py-4 (16 px), px-2 (8 px), space-y-1 (4 px) */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <TooltipProvider delayDuration={150}>
          {visibleItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);

            const linkContent = (
              <Link
                to={item.to}
                onClick={isMobile ? onMobileClose : undefined}
                className={cn(
                  // Hauteur ~40 px : py-2.5 (10×2) + ligne icône 20 px
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                  collapsed && !isMobile && "justify-center",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {/* Icônes de navigation : 20×20 px */}
                <item.icon className="h-5 w-5 shrink-0" />
                {(!collapsed || isMobile) && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {/* Chevron actif : 16×16 px */}
                    {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
                  </>
                )}
              </Link>
            );

            // Tooltip uniquement en mode réduit desktop, décalée à 56 px (left-14)
            if (collapsed && !isMobile) {
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8} className="text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return <div key={item.to}>{linkContent}</div>;
          })}
        </TooltipProvider>
      </nav>

      {/* Pied : p-4 (16 px) + bordure supérieure 1 px */}
      <div className="border-t border-sidebar-border p-4">
        <TooltipProvider delayDuration={150}>
          {collapsed && !isMobile ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-3 rounded-md py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} className="text-xs">
                Se déconnecter
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Se déconnecter</span>
            </button>
          )}
        </TooltipProvider>
      </div>
    </>
  );

  return (
    <>
      {/* === Desktop sidebar (≥768 px) === */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border relative",
          "transition-[width] duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {renderNav(false)}
        {/* Bouton bascule : ~36×36 px, p-2, icône 20×20 */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-16 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground shadow-sm z-10"
          aria-label={collapsed ? "Étendre la barre latérale" : "Réduire la barre latérale"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* === Mobile drawer (<768 px) === */}
      {mobileOpen && (
        <>
          {/* Backdrop : noir 50 %, z-50 */}
          <div
            onClick={onMobileClose}
            className="md:hidden fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300"
            aria-hidden
          />
          <aside
            className={cn(
              "md:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
              "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
              "animate-in slide-in-from-left duration-300 ease-in-out"
            )}
          >
            {renderNav(true)}
          </aside>
        </>
      )}
    </>
  );
}

/**
 * Bouton hamburger flottant pour mobile.
 * Position absolue top-3 left-3, p-2, icône 20×20 px.
 */
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex h-9 w-9 items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      aria-label="Ouvrir le menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
