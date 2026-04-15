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
  BookOpen,
  Users,
  FileText,
  Receipt,
  Package,
  UserCheck,
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
  { to: "/journal-caisse", label: "Journal de caisse", icon: BookOpen },
  { to: "/salles-sport", label: "Salles de sport", icon: Dumbbell },
  { to: "/hammam", label: "Hammam", icon: Droplets },
  { to: "/evenements", label: "Événements", icon: PartyPopper },
  { to: "/appartements", label: "Appartements", icon: Building2 },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/devis", label: "Devis", icon: FileText },
  { to: "/factures", label: "Factures", icon: Receipt },
  { to: "/stocks", label: "Stocks", icon: Package },
  { to: "/personnel", label: "Personnel", icon: UserCheck },
  { to: "/rapports", label: "Rapports", icon: BarChart3 },
  { to: "/parametres", label: "Paramètres", icon: Settings },
];
