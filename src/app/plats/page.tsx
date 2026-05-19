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
  piquant: number;
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
      if (sortBy === 'popularite' || sortBy === 'piquant') return b.piquant - a.piquant;
      if (sortBy === 'note' || sortBy === 'temps') return a.temps - b.temps;
      return 0;
    });
  }, [plats, searchTerm, sortBy, filterType, filterRegime, filterContinent]);

  const selectClass = 'w-full px-4 py-3 border-2 border-orange-200/60 rounded-2xl bg-white text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 transition-all duration-200 cursor-pointer';

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 text-center">
            Catalogue des Plats
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Découvrez l'extraordinaire diversité culinaire du monde. Filtrez, triez et explorez des mets d'exception.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/50 p-8 transition-all duration-300">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-orange-500 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="✨ Rechercher un plat, un pays, un type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 border-2 border-orange-200/60 rounded-2xl bg-gradient-to-r from-white to-orange-50/30 text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 transition-all duration-300 shadow-lg"
                />
              </div>
              <SortControls sortBy={sortBy} onChange={setSortBy} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Type de plat', value: filterType, set: setFilterType, options: typeOptions, placeholder: 'Tous les types' },
                { label: 'Régime alimentaire', value: filterRegime, set: setFilterRegime, options: REGIMES, placeholder: 'Tous les régimes' },
                { label: 'Continent', value: filterContinent, set: setFilterContinent, options: continentOptions, placeholder: 'Tous les continents' },
              ].map(({ label, value, set, options, placeholder }) => (
                <div key={label} className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
                  <select value={value} onChange={(e) => set(e.target.value)} className={selectClass}>
                    <option value="">{placeholder}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {activeFilterCount > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-orange-600 font-semibold">{activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif{activeFilterCount > 1 ? 's' : ''}</span>
                <button onClick={() => { setFilterType(''); setFilterRegime(''); setFilterContinent(''); }} className="text-sm text-gray-500 hover:text-red-500 font-bold underline transition-colors">Effacer tout</button>
              </div>
            )}
          </div>
        </div>

        <section>
          <p className="text-gray-700 mb-6 text-sm font-semibold">
            {filteredPlats.length > 0 && (
              <span className="bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full inline-block border border-orange-200">
                🍽️ {filteredPlats.length} plat{filteredPlats.length > 1 ? 's' : ''} trouvé{filteredPlats.length > 1 ? 's' : ''}
              </span>
            )}
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 animate-bounce">🍴</div>
              <p className="text-gray-600">Chargement des recettes...</p>
            </div>
          ) : filteredPlats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlats.map((plat) => (
                <div key={plat.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-orange-100 hover:border-orange-300 h-full flex flex-col overflow-hidden">
                  {/* Image / placeholder */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    {plat.image ? (
                      <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 flex items-center justify-center">
                        <span className="text-6xl drop-shadow">{TYPE_EMOJI[plat.type] || '🍴'}</span>
                      </div>
                    )}
                    {/* Bouton favori */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggle(plat.id); }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center hover:scale-110 transition-all z-10"
                      title={isFavori(plat.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <span className="text-lg">{isFavori(plat.id) ? '❤️' : '🤍'}</span>
                    </button>
                  </div>

                  {/* Contenu */}
                  <Link href={`/plats/${plat.id}`} className="flex flex-col flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{plat.nom}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <span>📍</span> {plat.region ? `${plat.region}, ` : ''}{plat.pays}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 font-semibold whitespace-nowrap">{plat.type}</span>
                        {plat.regime && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold whitespace-nowrap">{plat.regime}</span>}
                      </div>
                    </div>
                    <p className="text-gray-600 flex-1 text-sm leading-relaxed line-clamp-2">{plat.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-700 bg-orange-50/50 rounded-lg p-3">
                      <span className="flex items-center gap-1"><span className="text-red-500">🌶️</span> {plat.piquant}/5</span>
                      <span className="flex items-center gap-1"><span className="text-blue-500">⏱️</span> {plat.temps} min</span>
                    </div>
                    <div className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-lg font-semibold text-center text-sm hover:shadow-xl active:scale-95 transition-all duration-300">
                      Voir la recette
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-orange-200 p-12 text-center text-gray-600 shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-semibold text-gray-900">Aucun plat ne correspond à ces filtres.</p>
              <p className="text-sm text-gray-600 mt-2">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
