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
  difficulty: number;
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
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">❤️ Mes Favoris</h1>
          <p className="text-gray-500 text-sm">Retrouvez ici tous les plats que vous avez mis en favoris.</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
        ) : favorisList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg bg-white">
            <div className="text-5xl mb-3">🤍</div>
            <p className="font-semibold text-gray-700 mb-1">Aucun favori pour l'instant</p>
            <p className="text-gray-400 text-sm mb-5">Parcourez le catalogue et cliquez sur 🤍 pour ajouter des plats.</p>
            <Link
              href="/plats"
              className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors"
            >
              Découvrir les plats
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">
              {favorisList.length} plat{favorisList.length > 1 ? 's' : ''} en favori{favorisList.length > 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {favorisList.map((plat) => (
                <div key={plat.id} className="group bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors h-full flex flex-col overflow-hidden">
                  <div className="relative h-40 overflow-hidden flex-shrink-0">
                    {plat.image ? (
                      <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                        <span className="text-5xl">{TYPE_EMOJI[plat.type] || '🍴'}</span>
                      </div>
                    )}
                    <button
                      onClick={() => toggle(plat.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                      title="Retirer des favoris"
                    >
                      <span className="text-sm">{isFavori(plat.id) ? '❤️' : '🤍'}</span>
                    </button>
                  </div>

                  <Link href={`/plats/${plat.id}`} className="flex flex-col flex-1 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{plat.nom}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">📍 {plat.region ? `${plat.region}, ` : ''}{plat.pays}</p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-medium whitespace-nowrap">{plat.type}</span>
                        {plat.regime && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium whitespace-nowrap">{plat.regime}</span>}
                      </div>
                    </div>
                    <p className="text-gray-500 flex-1 text-sm leading-relaxed line-clamp-2">{plat.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <span>⭐ {plat.difficulty}/5</span>
                      <span>⏱️ {plat.temps} min</span>
                    </div>
                    <div className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium text-center text-sm transition-colors">
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
