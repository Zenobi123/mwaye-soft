

# Plan d'implémentation complète — MWAYE HOUSE

## État actuel

| Module | Statut |
|--------|--------|
| Comptabilité (recettes, dépenses, journal caisse) | ✓ Connecté à la DB |
| Tableau de bord | ✓ Connecté à la DB |
| Auth + Profils + Rôles | ✓ Base en place |
| Salles de sport | Interface statique (données mockées) |
| Hammam | Interface statique (données mockées) |
| Événements | Interface statique (données mockées) |
| Appartements | Interface statique (données mockées) |
| Rapports | Interface statique (données mockées) |
| Paramètres | Interface statique (non fonctionnel) |
| Gestion commerciale (clients, devis, factures) | Non implémenté |
| Gestion stocks | Non implémenté |
| Gestion personnel | Non implémenté |

## Plan en 6 phases

### Phase 1 — Module Gestion Sportive
- **DB** : Tables `salles_sport`, `abonnements_sport`, `seances_sport`
- **UI** : Refonte de `/salles-sport` avec CRUD salles, formulaire ajout/renouvellement abonnés, liste des séances
- **RLS** : Lecture pour tous les authentifiés, écriture par user_id

### Phase 2 — Module Hammam + Événementiel + Immobilier
- **DB** : Tables `hammam_sections`, `hammam_entrees`, `salles_fetes`, `reservations_evenements`, `appartements`, `contrats_bail`
- **UI** : Refonte des 3 pages existantes avec formulaires CRUD connectés à la DB
- **RLS** : Même pattern que Phase 1

### Phase 3 — Module Gestion Commerciale
- **DB** : Tables `clients`, `devis`, `factures`, `lignes_facture`
- **UI** : Nouvelle page `/clients`, `/devis`, `/factures` avec génération de devis/factures
- **Navigation** : Ajout des entrées dans la sidebar

### Phase 4 — Module Stocks + Personnel
- **DB** : Tables `articles_stock`, `mouvements_stock`, `employes`, `presences`
- **UI** : Pages `/stocks` et `/personnel` avec formulaires
- **Navigation** : Ajout des entrées

### Phase 5 — Rapports dynamiques
- Connecter `/rapports` aux données réelles (agrégation des recettes/dépenses par période et catégorie)
- Export PDF/CSV des rapports

### Phase 6 — Paramètres fonctionnels
- Page `/parametres` avec gestion des utilisateurs, attribution des rôles, configuration TVA/pénalités

## Détails techniques

- Chaque phase crée les migrations SQL nécessaires avec RLS
- Les services (`*Service.ts`) et hooks (`use*.ts`) sont refactorisés pour interroger Supabase au lieu des données mockées
- Les formulaires utilisent les composants UI existants (Dialog, Form, Input, Select)
- Toutes les insertions incluent `user_id: auth.uid()` pour respecter les politiques RLS

## Approche

Vu l'ampleur du travail, je propose de procéder **phase par phase**, en commençant immédiatement par la **Phase 1 (Gestion Sportive)** puis en enchaînant sur les suivantes. Chaque phase sera livrée fonctionnelle avant de passer à la suivante.

