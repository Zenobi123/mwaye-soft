import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * Maps each route to the roles that can access it.
 * "admin" and "directeur" have access to everything (handled in canAccess).
 * Routes not listed here are accessible to all authenticated users.
 */
export const ROUTE_ROLES: Record<string, AppRole[]> = {
  "/": [], // dashboard — everyone
  "/recettes": ["comptable", "caissier"],
  "/depenses": ["comptable", "caissier"],
  "/journal-caisse": ["comptable", "caissier"],
  "/salles-sport": ["resp_sport"],
  "/hammam": ["resp_sport"],
  "/evenements": ["resp_evenement"],
  "/appartements": ["resp_immobilier"],
  "/clients": ["comptable", "resp_evenement"],
  "/devis": ["comptable", "resp_evenement"],
  "/factures": ["comptable", "resp_evenement"],
  "/stocks": ["resp_sport", "resp_evenement", "resp_immobilier"],
  "/personnel": ["comptable"],
  "/rapports": ["comptable"],
  "/parametres": [], // admin-only (handled below)
};

/**
 * Check if user with given roles can access a route.
 * Admin and directeur can access everything.
 * If user has NO roles at all, they can access everything (new user / no restrictions applied yet).
 */
export function canAccessRoute(route: string, userRoles: AppRole[]): boolean {
  // No roles assigned = full access (graceful default for new setups)
  if (userRoles.length === 0) return true;

  // Admin and directeur see everything
  if (userRoles.includes("admin") || userRoles.includes("directeur")) return true;

  // Parametres is admin-only
  if (route === "/parametres") return false;

  const allowedRoles = ROUTE_ROLES[route];
  // Route not in map = accessible to all
  if (!allowedRoles || allowedRoles.length === 0) return true;

  return allowedRoles.some((r) => userRoles.includes(r));
}
