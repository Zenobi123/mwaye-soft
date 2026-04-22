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
  group: string;
}

export const navItems: NavItem[] = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, group: "Accueil" },
  { to: "/recettes", label: "Recettes", icon: ArrowDownCircle, group: "Comptabilité" },
  { to: "/depenses", label: "Dépenses", icon: ArrowUpCircle, group: "Comptabilité" },
  { to: "/journal-caisse", label: "Journal de caisse", icon: BookOpen, group: "Comptabilité" },
  { to: "/salles-sport", label: "Salles de sport", icon: Dumbbell, group: "Activités" },
  { to: "/hammam", label: "Hammam", icon: Droplets, group: "Activités" },
  { to: "/evenements", label: "Événements", icon: PartyPopper, group: "Activités" },
  { to: "/appartements", label: "Appartements", icon: Building2, group: "Immobilier" },
  { to: "/clients", label: "Clients", icon: Users, group: "Commercial" },
  { to: "/devis", label: "Devis", icon: FileText, group: "Commercial" },
  { to: "/factures", label: "Factures", icon: Receipt, group: "Commercial" },
  { to: "/stocks", label: "Stocks", icon: Package, group: "Gestion" },
  { to: "/personnel", label: "Personnel", icon: UserCheck, group: "Gestion" },
  { to: "/rapports", label: "Rapports", icon: BarChart3, group: "Admin" },
  { to: "/parametres", label: "Paramètres", icon: Settings, group: "Admin" },
];

export function getNavGroups(items: NavItem[]): { group: string; items: NavItem[] }[] {
  const order = ["Accueil", "Comptabilité", "Activités", "Immobilier", "Commercial", "Gestion", "Admin"];
  const map = new Map<string, NavItem[]>();
  for (const item of items) {
    if (!map.has(item.group)) map.set(item.group, []);
    map.get(item.group)!.push(item);
  }
  return order.filter((g) => map.has(g)).map((g) => ({ group: g, items: map.get(g)! }));
}
