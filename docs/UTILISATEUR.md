# Guide Utilisateur — Plats du Monde

Bienvenue sur **Plats du Monde**, une application pour découvrir, partager et noter des recettes du monde entier.

---

## Accéder à l'application

Ouvrez votre navigateur et rendez-vous sur :
```
http://localhost:3000
```

---

## Les pages de l'application

### Page d'accueil — `/`

La page d'accueil présente le projet : sa mission, son fonctionnement et les types de filtres disponibles.

Cliquez sur **Catalogue** dans la barre de navigation pour commencer à explorer les recettes.

---

### Catalogue des plats — `/plats`

C'est la page principale. Elle affiche toutes les recettes disponibles sous forme de cartes.

#### Rechercher un plat

Tapez un mot-clé dans la barre de recherche (nom du plat, pays, type). Les résultats se mettent à jour en temps réel.

#### Filtrer les résultats

Trois filtres sont disponibles sous la barre de recherche :

| Filtre | Description |
|---|---|
| Type de plat | Entrée, Plat principal, Dessert, Street Food... |
| Régime alimentaire | Végétarien, Vegan, Halal, Sans gluten... |
| Continent | Afrique, Asie, Europe, Amérique, Océanie |

Pour retirer tous les filtres, cliquez sur **Effacer tout**.

#### Trier les résultats

Le menu déroulant en haut à droite permet de trier par :
- **Popularité** — par niveau de difficulté décroissant
- **Note** — par temps de préparation
- **Temps** — du plus rapide au plus long
- **Difficulté** — par niveau de difficulté
- **A – Z** — ordre alphabétique

#### Ajouter aux favoris

Cliquez sur le cœur 🤍 en haut à droite d'une carte pour ajouter le plat à vos favoris. Le cœur devient ❤️ pour confirmer l'ajout. Cliquez à nouveau pour retirer.

#### Voir une recette

Cliquez sur le bouton **Voir la recette** (ou n'importe où sur la carte) pour accéder au détail complet du plat.

---

### Détail d'un plat — `/plats/:id`

Cette page affiche toutes les informations sur un plat :

- **En-tête** : nom, pays, région, continent, type, régime
- **Statistiques** : temps de préparation, niveau de difficulté, pays, continent
- **Description** du plat
- **Liste des ingrédients**
- **Étapes de préparation** numérotées
- **Avis des utilisateurs** avec notes et commentaires

#### Laisser un avis

En bas de la page, remplissez le formulaire :
1. Entrez votre nom (optionnel — "Anonyme" par défaut)
2. Sélectionnez une note de 1 à 5 étoiles en cliquant sur les étoiles
3. Ajoutez un commentaire (optionnel)
4. Cliquez sur **Publier mon avis**

Votre avis apparaît immédiatement dans la liste.

---

### Ajouter un plat — `/ajout-plat`

Cette page permet d'ajouter une nouvelle recette à la base de données.

#### Informations générales

| Champ | Obligatoire | Exemple |
|---|---|---|
| Nom du plat | Oui | Poulet Yassa |
| Type de plat | Non | Plat principal |
| Régime alimentaire | Non | Halal |
| Pays | Oui | Sénégal |
| Région | Non | Casamance |
| Continent | Non | Afrique |
| Temps (min) | Non | 60 |
| Niveau de difficulté | Non | Curseur de 0 à 5 |
| Description courte | Non | Résumé du plat |
| Image (URL) | Non | Lien vers une photo |

#### Ingrédients

1. Tapez un ingrédient dans le champ (ex : "500g de poulet")
2. Appuyez sur **Entrée** ou cliquez sur **+** pour l'ajouter
3. Cliquez sur **×** à côté d'un ingrédient pour le supprimer

#### Étapes de préparation

1. Décrivez une étape dans le champ texte
2. Appuyez sur **Entrée** pour l'ajouter (Shift+Entrée pour un saut de ligne)
3. Les étapes sont numérotées automatiquement
4. Cliquez sur **×** pour supprimer une étape

#### Publier la recette

Cliquez sur **Publier la recette**. Vous êtes automatiquement redirigé vers le catalogue après la création.

---

### Mes Favoris — `/favoris`

Cette page affiche tous les plats que vous avez mis en favoris.

- Les favoris sont sauvegardés dans votre navigateur (ils persistent entre les sessions sur le même appareil).
- Cliquez sur ❤️ pour retirer un plat de vos favoris.
- Si la liste est vide, un bouton **Découvrir les plats** vous redirige vers le catalogue.

---

## Navigation

La barre de navigation en haut de chaque page donne accès à :

| Lien | Destination |
|---|---|
| Logo / Plats du Monde | Page d'accueil |
| Catalogue | Liste de tous les plats |
| ❤️ Favoris | Vos plats favoris |
| + Ajouter | Formulaire d'ajout |
| Barre de recherche | Recherche rapide dans le catalogue |
