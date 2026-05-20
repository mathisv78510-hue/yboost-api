'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SortControls, type SortOption } from '../../components/sort-controls';
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
  continent: string;
  type: string;
  regime: string;
  description: string;
  image: string;
  difficulty: number;
  temps: number;
}

const REGIMES = ['Végétarien', 'Vegan', 'Sans gluten', 'Sans lactose', 'Halal', 'Casher'];

export default function PlatsPage() {
  const searchParams = useSearchParams();
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alpha');
  const [filterType, setFilterType] = useState('');
  const [filterRegime, setFilterRegime] = useState('');
  const [filterContinent, setFilterContinent] = useState('');
  const { toggle, isFavori } = useFavoris();

  useEffect(() => {
    const fetchRecettes = async () => {
      try {
        const response = await fetch('/api/recette');
        if (response.ok) setPlats(await response.json());
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecettes();
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchTerm(urlSearch);
  }, [searchParams]);

  const typeOptions = useMemo(() => [...new Set(plats.map((p) => p.type).filter(Boolean))].sort(), [plats]);
  const continentOptions = useMemo(() => [...new Set(plats.map((p) => p.continent).filter(Boolean))].sort(), [plats]);
  const activeFilterCount = [filterType, filterRegime, filterContinent].filter(Boolean).length;

  const filteredPlats = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const base = plats.filter((plat) => {
      const matchSearch = term
        ? plat.nom.toLowerCase().includes(term) ||
          plat.type?.toLowerCase().includes(term) ||
          plat.pays?.toLowerCase().includes(term) ||
          plat.continent?.toLowerCase().includes(term)
        : true;
      return matchSearch
        && (filterType ? plat.type === filterType : true)
        && (filterRegime ? plat.regime === filterRegime : true)
        && (filterContinent ? plat.continent === filterContinent : true);
    });
    return [...base].sort((a, b) => {
      if (sortBy === 'alpha') return a.nom.localeCompare(b.nom);
      if (sortBy === 'popularite' || sortBy === 'difficulty') return b.difficulty - a.difficulty;
      if (sortBy === 'note' || sortBy === 'temps') return a.temps - b.temps;
      return 0;
    });
  }, [plats, searchTerm, sortBy, filterType, filterRegime, filterContinent]);

  const selectClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-md bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Catalogue des Plats</h1>
          <p className="text-gray-500 text-sm">
            Découvrez la diversité culinaire du monde — filtrez et explorez.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un plat, un pays, un type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <SortControls sortBy={sortBy} onChange={setSortBy} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Type de plat', value: filterType, set: setFilterType, options: typeOptions, placeholder: 'Tous les types' },
                { label: 'Régime alimentaire', value: filterRegime, set: setFilterRegime, options: REGIMES, placeholder: 'Tous les régimes' },
                { label: 'Continent', value: filterContinent, set: setFilterContinent, options: continentOptions, placeholder: 'Tous les continents' },
              ].map(({ label, value, set, options, placeholder }) => (
                <div key={label} className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">{label}</label>
                  <select value={value} onChange={(e) => set(e.target.value)} className={selectClass}>
                    <option value="">{placeholder}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {activeFilterCount > 0 && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm text-gray-600">{activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif{activeFilterCount > 1 ? 's' : ''}</span>
                <button onClick={() => { setFilterType(''); setFilterRegime(''); setFilterContinent(''); }} className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">Effacer tout</button>
              </div>
            )}
          </div>
        </div>

        <section>
          <p className="text-gray-500 mb-4 text-sm">
            {filteredPlats.length > 0 && (
              <span>{filteredPlats.length} plat{filteredPlats.length > 1 ? 's' : ''} trouvé{filteredPlats.length > 1 ? 's' : ''}</span>
            )}
          </p>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <p>Chargement des recettes...</p>
            </div>
          ) : filteredPlats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPlats.map((plat) => (
                <div key={plat.id} className="group bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors h-full flex flex-col overflow-hidden">
                  {/* Image / placeholder */}
                  <div className="relative h-40 overflow-hidden flex-shrink-0">
                    {plat.image ? (
                      <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                        <span className="text-5xl">{TYPE_EMOJI[plat.type] || '🍴'}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); toggle(plat.id); }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                      title={isFavori(plat.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <span className="text-sm">{isFavori(plat.id) ? '❤️' : '🤍'}</span>
                    </button>
                  </div>

                  {/* Contenu */}
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
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-gray-700">Aucun plat ne correspond à ces filtres.</p>
              <p className="text-sm mt-1">Essayez de modifier vos critères de recherche.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
