# Documentation Technique

## Stack technologique

| Couche | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| Langage | TypeScript | 5 |
| UI | React | 19 |
| Style | Tailwind CSS | 4 |
| Base de données | SQLite3 | — |
| Runtime | Node.js | 18+ |

---

## Architecture

Le projet suit le modèle **Client / Serveur** dans un monorepo Next.js :

```
Navigateur (React)
      ↓  fetch('/api/...')
Routes API Next.js  (src/app/api/)
      ↓  getDB()
SQLite  (data/recettes.db)
```

Le front-end et le back-end cohabitent dans le même projet. Next.js gère le routing des deux côtés automatiquement.

---

## Structure des fichiers

```
yboost-api/
├── src/
│   ├── app/
│   │   ├── layout.tsx          — Layout global (Navbar)
│   │   ├── page.tsx            — Page d'accueil
│   │   ├── plats/
│   │   │   ├── page.tsx        — Catalogue avec filtres
│   │   │   └── [id]/page.tsx   — Détail d'un plat + avis
│   │   ├── ajout-plat/
│   │   │   └── page.tsx        — Formulaire d'ajout
│   │   ├── favoris/
│   │   │   └── page.tsx        — Liste des favoris
│   │   └── api/
│   │       └── recette/
│   │           ├── route.ts         — GET /api/recette, POST /api/recette
│   │           └── [id]/
│   │               ├── route.ts     — GET/PUT/DELETE /api/recette/:id
│   │               └── avis/
│   │                   └── route.ts — GET/POST /api/recette/:id/avis
│   ├── components/
│   │   ├── navbar.tsx          — Barre de navigation
│   │   ├── explication.tsx     — Section d'accueil
│   │   └── sort-controls.tsx   — Sélecteur de tri
│   └── lib/
│       ├── sqlite.ts           — Connexion et migrations SQLite
│       └── useFavoris.ts       — Hook React pour les favoris (localStorage)
├── data/
│   └── recettes.db             — Fichier de base de données SQLite
├── docs/                       — Documentation
└── public/                     — Fichiers statiques
```

---

## Base de données

### Connexion — Singleton

La connexion SQLite est initialisée une seule fois via un singleton dans `src/lib/sqlite.ts`. Toutes les routes API appellent `getDB()` qui retourne toujours la même instance.

### Schéma

**Table `recettes`**

| Colonne | Type | Contrainte |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| nom | TEXT | NOT NULL |
| pays | TEXT | NOT NULL |
| region | TEXT | — |
| continent | TEXT | — |
| type | TEXT | — |
| regime | TEXT | — |
| description | TEXT | — |
| difficulty | INTEGER | DEFAULT 0 |
| temps | INTEGER | DEFAULT 30 |
| ingredients | TEXT | JSON sérialisé |
| etapes | TEXT | JSON sérialisé |
| image | TEXT | URL |

**Table `avis`**

| Colonne | Type | Contrainte |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| recette_id | INTEGER | FOREIGN KEY → recettes(id) ON DELETE CASCADE |
| auteur | TEXT | DEFAULT 'Anonyme' |
| note | INTEGER | CHECK(note BETWEEN 1 AND 5) |
| commentaire | TEXT | — |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### Sérialisation JSON

Les champs `ingredients` et `etapes` sont des tableaux stockés sous forme de chaîne JSON dans SQLite.

```
// Stockage (API → BDD)
JSON.stringify(["200g riz", "2 oignons"])
→ '[\"200g riz\",\"2 oignons\"]'

// Lecture (BDD → Front)
JSON.parse('[\"200g riz\",\"2 oignons\"]')
→ ["200g riz", "2 oignons"]
```

### Migrations

Les migrations sont exécutées à chaque démarrage dans un bloc `serialize()` qui garantit l'ordre séquentiel. Le pattern `ALTER TABLE ... ADD COLUMN` ignore silencieusement les colonnes déjà existantes.

---

## API REST

L'API respecte les conventions REST :
- L'URL désigne la **ressource** (`/api/recette`, `/api/recette/:id`)
- Le **verbe HTTP** désigne l'action (GET, POST, PUT, DELETE)
- Les réponses sont toujours en **JSON**
- Les paramètres SQL utilisent des `?` pour prévenir les injections SQL

---

## Favoris

Les favoris ne sont pas stockés en base de données. Ils sont gérés côté client via le hook `useFavoris` qui persiste les IDs dans le `localStorage` du navigateur.

```
localStorage["favoris"] = "[1, 3, 7]"
```

---

## Installation et démarrage

### Prérequis
- Node.js 18+
- npm

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd yboost-api

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

La base de données SQLite est créée automatiquement dans `data/recettes.db` au premier démarrage.

### Build production

```bash
npm run build
npm start
```

---

## Variables d'environnement

Aucune variable d'environnement n'est requise pour faire tourner le projet en local. La base de données est un fichier local.

---

## Sécurité

- Les requêtes SQL utilisent des **paramètres préparés** (`?`) pour prévenir les injections SQL.
- Les données utilisateur sont validées avant insertion (`nom` et `pays` requis, `note` entre 1 et 5).
- Les contraintes sont également appliquées au niveau de la base de données (`CHECK`, `NOT NULL`).
