// Service pour appeler l'API Express

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Ingredient {
  nom: string;
  quantite: string;
}

export interface Recette {
  id: string;
  nom: string;
  pays: string;
  region?: string;
  type?: string;
  description?: string;
  ingredients: Ingredient[];
  etapes: string[];
  image?: string;
  tempsCuisson?: string;
  difficulte?: string;
  personnes?: number;
}

// Récupérer toutes les recettes
export async function getRecettes(): Promise<Recette[]> {
  try {
    const res = await fetch(`${API_URL}/recettes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des recettes');
    return res.json();
  } catch (error) {
    console.error('Erreur API getRecettes:', error);
    return [];
  }
}

// Récupérer une recette par ID
export async function getRecetteById(id: string): Promise<Recette | null> {
  try {
    const res = await fetch(`${API_URL}/recettes/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Recette non trouvée');
    return res.json();
  } catch (error) {
    console.error('Erreur API getRecetteById:', error);
    return null;
  }
}

// Ajouter une nouvelle recette (appelle Unsplash automatiquement)
export async function addRecette(recette: Omit<Recette, 'id' | 'image'>): Promise<Recette | null> {
  try {
    const res = await fetch(`${API_URL}/recettes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recette)
    });
    if (!res.ok) throw new Error('Erreur lors de l\'ajout de la recette');
    return res.json();
  } catch (error) {
    console.error('Erreur API addRecette:', error);
    return null;
  }
}

// Supprimer une recette
export async function deleteRecette(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/recettes/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (error) {
    console.error('Erreur API deleteRecette:', error);
    return false;
  }
}

// Vérifier si l'API est en ligne
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL.replace('/api', '')}/api/health`);
    return res.ok;
  } catch (error) {
    console.warn('API indisponible:', error);
    return false;
  }
}
