'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Plat {
  id: string;
  nom: string;
  pays: string;
  region: string;
  type: string;
  description: string;
}

export default function PlatsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const plats: Plat[] = [
    { id: '1', nom: 'Spaghetti Carbonara', pays: 'Italie', region: 'Rome', type: 'Pâtes', description: 'Pâtes avec œufs et lard' },
    { id: '2', nom: 'Pad Thai', pays: 'Thaïlande', region: 'Bangkok', type: 'Riz/Nouilles', description: 'Nouilles sautées' },
    { id: '3', nom: 'Tajine de poulet', pays: 'Maroc', region: 'Fès', type: 'Viande', description: 'Ragoût marocain' },
    { id: '4', nom: 'Bouillabaisse', pays: 'France', region: 'Provence', type: 'Poisson', description: 'Soupe de poisson' },
    { id: '5', nom: 'Pasta à la tomate', pays: 'Italie', region: 'Naples', type: 'Pâtes', description: 'Sauce tomate' },
    { id: '6', nom: 'Coq au vin', pays: 'France', region: 'Bourgogne', type: 'Viande', description: 'Poulet au vin' },
  ];

  const filteredPlats = plats.filter(plat =>
    plat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plat.pays.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center">Tous les Plats</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Chercher un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-orange-400 rounded-lg bg-white text-gray-800"
          />
        </div>

        <p className="text-center text-gray-600 mb-6">{filteredPlats.length} plat(s) trouvé(s)</p>

        {filteredPlats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlats.map((plat) => (
              <Link key={plat.id} href={`/plats/${plat.id}`}>
                <div className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">{plat.nom}</h3>
                  <p className="text-sm text-gray-600 mb-2"><strong>Pays:</strong> {plat.pays}</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Type:</strong> {plat.type}</p>
                  <p className="text-gray-700 mb-4">{plat.description}</p>
                  <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">Voir la recette</button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600"><p>Aucun plat trouvé</p></div>
        )}
      </div>
    </div>
  );
}
