const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Données de test
let recettes = [
    {
        id: '1',
        nom: 'Spaghetti Carbonara',
        pays: 'Italie',
        region: 'Rome',
        type: 'Pâtes',
        description: 'Pâtes classiques avec œufs, fromage et lard',
        ingredients: [
            { nom: 'Spaghetti', quantite: '400g' },
            { nom: 'Œufs', quantite: '4' },
            { nom: 'Pecorino Romano', quantite: '200g' },
            { nom: 'Guanciale', quantite: '200g' }
        ],
        etapes: [
            'Faites cuire les spaghetti',
            'Préparez le mélange œuf-fromage',
            'Mélangez tout ensemble'
        ],
        image: null,
        tempsCuisson: '20 minutes',
        difficulte: 'Facile',
        personnes: 4
    }
];

// GET : Récupérer toutes les recettes
app.get('/api/recettes', (req, res) => {
    res.json(recettes);
});

// GET : Récupérer une recette par ID
app.get('/api/recettes/:id', (req, res) => {
    const recette = recettes.find(r => r.id.toString() === req.params.id);
    if (!recette) return res.status(404).json({ error: 'Recette non trouvée' });
    res.json(recette);
});

// POST : Ajouter une recette (avec récupération image Unsplash)
app.post('/api/recettes', async (req, res) => {
    try {
        const { nom, pays, region, type, description, ingredients, etapes, tempsCuisson, difficulte, personnes } = req.body;
        
        // Récupérer une image depuis Unsplash
        let imageUrl = null;
        try {
            imageUrl = await getImageFromUnsplash(nom);
        } catch (error) {
            console.warn('Erreur récupération image:', error.message);
        }
        
        const newRecette = {
            id: Date.now().toString(),
            nom,
            pays,
            region,
            type,
            description,
            ingredients,
            etapes,
            image: imageUrl,
            tempsCuisson: tempsCuisson || '30 minutes',
            difficulte: difficulte || 'Moyen',
            personnes: personnes || 4
        };
        
        recettes.push(newRecette);
        res.status(201).json(newRecette);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE : Supprimer une recette
app.delete('/api/recettes/:id', (req, res) => {
    const id = req.params.id;
    recettes = recettes.filter(r => r.id.toString() !== id);
    res.status(204).send();
});

// Fonction pour récupérer une image via Unsplash
async function getImageFromUnsplash(plat) {
    const unsplashKey = process.env.UNSPLASH_API_KEY;
    if (!unsplashKey) {
        console.warn('UNSPLASH_API_KEY non configurée');
        return null;
    }
    
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: plat,
                per_page: 1,
                client_id: unsplashKey
            }
        });
        
        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].urls.regular;
        }
        return null;
    } catch (error) {
        throw new Error('Erreur API Unsplash: ' + error.message);
    }
}

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: 'API running', recettesCount: recettes.length });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur API lancé sur http://localhost:${PORT}`);
    console.log(`GET  http://localhost:${PORT}/api/recettes`);
    console.log(`POST http://localhost:${PORT}/api/recettes`);
});