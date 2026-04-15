import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Dumbbell,
  PartyPopper,
  Building2,
  BarChart3,
  Settings,
  Droplets,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/recettes", label: "Recettes", icon: ArrowDownCircle },
  { to: "/depenses", label: "Dépenses", icon: ArrowUpCircle },
  { to: "/salles-sport", label: "Salles de sport", icon: Dumbbell },
  { to: "/hammam", label: "Hammam", icon: Droplets },
  { to: "/evenements", label: "Événements", icon: PartyPopper },
  { to: "/appartements", label: "Appartements", icon: Building2 },
  { to: "/rapports", label: "Rapports", icon: BarChart3 },
  { to: "/parametres", label: "Paramètres", icon: Settings },
];
