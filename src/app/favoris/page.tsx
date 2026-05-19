'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFavoris } from '../../lib/useFavoris';

const TYPE_EMOJI: Record<string, string> = {
  'Plat principal': '🍽️', 'Entrée': '🥗', 'Dessert': '🍰',
  'Street Food': '🌮', 'Soupe': '🍲', 'Bol': '🥣',
  'Salade': '🥙', 'Sauce': '🫙', 'Boisson': '🥤',
};

interface Plat {
  id: number;
  nom: string;
  pays: string;
  region: string;
  type: string;
  regime: string;
  description: string;
  image: string;
  piquant: number;
  temps: number;
}

export default function FavorisPage() {
  const { favoris, toggle, isFavori } = useFavoris();
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecettes = async () => {
      try {
        const res = await fetch('/api/recette');
        if (res.ok) setPlats(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecettes();
  }, []);

  const favorisList = plats.filter((p) => favoris.includes(p.id));

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-3">
            ❤️ Mes Favoris
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Retrouvez ici tous les plats que vous avez mis en favoris.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">🍴</div>
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : favorisList.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-pink-200 rounded-3xl bg-pink-50/30">
            <div className="text-6xl mb-4">🤍</div>
            <p className="text-xl font-bold text-gray-700 mb-2">Aucun favori pour l'instant</p>
            <p className="text-gray-400 mb-6">Parcourez le catalogue et cliquez sur 🤍 pour ajouter des plats.</p>
            <Link
              href="/plats"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all active:scale-95"
            >
              Découvrir les plats
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-600 mb-6">
              <span className="bg-gradient-to-r from-red-100 to-pink-100 px-4 py-2 rounded-full inline-block border border-red-200">
                ❤️ {favorisList.length} plat{favorisList.length > 1 ? 's' : ''} en favori{favorisList.length > 1 ? 's' : ''}
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorisList.map((plat) => (
                <div key={plat.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-red-100 hover:border-red-300 h-full flex flex-col overflow-hidden">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    {plat.image ? (
                      <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-100 via-pink-50 to-orange-100 flex items-center justify-center">
                        <span className="text-6xl drop-shadow">{TYPE_EMOJI[plat.type] || '🍴'}</span>
                      </div>
                    )}
                    {/* Bouton retirer */}
                    <button
                      onClick={() => toggle(plat.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center hover:scale-110 transition-all z-10"
                      title="Retirer des favoris"
                    >
                      <span className="text-lg">{isFavori(plat.id) ? '❤️' : '🤍'}</span>
                    </button>
                  </div>

                  {/* Contenu */}
                  <Link href={`/plats/${plat.id}`} className="flex flex-col flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-500 transition-colors">{plat.nom}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          📍 {plat.region ? `${plat.region}, ` : ''}{plat.pays}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-pink-100 text-red-700 font-semibold whitespace-nowrap">{plat.type}</span>
                        {plat.regime && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold whitespace-nowrap">{plat.regime}</span>}
                      </div>
                    </div>
                    <p className="text-gray-600 flex-1 text-sm leading-relaxed line-clamp-2">{plat.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-700 bg-red-50/50 rounded-lg p-3">
                      <span className="flex items-center gap-1">🌶️ {plat.piquant}/5</span>
                      <span className="flex items-center gap-1">⏱️ {plat.temps} min</span>
                    </div>
                    <div className="mt-3 w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 rounded-lg font-semibold text-center text-sm transition-all">
                      Voir la recette
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
