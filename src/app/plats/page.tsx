'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Plat {
  id: string;
  nom: string;
  pays: string;
  region: string;
  type: string;
  description: string;
  image?: string;
}

export default function PlatsPage() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [filteredPlats, setFilteredPlats] = useState<Plat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Exemple de données - À remplacer par l'appel API à votre DB
  useEffect(() => {
    const exemplePlats: Plat[] = [
      {
        id: '1',
        nom: 'Spaghetti Carbonara',
        pays: 'Italie',
        region: 'Rome',
        type: 'Pâtes',
        description: 'Pâtes classiques avec œufs, fromage et lard',
      },
      {
        id: '2',
        nom: 'Pad Thai',
        pays: 'Thaïlande',
        region: 'Bangkok',
        type: 'Riz/Nouilles',
        description: 'Nouilles de riz sautées avec crevettes et cacahuètes',
      },
      {
        id: '3',
        nom: 'Tajine de poulet',
        pays: 'Maroc',
        region: 'Fès',
        type: 'Viande',
        description: 'Ragoût marocain traditionnel avec poulet et pruneaux',
      },
      {
        id: '4',
        nom: 'Bouillabaisse',
        pays: 'France',
        region: 'Provence',
        type: 'Poisson/Fruits de mer',
        description: 'Soupe de poisson méditerranéenne',
      },
      {
        id: '5',
        nom: 'Pasta à la tomate',
        pays: 'Italie',
        region: 'Naples',
        type: 'Pâtes',
        description: 'Pâtes simples avec sauce tomate fraîche et basilic',
      },
      {
        id: '6',
        nom: 'Coq au vin',
        pays: 'France',
        region: 'Bourgogne',
        type: 'Viande',
        description: 'Poulet braisé au vin rouge avec légumes',
      },
      {
        id: '7',
        nom: 'Sushi',
        pays: 'Japon',
        region: 'Tokyo',
        type: 'Poisson/Fruits de mer',
        description: 'Riz vinaigré avec poisson frais et algue',
      },
      {
        id: '8',
        nom: 'Lasagne à la bolognaise',
        pays: 'Italie',
        region: 'Bologne',
        type: 'Pâtes',
        description: 'Pâtes en couches avec sauce viande et fromage',
      },
      {
        id: '9',
        nom: 'Steak frites',
        pays: 'France',
        region: 'Paris',
        type: 'Viande',
        description: 'Steak grillé servi avec frites croustillantes',
      },
      {
        id: '10',
        nom: 'Ramen',
        pays: 'Japon',
        region: 'Osaka',
        type: 'Riz/Nouilles',
        description: 'Nouilles dans un bouillon riche avec œuf et porc',
      },
      {
        id: '11',
        nom: 'Tomate farcie',
        pays: 'Espagne',
        region: 'Méditerranée',
        type: 'Légumes',
        description: 'Tomate évidée et farcie de riz et viande',
      },
      {
        id: '12',
        nom: 'Poulet tandoori',
        pays: 'Inde',
        region: 'Delhi',
        type: 'Viande',
        description: 'Poulet mariné aux épices et cuit au tandoor',
      },
    ];

    setPlats(exemplePlats);
    setFilteredPlats(exemplePlats);
    setIsLoading(false);
  }, []);

  // Filtrer les plats selon la recherche
  useEffect(() => {
    const filtered = plats.filter(
      (plat) =>
        plat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plat.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plat.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlats(filtered);
  }, [searchTerm, plats]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center">
          Tous les Plats du Monde
        </h1>

        {/* Barre de recherche */}
        <div className="mb-8">
          <input
            type="search"
            placeholder="Rechercher par nom, type, ingrédient ou pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-2 border-orange-400 bg-white px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>

        {/* Affichage du nombre de résultats */}
        <p className="text-gray-600 mb-6 text-center">
          {filteredPlats.length} plat{filteredPlats.length !== 1 ? 's' : ''} trouvé{filteredPlats.length !== 1 ? 's' : ''}
        </p>

        {/* Grille des plats */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Chargement des plats...</p>
          </div>
        ) : filteredPlats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlats.map((plat) => (
              <Link key={plat.id} href={`/plats/${plat.id}`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
                  {/* Placeholder image */}
                  <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-3xl">
                    🍽️
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-900 mb-2">
                      {plat.nom}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>
                        <span className="font-semibold text-orange-600">Pays:</span> {plat.pays}
                      </p>
                      <p>
                        <span className="font-semibold text-orange-600">Région:</span> {plat.region}
                      </p>
                      <p>
                        <span className="font-semibold text-orange-600">Type:</span> {plat.type}
                      </p>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {plat.description}
                    </p>

                    <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                      Voir la recette
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : isLoading ? null : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Aucun plat trouvé correspondant à votre recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
