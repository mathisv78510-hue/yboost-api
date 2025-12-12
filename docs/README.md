# Les Plats du Monde

Application Next.js pour recenser et explorer des plats du monde entier. Recherche par nom, type (pâtes, viande, poisson…), ingrédients (tomate, ail…), pays/région et plus.

## Aperçu

- Interface avec navbar et barre de recherche globale
- Page liste des plats: filtrage en temps réel et via l’URL (`/plats?search=...`)
- Page détail du plat: ingrédients, étapes, infos (temps, difficulté, personnes)
- Thème couleurs alimentaire (ambre/orange)

## Installation

```bash
npm install
npm run dev
# ouvre http://localhost:3000
```

## Routes principales

- `/` Accueil avec explication du site
- `/plats` Liste de tous les plats
	- Supporte `?search=mot-cle` (ex: `/plats?search=Pâtes`)
- `/plats/[id]` Détail d’un plat

## Utilisation de la recherche

- Dans la navbar: saisissez un mot clé puis "Chercher" → redirection vers `/plats?search=...`
- Sur la page `/plats`: la barre de recherche filtre en temps réel (nom, type, pays, région)

Exemples:
- `Pâtes` → Carbonara, Pasta à la tomate, Lasagne
- `Tomate` → Pasta à la tomate, Tomate farcie
- `Viande` → Tajine, Coq au vin, Steak frites, Poulet tandoori

## Structure

- `src/components/navbar.tsx` Navbar + recherche URL
- `src/app/plats/page.tsx` Liste + filtre
- `src/app/plats/[id]/page.tsx` Détail du plat
- `src/components/explication.tsx` Section d’explication

## À brancher sur la DB

Les données sont actuellement en exemple. Branchez vos appels API pour alimenter:
- `src/app/plats/page.tsx`: remplacer le tableau de plats par les données DB
- `src/app/plats/[id]/page.tsx`: récupérer un plat par `id`

## Déploiement

Déployable sur Vercel ou tout hébergeur Node/Next.
