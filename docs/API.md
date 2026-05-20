# Guide d'utilisation de l'API

Base URL locale : `http://localhost:3000`

---

## Recettes

### GET /api/recette
Retourne la liste de toutes les recettes.

**Réponse 200**
```json
[
  {
    "id": 1,
    "nom": "Poulet Yassa",
    "pays": "Sénégal",
    "region": "Casamance",
    "continent": "Afrique",
    "type": "Plat principal",
    "regime": "Halal",
    "description": "Plat sénégalais à base de poulet mariné...",
    "difficulty": 3,
    "temps": 60,
    "ingredients": "[\"1 poulet\",\"4 oignons\",\"2 citrons\"]",
    "etapes": "[\"Mariner le poulet\",\"Faire revenir les oignons\"]",
    "image": "https://exemple.com/yassa.jpg"
  }
]
```

---

### GET /api/recette/:id
Retourne le détail d'une recette par son identifiant.

**Paramètre** : `id` — identifiant numérique de la recette

**Réponse 200** : objet recette (même structure que ci-dessus)

**Réponse 404**
```json
{ "message": "Recette non trouvée" }
```

---

### POST /api/recette
Crée une nouvelle recette.

**Headers**
```
Content-Type: application/json
```

**Corps de la requête**
```json
{
  "nom": "Sushi",
  "pays": "Japon",
  "region": "Tokyo",
  "continent": "Asie",
  "type": "Plat principal",
  "regime": "",
  "description": "Riz vinaigré garni de poisson cru.",
  "difficulty": 4,
  "temps": 45,
  "ingredients": ["300g de riz", "200g de saumon", "1 feuille de nori"],
  "etapes": ["Cuire le riz", "Assaisonner", "Former les sushis"],
  "image": "https://exemple.com/sushi.jpg"
}
```

| Champ | Type | Requis | Description |
|---|---|---|---|
| nom | string | Oui | Nom du plat |
| pays | string | Oui | Pays d'origine |
| region | string | Non | Région |
| continent | string | Non | Continent |
| type | string | Non | Entrée / Plat principal / Dessert / Street Food |
| regime | string | Non | Végétarien / Vegan / Halal / Casher / Sans gluten / Sans lactose |
| description | string | Non | Description courte |
| difficulty | number (0-5) | Non | Niveau de difficulté |
| temps | number | Non | Temps de préparation en minutes |
| ingredients | array | Non | Liste des ingrédients |
| etapes | array | Non | Étapes de préparation numérotées |
| image | string (URL) | Non | URL de l'image |

**Réponse 201**
```json
{ "message": "Recette créée avec succès", "nom": "Sushi", "pays": "Japon" }
```

**Réponse 400**
```json
{ "message": "Les champs nom et pays sont requis" }
```

---

### PUT /api/recette/:id
Met à jour une recette existante.

**Paramètre** : `id` — identifiant numérique de la recette

**Corps** : même structure que POST (tous les champs, `nom` et `pays` requis)

**Réponse 200**
```json
{ "message": "Recette mise à jour avec succès", "id": "1", "nom": "Sushi", "pays": "Japon" }
```

**Réponse 404** : recette non trouvée

---

### DELETE /api/recette/:id
Supprime une recette et tous ses avis associés.

**Paramètre** : `id` — identifiant numérique de la recette

**Réponse 200**
```json
{ "message": "Recette supprimée avec succès" }
```

**Réponse 404** : recette non trouvée

---

## Avis

### GET /api/recette/:id/avis
Retourne tous les avis d'une recette avec la note moyenne.

**Réponse 200**
```json
{
  "avis": [
    {
      "id": 1,
      "recette_id": 1,
      "auteur": "Alice",
      "note": 5,
      "commentaire": "Délicieux !",
      "date_format": "20/05/2026"
    }
  ],
  "moyenne": 4.5
}
```

---

### POST /api/recette/:id/avis
Ajoute un avis sur une recette.

**Corps de la requête**
```json
{
  "auteur": "Alice",
  "note": 5,
  "commentaire": "Délicieux !"
}
```

| Champ | Type | Requis | Description |
|---|---|---|---|
| auteur | string | Non | Nom de l'auteur (défaut : "Anonyme") |
| note | number (1-5) | Oui | Note entre 1 et 5 |
| commentaire | string | Non | Commentaire libre |

**Réponse 201**
```json
{ "message": "Avis ajouté avec succès" }
```

**Réponse 400**
```json
{ "message": "La note doit être entre 1 et 5" }
```

---

## Exemples avec fetch (JavaScript)

```js
// Lister toutes les recettes
const res = await fetch('/api/recette');
const recettes = await res.json();

// Créer une recette
await fetch('/api/recette', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nom: 'Tajine', pays: 'Maroc', difficulty: 2, temps: 90 })
});

// Ajouter un avis sur la recette id=1
await fetch('/api/recette/1/avis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ auteur: 'Bob', note: 4, commentaire: 'Très bon !' })
});

// Supprimer la recette id=1
await fetch('/api/recette/1', { method: 'DELETE' });
```

---

## Codes HTTP utilisés

| Code | Signification |
|---|---|
| 200 | Succès |
| 201 | Ressource créée |
| 400 | Données invalides (champ manquant ou incorrect) |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |
