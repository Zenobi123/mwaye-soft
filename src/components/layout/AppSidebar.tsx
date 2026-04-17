import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
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

  // Le contenu de la sidebar est partagé entre desktop et mobile (drawer)
  const renderNav = (isMobile: boolean) => (
    <>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
        <img
          src={logo}
          alt="MWAYE HOUSE"
          className={cn(
            "shrink-0 object-contain",
            collapsed && !isMobile ? "h-9 w-9" : "h-11 w-11"
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
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fermer le menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        <TooltipProvider delayDuration={150}>
          {visibleItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);

            const linkContent = (
              <Link
                key={item.to}
                to={item.to}
                onClick={isMobile ? onMobileClose : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {(!collapsed || isMobile) && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                  </>
                )}
              </Link>
            );

            // Tooltip uniquement en mode réduit desktop
            if (collapsed && !isMobile) {
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return linkContent;
          })}
        </TooltipProvider>
      </nav>

      {/* Pied : bouton de déconnexion */}
      <div className="border-t border-sidebar-border p-2">
        <TooltipProvider delayDuration={150}>
          {collapsed && !isMobile ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-3 px-3 py-2 rounded-md text-[13px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Se déconnecter</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-[13px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Se déconnecter</span>
            </button>
          )}
        </TooltipProvider>
      </div>
    </>
  );

  return (
    <>
      {/* === Desktop sidebar === */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 relative",
          collapsed ? "w-[68px]" : "w-[250px]"
        )}
      >
        {renderNav(false)}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground shadow-sm z-10"
          aria-label={collapsed ? "Étendre" : "Réduire"}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* === Mobile drawer === */}
      {mobileOpen && (
        <>
          <div
            onClick={onMobileClose}
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in"
            aria-hidden
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border animate-in slide-in-from-left">
            {renderNav(true)}
          </aside>
        </>
      )}
    </>
  );
}
