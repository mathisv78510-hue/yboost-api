'use client';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';

interface Ingredient {
  nom: string;
  quantite: string;
}

interface PlatDetail {
  id: string;
  nom: string;
  pays: string;
  region: string;
  type: string;
  description: string;
  image?: string;
  ingredients: Ingredient[];
  etapes: string[];
  tempsCuisson: string;
  difficulte: string;
  personnes: number;
}

export default function PlatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [plat, setPlat] = useState<PlatDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Exemple de données - À remplacer par l'appel API à votre DB
  useEffect(() => {
    // Simuler un appel API
    const exemplePlats: Record<string, PlatDetail> = {
      '1': {
        id: '1',
        nom: 'Spaghetti Carbonara',
        pays: 'Italie',
        region: 'Rome',
        type: 'Pâtes',
        description: 'Pâtes classiques avec œufs, fromage et lard - un plat simple et délicieux',
        ingredients: [
          { nom: 'Spaghetti', quantite: '400g' },
          { nom: 'Œufs', quantite: '4' },
          { nom: 'Pecorino Romano', quantite: '200g' },
          { nom: 'Guanciale', quantite: '200g' },
          { nom: 'Poivre noir', quantite: 'au goût' },
          { nom: 'Sel', quantite: 'au goût' },
        ],
        etapes: [
          'Faites cuire les spaghetti dans une grande casserole d\'eau salée bouillante',
          'Pendant ce temps, coupez le guanciale en petits cubes et faites-le revenir dans une poêle',
          'Dans un bol, battez les œufs avec le fromage râpé et du poivre noir',
          'Égouttez les pâtes en réservant une tasse d\'eau de cuisson',
          'Versez les pâtes chaudes dans la poêle avec le guanciale (feu éteint)',
          'Ajoutez le mélange d\'œuf et fromage, mélangez rapidement en ajoutant un peu d\'eau de cuisson',
          'Servez immédiatement avec du fromage râpé et du poivre noir',
        ],
        tempsCuisson: '20 minutes',
        difficulte: 'Facile',
        personnes: 4,
      },
      '2': {
        id: '2',
        nom: 'Pad Thai',
        pays: 'Thaïlande',
        region: 'Bangkok',
        type: 'Riz/Nouilles',
        description: 'Nouilles de riz sautées avec crevettes et cacahuètes',
        ingredients: [
          { nom: 'Nouilles de riz', quantite: '250g' },
          { nom: 'Crevettes', quantite: '300g' },
          { nom: 'Sauce tamarind', quantite: '3 cuillères à soupe' },
          { nom: 'Sauce soja', quantite: '2 cuillères à soupe' },
          { nom: 'Sucre', quantite: '1 cuillère à soupe' },
          { nom: 'Cacahuètes concassées', quantite: '100g' },
          { nom: 'Œuf', quantite: '2' },
          { nom: 'Germes de soja', quantite: '1 tasse' },
        ],
        etapes: [
          'Trempez les nouilles de riz dans de l\'eau chaude jusqu\'à ce qu\'elles soient souples',
          'Chauffez l\'huile dans un wok à feu vif',
          'Ajoutez les crevettes et faites cuire jusqu\'à ce qu\'elles deviennent roses',
          'Poussez les crevettes sur le côté et cassez les œufs dans le wok',
          'Ajoutez les nouilles égouttées et mélangez bien',
          'Versez la sauce tamarind, la sauce soja et le sucre',
          'Mélangez pendant 2-3 minutes',
          'Garnissez de cacahuètes et de germes de soja',
        ],
        tempsCuisson: '15 minutes',
        difficulte: 'Moyen',
        personnes: 2,
      },
    };

    setPlat(exemplePlats[resolvedParams.id] || null);
    setLoading(false);
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }

  if (!plat) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Plat non trouvé</h1>
            <Link href="/plats" className="text-orange-500 font-semibold hover:text-orange-600">
              ← Retour aux plats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <Link href="/plats" className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600 mb-6">
          ← Retour aux plats
        </Link>

        {/* Image placeholder */}
        <div className="w-full h-80 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-6xl mb-8">
          🍽️
        </div>

        {/* Header du plat */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">{plat.nom}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Pays</p>
              <p className="text-lg font-bold text-orange-600">{plat.pays}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Région</p>
              <p className="text-lg font-bold text-orange-600">{plat.region}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Type</p>
              <p className="text-lg font-bold text-orange-600">{plat.type}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Difficulté</p>
              <p className="text-lg font-bold text-orange-600">{plat.difficulte}</p>
            </div>
          </div>

          <p className="text-gray-700 text-lg">{plat.description}</p>
        </div>

        {/* Infos de cuisson */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 font-semibold mb-2">Temps de cuisson</p>
            <p className="text-2xl font-bold text-orange-600">⏱️ {plat.tempsCuisson}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 font-semibold mb-2">Nombre de personnes</p>
            <p className="text-2xl font-bold text-orange-600">👥 {plat.personnes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 font-semibold mb-2">Niveau</p>
            <p className="text-2xl font-bold text-orange-600">⭐ {plat.difficulte}</p>
          </div>
        </div>

        {/* Ingrédients */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-6">Ingrédients</h2>
          <ul className="space-y-3">
            {plat.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-orange-500 font-bold mr-3">✓</span>
                <span className="font-semibold mr-2">{ingredient.nom}</span>
                <span className="text-gray-500">({ingredient.quantite})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Étapes de préparation */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-6">Préparation</h2>
          <ol className="space-y-4">
            {plat.etapes.map((etape, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-1">{etape}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
