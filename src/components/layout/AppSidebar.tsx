import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Dumbbell,
  PartyPopper,
  Building2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Droplets,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/recettes", label: "Recettes", icon: ArrowDownCircle },
  { to: "/depenses", label: "Dépenses", icon: ArrowUpCircle },
  { to: "/salles-sport", label: "Salles de sport", icon: Dumbbell },
  { to: "/hammam", label: "Hammam", icon: Droplets },
  { to: "/evenements", label: "Événements", icon: PartyPopper },
  { to: "/appartements", label: "Appartements", icon: Building2 },
  { to: "/rapports", label: "Rapports", icon: BarChart3 },
  { to: "/parametres", label: "Paramètres", icon: Settings },
] as const;

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 relative",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
          GC
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold text-sidebar-foreground truncate">
              GestiComplex
            </h1>
            <p className="text-xs text-sidebar-foreground/50 truncate">
              Gestion commerciale
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
}
