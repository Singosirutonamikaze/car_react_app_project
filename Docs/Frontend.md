# CarHub - Plateforme de Gestion et Vente de Véhicules

## Description

CarHub est un projet personnel de plateforme de gestion et de vente de véhicules, divisé en deux parties principales :

### Frontend Client

Application destinée aux clients finaux permettant de :

- Créer un compte et se connecter
- Consulter le catalogue de véhicules disponibles
- Accéder à un tableau de bord personnel
- Effectuer des achats de véhicules
- Gérer son panier et ses favoris
- Suivre ses commandes
- Gérer son profil

### Frontend Admin

Interface d'administration basée sur les opérations CRUD permettant de :

- Gérer le catalogue de véhicules
- Gérer les clients
- Suivre et gérer les commandes
- Gérer les ventes
- Accéder aux statistiques et analyses
- Administrer la plateforme

## Architecture du Projet

CarHub/
├── Frontend/
│   ├── react-client-frontend/     # Application client
│   └── react-app-admin-car/       # Application admin
└── Backend/                        # API et services

## Technologies Utilisées

### Frontend Client (react-client-frontend)

- React 18+ avec TypeScript
- Vite comme outil de build
- React Router pour la navigation
- Tailwind CSS pour le styling
- Context API pour la gestion d'état
- Axios pour les requêtes HTTP

### Frontend Admin (react-app-admin-car)

- React 18+ avec JSX
- Vite comme outil de build
- Recharts pour les graphiques et statistiques
- Tailwind CSS pour le styling
- Context API pour la gestion d'état
- Axios pour les requêtes HTTP

## Structure des Projets

### react-client-frontend

src/
├── app/
│   ├── auth/              # Authentification
│   ├── client-dashboard/  # Tableau de bord client
│   ├── common/            # Composants communs
│   └── presentation/      # Pages publiques
├── shared/
│   ├── components/        # Composants réutilisables
│   ├── contexts/          # Contextes React
│   ├── hooks/             # Hooks personnalisés
│   ├── services/          # Services API
│   ├── types/             # Types TypeScript
│   └── utils/             # Utilitaires
└── styles/                # Styles globaux

### react-app-admin-car

src/
├── auth/                  # Authentification admin
├── components/
│   ├── Cars/             # Gestion des véhicules
│   ├── Clients/          # Gestion des clients
│   ├── Commands/         # Gestion des commandes
│   ├── Sales/            # Gestion des ventes
│   ├── charts/           # Composants graphiques
│   ├── cards/            # Cartes d'information
│   └── layouts/          # Layouts d'application
└── pages/                # Pages principales

## Installation

### Prérequis

- Node.js version 18 ou supérieure
- npm ou yarn
- Git

### Installation du Frontend Client

```bash
cd Frontend/react-client-frontend
npm install
# ou
yarn install
```

### Installation du Frontend Admin

```bash
cd Frontend/react-app-admin-car
npm install
# ou
yarn install
```

## Lancement en Développement

### Frontend Client

```bash
cd Frontend/react-client-frontend
npm run dev
# ou
yarn dev
```

L'application sera accessible sur <http://localhost:5173>

### Frontend Admin

```bash
cd Frontend/react-app-admin-car
npm run dev
# ou
yarn dev
```

L'application sera accessible sur <http://localhost:5174>

## Build pour Production

### Frontend Client

```bash
cd Frontend/react-client-frontend
npm run build
# ou
yarn build
```

### Frontend Admin

```bash
cd Frontend/react-app-admin-car
npm run build
# ou
yarn build
```

Les fichiers de production seront générés dans le dossier `dist/`

## Fonctionnalités Principales

### Client

- Authentification sécurisée (inscription/connexion)
- Navigation et recherche de véhicules
- Filtrage avancé (marque, modèle, prix, etc.)
- Système de favoris
- Gestion du panier
- Processus de commande
- Suivi des commandes
- Gestion du profil utilisateur

### Admin

- Tableau de bord avec statistiques
- CRUD complet des véhicules
- CRUD complet des clients
- Gestion des commandes
- Gestion des ventes
- Graphiques et analyses
- Gestion du profil administrateur

## Scripts Disponibles

### Frontend Client

```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code
npm run type-check   # Vérification des types TypeScript
```

### Frontend Admin

```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code
```