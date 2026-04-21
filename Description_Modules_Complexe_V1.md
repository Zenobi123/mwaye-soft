# Description Détaillée des Modules Fonctionnels
## Application de Gestion de Complexe Multi-Activités

> **Référence :** CDC-COMPLEXE-MODULES-V1.0  
> **Version :** 1.0 — Avril 2026  
> **Auteur :** PRISMA GESTION — Direction Associée  
> **Statut :** Document de référence fonctionnelle

---

## Introduction

Le présent document constitue le volet descriptif approfondi du Cahier des Charges de l'application de gestion du complexe multi-activités. Il détaille, module par module, l'ensemble des fonctionnalités attendues, les données manipulées, les règles de gestion, les interfaces utilisateurs, les flux de traitement et les interactions entre modules.

Chaque module est décrit de façon exhaustive afin de permettre aux équipes de développement de comprendre précisément les attentes fonctionnelles, sans ambiguïté. Cette description servira également de base pour la recette fonctionnelle lors de la validation du livrable final.

### Vue d'ensemble des 10 modules

| N° | Module | Rôle principal dans le système |
|----|--------|-------------------------------|
| 01 | 🏋️ Gestion Sportive | Adhérents, abonnements, présences, planning cours, hammam, spa |
| 02 | 🎉 Gestion Événementielle | Réservations salles de fêtes, devis, contrats, facturation événements |
| 03 | 🏠 Gestion Immobilière | Appartements, locataires, baux, loyers, états des lieux, maintenance |
| 04 | 💰 Comptabilité & Finances | Recettes, dépenses, caisse, journal comptable, bilans |
| 05 | 📊 Reporting & Tableaux de bord | Rapports quotidiens, hebdo, mensuels, KPIs, exports PDF/Excel |
| 06 | 📦 Gestion des Stocks | Articles, mouvements, fournisseurs, alertes, inventaires |
| 07 | 👥 Gestion du Personnel | Employés, plannings, présences, congés, paie, charges CNPS |
| 08 | 🤝 Gestion Commerciale | Clients, tarifs, devis, factures, encaissements, fidélité |
| 09 | 🔒 Sécurité & Audit | Authentification, rôles, journaux d'audit, sauvegardes |
| 10 | ⚙️ Paramétrage Général | Configuration système, tarifs, taxes, notifications, sauvegarde |

---

## MODULE 01 — GESTION SPORTIVE
*Adhérents · Abonnements · Cours · Hammam · Spa · Contrôle d'accès*

### 1.1 Présentation et Objectifs du Module

Le module de Gestion Sportive est le premier pilier opérationnel de l'application. Il centralise toutes les activités liées à la pratique sportive au sein du complexe : la gestion des adhérents, la vente et le suivi des abonnements, la planification des cours collectifs, la gestion des espaces de bien-être (hammam, spa), et le contrôle des entrées et sorties.

Ce module est utilisé quotidiennement par les agents d'accueil, les responsables sportifs et les coachs. Il doit être rapide, intuitif et fiable, car il constitue le premier point de contact entre le complexe et ses membres.

---

### 1.2 Gestion des Membres

#### 1.2.1 Création et Gestion de la Fiche Membre

Chaque personne souhaitant accéder aux installations sportives fait l'objet d'une fiche membre complète et unique dans le système. Cette fiche est le référentiel central de toutes les interactions du membre avec le complexe.

- **Numéro de membre** : généré automatiquement par le système, unique et non modifiable
- **Identité complète** : nom, prénom, date de naissance, genre, nationalité
- **Photo du membre** : capturée via webcam ou importée depuis fichier
- **Coordonnées** : adresse postale, numéro de téléphone principal et secondaire, email
- **Situation professionnelle** (optionnel) : employeur, profession
- **Informations médicales de base** : contre-indications connues, pathologies déclarées
- **Objectifs sportifs déclarés** : perte de poids, prise de masse, cardio, bien-être, etc.
- **Contact d'urgence** : nom, relation, numéro de téléphone
- **Pièce d'identité** : numéro, type (CNI, passeport), date d'expiration
- **Date d'inscription** et date de première visite
- **Statut du compte** : Actif, Suspendu, Expiré, Bloqué

#### 1.2.2 Historique et Suivi du Membre

La fiche membre agrège l'ensemble des informations historiques permettant un suivi complet et longitudinal du parcours du client au sein du complexe.

- Historique de tous les abonnements souscrits (dates, tarifs, modes de paiement)
- Journal des présences : chaque entrée et sortie horodatée
- Historique des cours collectifs auxquels le membre a participé
- Historique des prestations bien-être (hammam, massage, spa)
- Historique des paiements et des éventuels impayés
- Réclamations et incidents enregistrés
- Notes internes ajoutées par le personnel
- Statistiques de fréquentation : nombre de visites par mois, jours préférés, créneaux habituels

---

### 1.3 Gestion des Abonnements

#### 1.3.1 Types et Formules d'Abonnements

Le système gère un catalogue d'abonnements entièrement paramétrable par l'administrateur. Chaque formule peut être combinée avec des options supplémentaires.

| Formule | Durée | Prix de base | Remise | Services inclus |
|---------|-------|-------------|--------|-----------------|
| Pass Séance | 1 séance | Variable | — | Accès à 1 espace au choix |
| Pass Journée | 1 journée | Variable | — | Accès illimité espaces sur 1 jour |
| Mensuel Standard | 30 jours | Paramétrable | — | Salle de sport + Hammam |
| Mensuel Premium | 30 jours | Paramétrable | — | Salle + Hammam + Cours collectifs + Spa |
| Trimestriel | 90 jours | Auto-calculé | **10%** | Au choix selon formule |
| Semestriel | 180 jours | Auto-calculé | **15%** | Au choix selon formule |
| Annuel | 365 jours | Auto-calculé | **20%** | Accès VIP complet |
| Entreprise | Sur mesure | Négocié | Sur devis | Groupe d'employés — tarifs dégressifs |
| Famille | 30/90/180j | Auto-calculé | Dégressive | Jusqu'à 4 membres d'une même famille |

#### 1.3.2 Processus de Souscription d'un Abonnement

1. Identification du membre (existant) ou création d'une nouvelle fiche
2. Sélection de la formule d'abonnement souhaitée
3. Application automatique des éventuelles remises (fidélité, promotion en cours)
4. Calcul du montant à régler, sélection du mode de paiement
5. Enregistrement du paiement et génération automatique du reçu
6. Activation immédiate de l'abonnement dans le système
7. Impression ou envoi par email de la carte/badge membre mis à jour

#### 1.3.3 Gestion des Renouvellements et Alertes

Le système anticipe proactivement les expirations pour garantir la continuité des abonnements et maximiser le taux de renouvellement.

- Alerte automatique à **J-15, J-7 et J-1** avant la date d'expiration (liste dans le tableau de bord)
- Notification par SMS et/ou email envoyée au membre (configurable)
- Renouvellement en un clic depuis la fiche membre, avec pré-remplissage de la formule actuelle
- Calcul automatique du prorata si renouvellement anticipé (avant la date d'expiration)
- Option de renouvellement automatique mensuel (prélèvement ou rappel de paiement)
- Rapport hebdomadaire des abonnements arrivant à expiration dans les 15 jours

---

### 1.4 Contrôle d'Accès et Gestion des Présences

#### 1.4.1 Enregistrement des Entrées

L'enregistrement des entrées constitue le premier point de contrôle opérationnel. Il garantit que seuls les membres disposant d'un abonnement valide accèdent aux installations.

- Recherche rapide du membre par nom, prénom, numéro de membre ou scan de badge
- Vérification instantanée de la validité de l'abonnement (statut, date d'expiration)
- Affichage en temps réel du statut : 🟢 vert (valide), 🟠 orange (expire bientôt), 🔴 rouge (expiré/bloqué)
- Horodatage automatique de chaque entrée (date et heure au format précis)
- Alerte sonore et visuelle si le membre n'a pas d'abonnement valide
- Compteur en temps réel du nombre de personnes présentes dans chaque espace
- Enregistrement de la sortie pour calcul de la durée de présence

#### 1.4.2 Statistiques de Fréquentation

Les données de présence alimentent automatiquement les rapports de fréquentation, essentiels pour optimiser les plannings et les ressources humaines.

- Courbe de fréquentation par jour de la semaine et par tranche horaire
- Identification des pics et creux d'affluence
- Classement des membres par fréquentation (top membres fidèles)
- Détection des membres inactifs depuis X jours (relance possible)
- Rapport de fréquentation comparative : semaine en cours vs semaine précédente

---

### 1.5 Planning des Cours Collectifs

#### 1.5.1 Paramétrage des Cours

- Création de cours avec : nom, description, durée, niveau (débutant/intermédiaire/avancé)
- Affectation d'un coach ou instructeur responsable du cours
- Définition de la salle ou de l'espace dédié (avec vérification de disponibilité)
- Capacité maximale : nombre de places disponibles par séance
- Équipement requis : liste du matériel nécessaire (tapis, haltères, etc.)

#### 1.5.2 Planification et Réservation

- Calendrier hebdomadaire configurable (lundi au dimanche, 06h00 à 22h00)
- Affichage clair des créneaux disponibles, complets et annulés
- Réservation d'un cours par le membre (via l'agent d'accueil ou futur portail en ligne)
- Liste de réservations par cours avec noms des participants
- Gestion de la liste d'attente : inscription automatique si le cours est complet
- Notification aux membres en liste d'attente si une place se libère
- Rappel automatique 24h avant le cours par SMS/email
- Annulation par le membre : délai minimum configurable (ex : 2h avant)
- Suivi des absences aux cours réservés — impact sur le score de fiabilité

---

### 1.6 Gestion du Hammam et du Spa

#### 1.6.1 Organisation des Sessions

- Définition des créneaux : sessions hommes, femmes, mixtes, ou sur réservation exclusive
- Durée de chaque session (ex : 1h30 standard, 2h week-end)
- Capacité maximale par session (en fonction de la superficie)
- Tarification spécifique : inclus dans certains abonnements, payant pour d'autres

#### 1.6.2 Prestations Additionnelles

- Catalogue des soins proposés : gommage, massage, soin du visage, enveloppement
- Tarification individuelle de chaque soin
- Réservation d'un soin associé à une session hammam
- Affectation d'un praticien à chaque soin
- Facturation automatique en fin de session
- Suivi des produits consommés par prestation (lien avec module stocks)

---

## MODULE 02 — GESTION ÉVÉNEMENTIELLE
*Salles de fêtes · Réservations · Devis · Contrats · Facturation*

### 2.1 Présentation et Objectifs

Le module Événementiel gère l'intégralité du cycle commercial et opérationnel lié à la location des salles de fêtes et à l'organisation d'événements au sein du complexe. Il couvre la prospection commerciale, l'établissement de devis, la signature de contrats, la gestion des acomptes et soldes, jusqu'à la clôture financière post-événement.

Ce module est stratégique car les événements (mariages, baptêmes, anniversaires, séminaires, conférences) représentent souvent la principale source de revenus ponctuels et les montants facturés sont élevés. Une gestion rigoureuse est donc indispensable pour éviter les conflits de réservation, les pertes de revenus et les litiges contractuels.

---

### 2.2 Gestion des Espaces Événementiels

#### 2.2.1 Fiche Détaillée de Chaque Espace

Chaque salle ou espace événementiel dispose d'une fiche de référence exhaustive dans le système.

| Attribut | Description |
|----------|-------------|
| **Identifiant** | Code unique et nom commercial de l'espace (ex : Salle Prestige A) |
| **Capacités** | Nombre de places : assis en table ronde, assis en U, cocktail debout, banquet |
| **Dimensions** | Surface en m², hauteur sous plafond, dimensions longueur x largeur |
| **Équipements fixes** | Scène, système de sonorisation, éclairage ambiance, climatisation, wifi, bar intégré |
| **Équipements optionnels** | Vidéoprojecteur, écran LED, décoration de base, chaises de cérémonie, tables rondes |
| **Tarification** | Tarif par heure, demi-journée (4h), journée (8h), soirée (18h-00h), week-end complet |
| **Conditions** | Acompte requis, délai d'annulation, règlement intérieur, horaires d'accès |
| **Médias** | Photos haute résolution, plan d'aménagement, visite virtuelle (lien externe) |
| **Disponibilité** | Statut en temps réel visible sur le calendrier central |

---

### 2.3 Calendrier Central des Réservations

#### 2.3.1 Fonctionnement du Calendrier

Le calendrier constitue l'outil central de pilotage du module événementiel. Il offre une vision globale et instantanée de l'occupation de tous les espaces.

- **Vue mensuelle** : aperçu global des événements du mois, code couleur par salle
- **Vue hebdomadaire** : détail jour par jour avec les créneaux horaires
- **Vue journalière** : timeline heure par heure pour chaque espace
- **Affichage superposé multi-salles** : voir simultanément toutes les salles
- **Code couleur des statuts** :
  - 🔵 Bleu → Option / Tentative
  - 🟢 Vert → Confirmé
  - ⚫ Gris → Annulé
  - 🔴 Rouge → Litige
- Clic sur un événement : affichage d'une fiche récapitulative (client, type, montant, statut paiement)
- Détection automatique des conflits : impossibilité de créer deux réservations simultanées pour le même espace
- Vue agenda : liste chronologique des prochains événements avec filtres

---

### 2.4 Processus Complet de Réservation

#### 2.4.1 Étape 1 — Demande et Vérification de Disponibilité

- Saisie de la date souhaitée, du type d'événement, du nombre de personnes estimé
- Vérification instantanée de la disponibilité sur le calendrier
- Si disponible : création d'une **option** (réservation provisoire) avec durée limitée (ex : 5 jours)
- Si non disponible : proposition de dates alternatives proches

#### 2.4.2 Étape 2 — Établissement du Devis

- Sélection de la salle, des créneaux horaires et des services inclus
- Ajout des options : traiteur partenaire, sono, vidéoprojecteur, décoration, personnel d'accueil
- Calcul automatique du montant HT, des taxes applicables et du TTC
- Conditions de paiement : pourcentage d'acompte requis, délai du solde
- Clauses de pénalité d'annulation (J-30, J-15, J-7 : % configurable)
- Génération du devis en PDF avec logo et coordonnées du complexe
- Envoi du devis par email directement depuis l'application
- Durée de validité du devis (ex : 15 jours)

#### 2.4.3 Étape 3 — Confirmation et Contrat

- Validation du devis par le client (signature ou accusé de réception)
- Génération automatique du contrat de location avec toutes les clauses
- Champs auto-remplis : identité client, salle, dates, montants, conditions
- Signature numérique ou impression pour signature manuscrite
- Archivage du contrat signé en format PDF dans le dossier client

#### 2.4.4 Étape 4 — Acompte et Facturation

- Enregistrement de l'acompte reçu avec génération du reçu correspondant
- Calcul automatique du solde restant à percevoir
- Rappel automatique du solde à **J-7 et J-2** avant l'événement
- Encaissement du solde et génération de la facture finale
- Gestion des avoirs en cas d'annulation partielle ou totale

---

### 2.5 Gestion des Prestataires Partenaires

- Annuaire des prestataires : traiteurs, orchestres, DJs, décorateurs, photographes, agents de sécurité
- Fiche prestataire : nom, spécialité, coordonnées, tarifs indicatifs, évaluation
- Affectation d'un ou plusieurs prestataires à un événement
- Contrat de prestation généré et archivé
- Suivi des règlements aux prestataires (lié au module dépenses)
- Évaluation post-événement : notation de 1 à 5, commentaires
- Rapport sur les prestataires les plus performants

---

## MODULE 03 — GESTION IMMOBILIÈRE
*Appartements · Locataires · Baux · Loyers · Maintenance · États des lieux*

### 3.1 Présentation et Objectifs

Le module Immobilier assure la gestion professionnelle et complète du parc de locations du complexe. Il couvre aussi bien les appartements meublés (courte ou longue durée) que les appartements non meublés (bail résidentiel standard). Il gère l'intégralité du cycle locatif : de la mise en location du bien jusqu'à la restitution du dépôt de garantie, en passant par la facturation mensuelle des loyers et le suivi de la maintenance.

---

### 3.2 Gestion du Parc Immobilier

#### 3.2.1 Fiche Complète d'un Appartement

| Champ | Description détaillée |
|-------|----------------------|
| **Identifiant** | Code unique (ex : APT-M01 pour meublé n°1, APT-NM03 pour non-meublé n°3) |
| **Type** | Meublé / Non meublé — Studio / F1 / F2 / F3 / Duplex / Penthouse |
| **Localisation** | Bâtiment, étage, numéro de porte, exposition (Est/Ouest/Nord/Sud) |
| **Superficie** | Surface habitable en m², surface du balcon/terrasse |
| **Composition** | Nombre de pièces, chambres, salles de bain, WC |
| **Équipements** | Climatisation, chauffe-eau, cuisine équipée, groupe électrogène, parking, ascenseur |
| **Inventaire mobilier** | Pour appartements meublés : liste détaillée de chaque meuble et équipement |
| **Loyer de référence** | Loyer mensuel de base, charges locatives, montant du dépôt de garantie |
| **Statut** | Disponible / Loué (avec nom du locataire) / En travaux / Réservé |
| **Documents** | Photos, plan, attestation de conformité, certificat d'assurance du bâtiment |

#### 3.2.2 Tableau de Bord du Parc

- Vue synthétique de tous les appartements avec leur statut en temps réel
- Taux d'occupation global et par type de logement
- Liste des appartements disponibles à louer immédiatement
- Liste des appartements en cours de travaux avec date prévisionnelle de disponibilité
- Revenus locatifs attendus vs revenus effectivement encaissés

---

### 3.3 Gestion des Locataires

#### 3.3.1 Fiche Locataire

- Identité complète : nom, prénom, date et lieu de naissance
- Pièce d'identité : type, numéro, date d'expiration, copie numérisée
- Coordonnées : téléphone, email, adresse professionnelle
- Situation professionnelle : employeur, poste, revenus déclarés
- Garant(s) : identité, relation, justificatifs de solvabilité
- Historique des locations précédentes dans le complexe
- Score de fiabilité calculé par le système (basé sur paiements à temps, respect des lieux)

---

### 3.4 Gestion des Baux et Contrats de Location

#### 3.4.1 Création du Bail

Le système génère automatiquement le contrat de bail selon le modèle adapté au type de logement (meublé ou non meublé), en intégrant toutes les données saisies.

- Type de bail : résidentiel non meublé (longue durée), meublé (longue durée), saisonnier
- Date de début et durée initiale (1 an renouvelable, 3 ans, ou sur mesure)
- Loyer mensuel, montant des charges et leur nature (eau, électricité, gardiennage)
- Dépôt de garantie : montant, mode de conservation, conditions de restitution
- Indexation annuelle du loyer : base de calcul et plafond
- Clauses spécifiques : interdiction de sous-location, présence d'animaux, travaux autorisés
- Préavis de résiliation : durée requise pour le locataire et pour le bailleur
- Génération du contrat en PDF pour impression et signature
- Archivage sécurisé du contrat signé dans le système

#### 3.4.2 État des Lieux

- Formulaire numérique d'état des lieux d'entrée : pièce par pièce, élément par élément
- Possibilité d'ajouter des photos directement depuis l'interface (tablette/smartphone)
- Notation de l'état de chaque élément : **Neuf / Bon / Correct / Usé / Endommagé**
- Relevé des compteurs (eau, électricité) à l'entrée et à la sortie
- Inventaire contradictoire du mobilier pour les meublés
- Génération du document d'état des lieux en PDF signé par les deux parties
- État des lieux de sortie : comparaison automatique avec l'état d'entrée
- Calcul automatique des retenues sur dépôt de garantie selon les dégradations constatées

---

### 3.5 Gestion des Loyers

#### 3.5.1 Facturation Automatique

- Génération automatique des quittances de loyer chaque mois (date configurable)
- Calcul automatique : loyer + charges + éventuels arriérés ou ajustements
- Numérotation séquentielle des quittances
- Envoi automatique par email ou SMS au locataire
- Impression des quittances sur demande

#### 3.5.2 Suivi des Paiements et Relances

- Enregistrement du paiement avec date, montant, mode de règlement, référence
- Statut automatique : **Payé / Partiellement payé / Impayé / En retard**
- Calcul des pénalités de retard selon les termes du bail
- Alerte automatique à **J+5** : notification interne à l'équipe de gestion
- Relance automatique au locataire à **J+5, J+15, J+30** (email et/ou SMS)
- Génération de mise en demeure formelle si impayé supérieur à 30 jours
- Tableau de bord des impayés : montant total, nombre de locataires concernés, ancienneté

---

### 3.6 Gestion de la Maintenance

- Formulaire de demande d'intervention : nature du problème, urgence, localisation
- Affectation à un technicien interne ou un prestataire externe
- Suivi du statut : **En attente / En cours / Terminé / Facturé**
- Enregistrement du coût de chaque intervention (lié au module dépenses)
- Évaluation de la qualité de l'intervention
- Historique complet des interventions par appartement sur toute la durée de vie
- Rapport de maintenance mensuel : coûts, types d'intervention, prestataires utilisés

---

## MODULE 04 — COMPTABILITÉ & GESTION FINANCIÈRE
*Recettes · Dépenses · Caisse · Journal · Bilans · KPIs*

### 4.1 Présentation et Objectifs

Le module Comptabilité constitue le cœur financier de l'application. Il agrège et centralise tous les flux financiers générés par les trois pôles d'activité (sportif, événementiel, immobilier) pour offrir une vision globale, précise et en temps réel de la santé financière du complexe. Ce module ne se substitue pas à un logiciel de comptabilité générale certifié, mais fournit une **comptabilité de gestion interne** complète et exportable.

---

### 4.2 Gestion des Recettes

#### 4.2.1 Sources et Classification des Recettes

| Pôle | Type de Recette | Exemples concrets |
|------|-----------------|-------------------|
| Sportif | Abonnements | Mensuel, trimestriel, annuel, pass journée |
| Sportif | Séances & Bien-être | Hammam, massages, cours à la séance |
| Sportif | Produits & Accessoires | Vente eau, serviettes, accessoires sport |
| Événementiel | Location Salles | Location brute de la salle de fête |
| Événementiel | Services Associés | Sono, éclairage, décoration, personnel |
| Immobilier | Loyers | Loyers mensuels meublés et non meublés |
| Immobilier | Charges récupérables | Eau, électricité, gardiennage refacturés |
| Divers | Pénalités & Autres | Pénalités d'annulation, cautions saisies |

#### 4.2.2 Enregistrement et Validation des Recettes

- Saisie manuelle possible avec tous les champs obligatoires : date, montant, source, mode de paiement, référence du justificatif
- Alimentation automatique depuis les modules opérationnels (abonnement vendu = recette créée automatiquement)
- Statut de la recette : **Provisoire** (en attente de validation) / **Validée** / **Annulée**
- Validation par le responsable comptable avant comptabilisation définitive
- Impossibilité de modifier ou supprimer une recette validée (correction par écriture d'annulation avec motif)
- Génération automatique d'un reçu ou ticket de caisse pour chaque recette encaissée
- Rattachement obligatoire à une catégorie et à un pôle d'activité

---

### 4.3 Gestion des Dépenses

#### 4.3.1 Circuit de Validation des Dépenses

Les dépenses suivent un circuit de validation structuré pour éviter les abus et garantir la traçabilité de chaque engagement financier.

1. L'opérationnel saisit une demande de dépense avec : nature, montant estimé, fournisseur, justification, pièce jointe
2. Le système vérifie la disponibilité budgétaire sur la catégorie concernée
3. La demande est soumise au responsable désigné (selon le seuil configuré)
4. Le responsable approuve, rejette ou demande des modifications
5. Après approbation, le règlement est enregistré et le comptable valide l'écriture
6. Le justificatif (facture, ticket) est numérisé et archivé dans le système

---

### 4.4 Gestion de la Caisse

La gestion de la caisse garantit un contrôle strict des mouvements d'espèces, qui constituent souvent la principale source d'erreurs ou d'irrégularités dans un complexe multi-activités.

- **Ouverture de caisse** chaque matin : saisie du fond de caisse initial avec validation
- Enregistrement de chaque mouvement espèces : montant, nature, opérateur
- **Clôture de caisse** chaque soir : comptage physique saisi, comparaison avec le théorique
- Calcul automatique de l'**écart de caisse** (positif ou négatif) avec justification obligatoire
- Rapport de caisse journalier imprimable : détail de tous les mouvements
- Gestion de **plusieurs caisses indépendantes** (sportif, événementiel, accueil principal)
- Historique complet de toutes les clôtures de caisse avec les écarts constatés
- Alerte automatique si l'écart dépasse un seuil configurable

---

### 4.5 Journal Comptable Unifié

- Toutes les opérations financières (recettes et dépenses, toutes sources) sont centralisées dans un journal unique
- Chaque écriture contient : numéro séquentiel, date, libellé, catégorie, montant, pôle, opérateur, pièce justificative
- Filtrage multi-critères : par date, par catégorie, par pôle, par opérateur, par mode de paiement
- Recherche full-text dans les libellés
- Export complet en Excel/CSV pour traitement par le cabinet comptable externe
- **Numérotation immuable** : aucune écriture ne peut être renumérotée
- Correction uniquement par **contre-écriture** avec motif obligatoire

---

## MODULE 05 — REPORTING & TABLEAUX DE BORD
*Rapports quotidiens · Hebdomadaires · Mensuels · KPIs · Exports*

### 5.1 Présentation et Objectifs

Le module Reporting est la vitrine analytique de l'application. Il transforme toutes les données opérationnelles et financières en informations décisionnelles exploitables par la direction. Il produit des rapports structurés, visuellement clairs et exportables, permettant à chaque niveau de management de piloter son activité avec précision.

---

### 5.2 Tableau de Bord Principal (Dashboard)

Le tableau de bord est la première page affichée lors de la connexion. Il présente une synthèse en temps réel des indicateurs les plus importants.

#### 5.2.1 Indicateurs Financiers en Temps Réel

- Chiffre d'affaires du jour (recettes totales depuis l'ouverture de la journée)
- Dépenses du jour (validées)
- Résultat net du jour (CA - Dépenses)
- Solde de caisse en cours
- Évolution vs jour précédent (flèche haut/bas avec pourcentage)

#### 5.2.2 Indicateurs Opérationnels

- Nombre de membres présents en ce moment dans le complexe
- Nombre de membres actifs total (abonnements en cours)
- Prochain événement prévu : salle, client, date, heure
- Abonnements expirant dans les 7 prochains jours
- Loyers en retard de paiement
- Alertes stock : articles sous le seuil minimum

---

### 5.3 Rapport Quotidien

Le rapport quotidien est généré automatiquement à 23h59 (heure configurable) et peut également être produit manuellement à tout moment de la journée.

| Section | Contenu détaillé |
|---------|-----------------|
| **En-tête** | Date, période couverte, heure de génération, nom de l'opérateur |
| **Résumé Financier** | Total recettes (détail par pôle), total dépenses (détail par catégorie), résultat net |
| **Détail Recettes** | Ligne par ligne : heure, libellé, montant, mode de paiement, opérateur |
| **Détail Dépenses** | Ligne par ligne : catégorie, libellé, montant, fournisseur, approbateur |
| **Rapport de Caisse** | Solde ouverture, total entrées, total sorties, solde théorique, solde physique, écart |
| **Activité Sportive** | Nombre d'entrées, abonnements vendus, séances hammam/cours, nouveaux membres |
| **Activité Événementielle** | Événements du jour, acomptes reçus, soldes encaissés, réservations confirmées |
| **Activité Immobilière** | Loyers encaissés, relances envoyées, mouvements locataires |
| **Alertes & Signaux** | Abonnements expirant, impayés de loyer, stocks faibles, écarts de caisse |

---

### 5.4 Rapport Hebdomadaire

- Consolidation automatique des 7 rapports journaliers de la semaine
- Comparaison avec la semaine précédente : évolution en valeur absolue et en pourcentage
- Graphique en courbes : évolution quotidienne des recettes sur la semaine
- Graphique en barres : répartition des recettes par pôle d'activité
- Top 5 des sources de revenus de la semaine
- Top 3 des catégories de dépenses de la semaine
- Planning de la semaine suivante : événements confirmés et abonnements à renouveler
- Taux d'occupation des salles de sport (heures occupées / heures d'ouverture)
- Taux d'occupation des salles de fêtes

---

### 5.5 Rapport Mensuel

- Compte de résultat mensuel complet : Recettes totales vs Dépenses totales par catégorie
- Résultat net mensuel avec évolution graphique sur les 12 derniers mois
- Analyse de rentabilité par pôle d'activité : sportif, événementiel, immobilier
- État des créances clients (factures impayées)
- État des dettes fournisseurs
- Rapport de fréquentation sportive : moyenne journalière, pics, tendances
- Rapport locatif mensuel : loyers attendus, encaissés, en retard, taux de recouvrement
- Classement des mois les plus performants (graphique YTD)

---

### 5.6 Exports et Diffusion

- Tous les rapports sont exportables en **PDF haute qualité** (format imprimable A4)
- Export des données brutes en **Excel (.xlsx)** avec mise en forme automatique
- Export en **CSV** pour traitement par des outils tiers
- Envoi automatique par email des rapports aux destinataires configurés
- Planification de l'envoi : quotidien à 8h, hebdomadaire le lundi, mensuel le 1er du mois
- Personnalisation de l'en-tête des rapports : logo, nom, couleurs du complexe
- Archivage automatique de chaque rapport généré dans le système

---

## MODULE 06 — GESTION DES STOCKS
*Articles · Fournisseurs · Mouvements · Inventaires · Alertes*

### 6.1 Présentation et Objectifs

Le module Stocks permet de contrôler l'ensemble des consommables, équipements et produits utilisés dans les différentes activités du complexe. Qu'il s'agisse des produits d'entretien, des accessoires sportifs, des produits cosmétiques du hammam, des fournitures de bureau ou des pièces de rechange pour les équipements, tout est tracé et géré dans ce module.

---

### 6.2 Catalogue des Articles

- Référence unique et désignation de chaque article
- Catégorie : Consommable sportif / Produit bien-être / Entretien / Fournitures bureau / Équipement / Pièce de rechange
- Unité de mesure : pièce, kg, litre, pack, boîte
- **Stock minimum** (seuil d'alerte), stock optimal (quantité à maintenir), stock maximum
- **Prix d'achat moyen pondéré (PUMP)** — mis à jour automatiquement à chaque réception
- Prix de vente (si l'article est revendu au détail aux membres)
- Fournisseur(s) principal(aux) et fournisseur de secours
- Emplacement physique dans le complexe (salle, réserve, zone)
- Code-barres ou QR code (si applicable)
- Photo de l'article

---

### 6.3 Mouvements de Stock

| Type de Mouvement | Sens | Détails |
|-------------------|------|---------|
| Réception commande | ➕ Entrée | Réception fournisseur : BL saisi, lot, date, quantité, prix unitaire |
| Retour fournisseur | ➖ Sortie | Article défectueux retourné avec motif et bon de retour |
| Consommation interne | ➖ Sortie | Utilisation en prestation (hammam, entretien, cours) — affecté à un pôle |
| Vente directe | ➖ Sortie | Vente d'un article à un membre (lié au module commercial) |
| Transfert | ↔️ Transfert | Transfert entre zones ou services (pas de perte de stock global) |
| Inventaire | +/- Ajustement | Ajustement suite à comptage physique avec motif obligatoire |
| Perte / Casse | ➖ Sortie | Enregistrement d'une perte avec validation du responsable |

---

### 6.4 Inventaire et Alertes

- Inventaire périodique : saisie des quantités physiques comptées — le système calcule les écarts
- Rapport d'inventaire : valorisation du stock au PUMP, écarts constatés
- **Alerte automatique** dès qu'un article passe sous son seuil minimum
- Notification en temps réel dans le tableau de bord et par email au responsable
- Génération automatique d'un **bon de commande suggéré** pour les articles en rupture
- Suivi des bons de commande : statut (brouillon / envoyé / reçu partiellement / clôturé)
- Historique complet des achats par article et par fournisseur

---

## MODULE 07 — GESTION DU PERSONNEL
*Employés · Plannings · Présences · Congés · Paie · Charges CNPS*

### 7.1 Présentation et Objectifs

Le module Personnel assure la gestion administrative et opérationnelle des ressources humaines du complexe. Il couvre l'ensemble du cycle de vie d'un employé : de son recrutement à son départ, en passant par la gestion de son planning, le suivi de ses présences, ses congés, et le calcul de sa rémunération mensuelle. Bien que ce module ne remplace pas un logiciel de paie certifié, il fournit tous les éléments nécessaires à l'établissement des bulletins de salaire et au calcul des charges sociales.

---

### 7.2 Fiche Employé

- Informations d'état civil : nom, prénom, date et lieu de naissance, genre
- Pièce d'identité : CNI ou passeport, numéro, date d'expiration, copie numérisée
- Coordonnées : adresse, téléphone, email personnel
- Poste occupé et département d'affectation (Sport, Événementiel, Administration, etc.)
- Type de contrat : CDI, CDD (avec date de fin), temps partiel, vacataire
- Date d'embauche et **ancienneté calculée automatiquement**
- Rémunération : salaire de base, prime de rendement, avantages en nature
- Numéro d'immatriculation CNPS
- Compte bancaire pour virement de salaire
- Documents RH archivés : contrat signé, CV, diplômes, attestations
- Contact d'urgence : nom, relation, téléphone

---

### 7.3 Planning et Gestion des Horaires

- Création du planning hebdomadaire par département et par poste
- Affectation des employés aux créneaux horaires
- Gestion des rotations et des équipes (matin, soir, week-end)
- Détection automatique des conflits de planning
- Vue individuelle et vue équipe du planning
- Export du planning en PDF ou impression affichage

---

### 7.4 Suivi des Présences

- Enregistrement quotidien : **présent / absent / en retard / en mission**
- Motif de l'absence : maladie, congé payé, congé sans solde, formation, événement familial
- Calcul automatique du nombre d'heures de travail effectuées
- Gestion des **heures supplémentaires** avec taux de majoration configurable
- Rapport mensuel de présence par employé et par département

---

### 7.5 Gestion des Congés

- Demande de congé saisie par l'employé (via le responsable)
- Vérification automatique du solde de congés disponible
- Validation par le responsable direct
- Mise à jour automatique du solde de congés après validation
- Calcul des congés acquis : base légale **(2,5 jours par mois travaillé au Cameroun)**
- Historique des congés pris et solde restant en temps réel

---

### 7.6 Calcul de la Paie et Charges Sociales

- Calcul du salaire brut : salaire de base + heures sup + primes - absences non justifiées
- Application des **cotisations CNPS** : part salariale et part patronale
- Calcul de l'**IRPP** selon le barème progressif en vigueur
- Calcul des autres retenues légales (Crédit Foncier, etc.)
- Génération du **bulletin de paie mensuel** en PDF
- État récapitulatif des charges patronales pour la CNPS
- Historique complet des bulletins de paie par employé
- Total masse salariale mensuelle (lié au module dépenses)

---

## MODULE 08 — GESTION COMMERCIALE
*Clients · Tarifs · Devis · Factures · Encaissements · Fidélité*

### 8.1 Présentation et Objectifs

Le module Commercial est la charnière entre les activités opérationnelles du complexe et les flux financiers. Il centralise la gestion de la relation client, la tarification, la production de documents commerciaux (devis, factures, avoirs) et le suivi des encaissements. Il est conçu pour être utilisé au quotidien par les agents commerciaux et de caisse.

---

### 8.2 Gestion de la Base Clients

La base clients est **unifiée et partagée** entre tous les modules. Un client ayant un abonnement sportif, ayant loué une salle de fête et étant locataire d'un appartement n'a qu'une seule fiche dans le système.

- Fiche client unifiée : particulier ou entreprise
- Pour les entreprises : raison sociale, RCCM, identifiant contribuable, contacts multiples (DG, DRH, DAF)
- **Segmentation automatique** : VIP (CA > seuil), Entreprise, Particulier, Fidèle (ancienneté > X mois)
- Score de fidélité : calculé selon la fréquence et le volume des achats
- Historique commercial complet : devis, factures, paiements, avoirs, réclamations
- Solde du compte client : somme des factures impayées
- Plafond de crédit autorisé (configurable par catégorie de client)
- Alertes si le client dépasse son plafond de crédit

---

### 8.3 Catalogue des Tarifs

- Tarifs organisés par activité : sport, événementiel, immobilier
- Tarifs normaux, tarifs réduits (étudiant, senior, groupes), tarifs entreprise
- Gestion des promotions : nom de la promo, % de remise, dates de validité, codes promo
- Tarifs de saison : haute saison, basse saison (surtout pour l'événementiel)
- Historique des modifications tarifaires avec dates et auteur du changement
- Application automatique de la TVA et autres taxes selon la nature de la prestation
- Simulation de tarif avant facturation

---

### 8.4 Devis

- Création d'un devis multi-lignes avec sélection des articles/services dans le catalogue
- Application automatique des tarifs et remises applicables au client
- Modification manuelle possible avec autorisation de niveau suffisant
- Champs : date d'émission, durée de validité, conditions de paiement, notes
- Aperçu avant impression — génération en PDF
- Envoi par email directement depuis le système
- Suivi du statut : **Brouillon / Envoyé / Accepté / Refusé / Expiré**
- Conversion du devis accepté en facture en **un seul clic**

---

### 8.5 Facturation

- Factures créées manuellement ou issues d'un devis accepté
- Numérotation automatique : format configurable (ex : FAC-2026-0001)
- Mention obligatoire : RCCM, Contribuable, dates, modes de paiement acceptés
- Gestion de la **facture proforma** (document non définitif pour accord préalable)
- Facture définitive : une fois créée et validée, seule une note de crédit peut corriger
- Gestion des **avoirs / notes de crédit** (annulation partielle ou totale d'une facture)
- Relance automatique des factures impayées (délai configurable)
- Tableau de bord des factures : **En attente / Payée partiellement / Payée / En retard / Litige**

---

### 8.6 Encaissements

- Enregistrement d'un paiement lié à une facture précise
- Paiement total ou partiel : le solde restant est automatiquement recalculé
- **Modes de paiement supportés** :
  - Espèces
  - Chèque (avec numéro, banque, date d'encaissement prévisionnelle)
  - Virement bancaire
  - Mobile money : **MTN MoMo, Orange Money**
- Génération automatique du reçu de paiement numéroté
- Rapprochement automatique facture/règlement
- Rapport des encaissements par mode de paiement

---

### 8.7 Programme de Fidélité

- Attribution de points à chaque achat (ratio configurable : 1 point pour X FCFA dépensés)
- Seuils de récompense : à X points, le client bénéficie d'une remise ou d'un service gratuit
- Consultation du solde de points depuis la fiche client
- Historique des points gagnés et utilisés
- Rapports sur le programme de fidélité : membres actifs, points en circulation

---

## MODULE 09 — SÉCURITÉ & AUDIT
*Authentification · Rôles · Journaux d'audit · Sauvegardes · Conformité*

### 9.1 Présentation et Objectifs

Le module Sécurité constitue le socle de confiance de l'ensemble de l'application. Dans un environnement où plusieurs opérateurs accèdent à des données financières sensibles, la sécurité doit être irréprochable. Ce module garantit que seules les personnes autorisées accèdent aux bonnes données, que toutes les actions sensibles sont tracées de manière immuable, et que les données du complexe sont sauvegardées et récupérables en cas d'incident.

---

### 9.2 Authentification

- Connexion par identifiant unique + mot de passe
- **Politique de mot de passe** : minimum 8 caractères, au moins 1 majuscule, 1 chiffre, 1 caractère spécial
- Expiration du mot de passe tous les **90 jours** (configurable)
- Interdiction de réutiliser les 5 derniers mots de passe
- **Authentification à deux facteurs (2FA)** disponible : code OTP par email ou SMS
- Déconnexion automatique après **30 minutes d'inactivité** (configurable)
- Verrouillage du compte après **5 tentatives** de connexion échouées
- Déverrouillage uniquement par un administrateur ou via procédure sécurisée
- Journal des connexions : chaque connexion enregistre date, heure, adresse IP, navigateur

---

### 9.3 Gestion des Rôles et Permissions

- Création de rôles prédéfinis et de rôles personnalisés
- Chaque rôle est configuré par module et par type d'action : **Lire / Créer / Modifier / Supprimer / Valider / Exporter**
- Un utilisateur peut avoir plusieurs rôles (cumul de permissions)
- Restriction possible à certains pôles d'activité uniquement
- Désactivation temporaire d'un compte sans suppression
- Journalisation de toute modification de rôle ou de permission

---

### 9.4 Journal d'Audit (Audit Trail)

Le journal d'audit est le dispositif de traçabilité totale de l'application. Il enregistre toute action significative réalisée dans le système, de manière chronologique et immuable.

| Information tracée | Description |
|--------------------|-------------|
| **Qui** | Identifiant et nom complet de l'utilisateur ayant effectué l'action |
| **Quand** | Date et heure exacte (horodatage serveur, non modifiable) |
| **Quoi** | Nature de l'action : Connexion, Création, Modification, Suppression, Validation, Export |
| **Sur quoi** | Module concerné, identifiant de la donnée modifiée |
| **Avant / Après** | Valeur de la donnée avant modification et après modification |
| **Depuis où** | Adresse IP et navigateur ou application utilisée |

> ⚠️ **Le journal d'audit est en lecture seule** : aucun utilisateur, y compris l'administrateur, ne peut modifier ou supprimer un enregistrement.

- Filtrage du journal par utilisateur, action, module, période
- Alertes de sécurité : connexion depuis une nouvelle adresse IP, tentatives d'accès refusées
- Export du journal en PDF et CSV pour audit externe

---

### 9.5 Sauvegarde et Récupération

- Sauvegarde automatique **quotidienne** de la base de données (heure configurable)
- Rétention des sauvegardes : **7 jours glissants** minimum
- Sauvegarde manuelle à la demande par l'administrateur
- Stockage sur le serveur local **ET** sur un emplacement distant (cloud ou NAS externe)
- Procédure de restauration testée et documentée
- Notification par email après chaque sauvegarde réussie ou en cas d'échec
- Rapport mensuel des sauvegardes effectuées

---

## MODULE 10 — PARAMÉTRAGE GÉNÉRAL
*Configuration · Tarifs · Taxes · Notifications · Sauvegarde · Personnalisation*

### 10.1 Présentation et Objectifs

Le module Paramétrage Général est l'espace de configuration de l'ensemble de l'application. Il est accessible uniquement par le Super Administrateur et le Directeur (en lecture seule pour certains paramètres). Il permet d'adapter l'application aux spécificités et aux évolutions du complexe sans nécessiter d'intervention technique extérieure.

---

### 10.2 Identité et Configuration du Complexe

- Nom commercial, dénomination sociale, forme juridique
- Adresse complète, téléphone, email, site web
- Logo haute résolution (utilisé sur toutes les impressions)
- Informations légales : RCCM, Numéro Contribuable, N° CNPS employeur
- Mention légale de pied de page pour tous les documents
- Devise principale (FCFA), séparateurs de milliers, format des nombres
- Fuseau horaire et format de date

---

### 10.3 Paramètres Financiers et Fiscaux

- Taux de TVA par type de prestation (configurable séparément pour chaque activité)
- Taux des autres taxes et prélèvements applicables
- Taux de pénalités de retard pour loyers et factures
- Définition de l'exercice comptable (date de début et de fin)
- Seuils d'approbation des dépenses par profil utilisateur
- Plafond de remises autorisées par profil
- Préfixes des numérotations : FAC-, DEV-, BON-, ABN-, etc.

---

### 10.4 Paramètres des Alertes et Notifications

- Configuration des destinataires de chaque type d'alerte (par email)
- Seuils d'alerte : nombre de jours avant expiration d'abonnement pour notification
- Seuil d'alerte pour les écarts de caisse (montant au-delà duquel une alerte est envoyée)
- Délais de relance pour les loyers impayés (J+5, J+15, J+30 — configurable)
- Activation/désactivation de chaque type de notification
- Templates des emails et SMS (personnalisation des messages envoyés)

---

### 10.5 Gestion des Exercices et Archivage

- **Clôture de l'exercice annuel** : génération des états de synthèse, archivage de l'exercice
- Ouverture du nouvel exercice : report des soldes (stocks, créances, dettes)
- Archivage des données des années précédentes (consultation possible mais non modifiable)
- Purge des données obsolètes selon une politique de rétention configurable

---

### 10.6 Personnalisation de l'Interface

- Thème de couleurs de l'interface (couleurs principales du complexe)
- Langue de l'interface (Français par défaut, Anglais disponible)
- Tableau de bord personnalisable : chaque utilisateur choisit les widgets affichés
- Configuration des colonnes affichées dans les listes
- Paramètres d'impression : marges, taille de police, format par défaut

---

## Synthèse des Interactions entre Modules

Les 10 modules ne fonctionnent pas de manière isolée. Ils s'articulent et s'alimentent mutuellement dans un écosystème cohérent.

| Module Source | → | Module Destinataire — Données transmises |
|---------------|---|------------------------------------------|
| **Gestion Sportive** | → | **Commercial** : abonnements vendus → factures \| **Comptabilité** : recettes sportives \| **Stocks** : consommables utilisés |
| **Gestion Événementielle** | → | **Commercial** : devis/factures événements \| **Comptabilité** : recettes événementielles et dépenses prestataires |
| **Gestion Immobilière** | → | **Comptabilité** : loyers encaissés, dépenses maintenance \| **Commercial** : quittances de loyer |
| **Gestion Commerciale** | → | **Comptabilité** : toutes les recettes encaissées \| **Reporting** : CA par client et par pôle |
| **Comptabilité** | → | **Reporting** : données financières pour tous les rapports et tableaux de bord |
| **Gestion du Personnel** | → | **Comptabilité** : masse salariale comme dépense mensuelle \| **Stocks** : personnel consommant des ressources |
| **Gestion des Stocks** | → | **Comptabilité** : achats fournisseurs comme dépenses \| **Reporting** : rapport de consommation |
| **Sécurité & Audit** | → | **Tous les modules** : contrôle des accès et traçabilité de toutes les actions |
| **Paramétrage** | → | **Tous les modules** : règles, taxes, seuils, formats, numérotations |

---

## Conclusion

Cette description détaillée des 10 modules fonctionnels de l'application de gestion du complexe multi-activités a été conçue pour couvrir l'ensemble des besoins opérationnels, financiers et managériaux identifiés. Chaque module a été défini de manière exhaustive et indépendante, tout en préservant la cohérence et l'intégration globale du système.

L'application ainsi spécifiée permettra au complexe de :

- ✅ Professionnaliser l'ensemble de ses processus de gestion
- ✅ Éliminer les risques liés aux traitements manuels (erreurs, pertes, fraudes)
- ✅ Offrir à la direction une visibilité financière en temps réel
- ✅ Optimiser l'utilisation de ses ressources (espaces, personnel, stocks)
- ✅ Améliorer la qualité de service rendu aux clients et aux locataires
- ✅ Disposer d'une base de données fiable pour les décisions stratégiques

Le prestataire de développement retenu devra s'engager à respecter l'intégralité de ces spécifications fonctionnelles, et soumettre toute modification ou interprétation à la validation préalable de la maîtrise d'ouvrage.

---

*Document confidentiel — PRISMA GESTION © 2026*
