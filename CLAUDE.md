# MWAYE HOUSE — guide projet

Application de gestion commerciale (sport, hammam, événements, immobilier,
comptabilité) déployée via Lovable.dev. Backend Supabase, front React 19
+ TanStack Start/Router/Query, UI shadcn/ui.

## Architecture

- `src/routes/*.tsx` — pages TanStack Router (file-based)
- `src/routes/hooks/*.ts` — handlers HTTP serveur (RPC scheduling)
- `src/hooks/useXxxxData.ts` — hooks React Query par module (source unique de fetch + mutation)
- `src/components/<module>/*` — formulaires et tabs spécifiques métier
- `src/components/ui/*` — composants shadcn/ui (ne pas y toucher pour de la logique métier)
- `src/services/*` — services utilitaires (export PDF/Excel, audit, paie). Pas de mocks.
- `src/integrations/supabase/types.ts` — généré par Supabase, ne pas éditer à la main
- `src/config/{navigation,roleAccess,app}.ts` — source de vérité de l'IA (modules, rôles, formats)

## Conventions strictes

1. **Pas de mocks ni de fixtures statiques.** Toutes les vues s'alimentent
   sur Supabase via un hook `useXxxxData` (React Query) — pas de `setState`
   + `useEffect` + `supabase.from(...)` inline dans une route.
2. **Une mutation = une invalidation de cache.** Toute mutation doit
   `invalidateQueries({ queryKey: [...] })` sur sa propre clé ET sur
   `["dashboard"]` si elle impacte les KPI.
3. **Fichiers UI shadcn (`src/components/ui/`) intouchables** sauf si l'utilisateur
   le demande explicitement.
4. **Pas de `// @ts-nocheck`** : si TypeScript se plaint, corrige le typage
   (ajoute un cast étroit `(e as { salles_fetes?: { nom: string } | null })`
   plutôt qu'un `any` ou un nocheck).
5. **Ne jamais réintroduire** : `src/types/*.ts`, `src/services/{recetteService,depenseService,hammamService,sportService,evenementService,appartementService,dashboardService}.ts`, ou les hooks legacy `useRecettes`/`useDepenses`/`useHammam`/`useSport`/`useEvenements`/`useAppartements`/`useDashboard`. Tous supprimés volontairement.
6. **Labels UI en français**, montants formatés via `formatAmount()` de `src/config/app.ts` (`F CFA`).

## Mapping module → table(s) Supabase

| Module | Hook | Tables |
|---|---|---|
| Dashboard | `useDashboardData` | recettes, depenses, salles_sport, hammam_sections, salles_fetes, reservations_evenements |
| Recettes | `useRecettesData` | recettes |
| Dépenses | `useDepensesData` | depenses |
| Journal caisse | `useJournalCaisseData` | journal_caisse (+ RPC `cloturer_journal_jour`) |
| Sport | `useSportData` | salles_sport, abonnements_sport, seances_sport |
| Hammam | `useHammamData` | hammam_sections, hammam_entrees |
| Événements | `useEvenementsData` | salles_fetes, reservations_evenements |
| Appartements | `useAppartementsData` + `useImmobilier` | appartements, contrats_bail, quittances, etats_lieux, rappels_echeance |
| Clients | `useClientsData` | clients |
| Devis | `useDevisData` | devis, lignes_document |
| Factures | `useFacturesData` | factures, lignes_document |
| Stocks | `useStocksData` | articles_stock, mouvements_stock |
| Personnel | `usePersonnelData` + `usePaie` + `useConges` + `usePlannings` | employes, presences, bulletins_paie, conges, plannings |
| Rapports | `useRapportsData` + `useBilansMensuels` + `useComparaisonMensuelle` | recettes, depenses, bilans_mensuels |
| Paramètres | `useParametresData` + `useAppSettings` + `useAuditLogs` | profiles, user_roles, app_settings, audit_logs |

## Rôles et accès

7 rôles définis dans `app_role` (DB) et mappés dans `src/config/roleAccess.ts` :
`admin`, `directeur`, `comptable`, `resp_sport`, `resp_evenement`, `resp_immobilier`, `caissier`.
- `admin` et `directeur` : accès total.
- Utilisateur sans rôle assigné : accès total (graceful default).
- `/parametres` : admin uniquement.

## Workflow git

- Branche de travail désignée par session : `claude/<topic>-<id>`.
- Fusion `squash` vers `main` autorisée pour les PR créées dans la session.
- Conflits sur `useDashboardData.ts` ou tout fichier réécrit en React Query :
  conserver la version React Query, jeter les `// @ts-nocheck` ou les
  versions `useState/useEffect` inline.
- Ne jamais toucher aux migrations Supabase (`supabase/migrations/`) sans demande explicite.

## Commandes utiles

```bash
bun install         # parfois bloqué en sandbox (registry 403) — déléguer à Lovable
bun run dev         # dev server
bun run build       # build prod
bun run lint        # eslint
```

## Validation post-PR

`tsc` et `bun run build` ne tournent pas dans le sandbox de développement
faute de `node_modules` — la validation finale se fait sur Lovable.dev
après merge sur `main`.
