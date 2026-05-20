'use client';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useFavoris } from '../../../lib/useFavoris';
import { useAuth } from '../../../lib/useAuth';

interface PlatDetail {
  id: string;
  nom: string;
  pays: string;
  region: string;
  continent: string;
  type: string;
  regime: string;
  description: string;
  ingredients?: string;
  etapes?: string;
  image?: string;
  difficulty?: number;
  temps: number;
}

interface Avis {
  id: number;
  recette_id: number;
  auteur: string;
  note: number;
  commentaire: string;
  date_format: string;
}

const TYPE_EMOJI: Record<string, string> = {
  'Plat principal': '🍽️', 'Entrée': '🥗', 'Dessert': '🍰',
  'Street Food': '🌮', 'Soupe': '🍲', 'Bol': '🥣',
  'Salade': '🥙', 'Sauce': '🫙', 'Boisson': '🥤',
};

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= level ? 'opacity-100' : 'opacity-20'}>⭐</span>
      ))}
    </div>
  );
}

export default function PlatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { toggle, isFavori } = useFavoris();
  const { user, token } = useAuth();
  const [plat, setPlat] = useState<PlatDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [moyenne, setMoyenne] = useState(0);
  const [formAvis, setFormAvis] = useState({ auteur: '', note: 0, commentaire: '' });
  const [hoverNote, setHoverNote] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [avisMessage, setAvisMessage] = useState({ type: '', text: '' });

  const fetchAvis = async (id: string) => {
    try {
      const res = await fetch(`/api/recette/${id}/avis`);
      if (res.ok) {
        const data = await res.json();
        setAvis(data.avis);
        setMoyenne(data.moyenne);
      }
    } catch (error) {
      console.error('Erreur chargement avis:', error);
    }
  };

  useEffect(() => {
    async function fetchPlat() {
      try {
        const response = await fetch(`/api/recette/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setPlat(data);
        await fetchAvis(resolvedParams.id);
      } catch (error) {
        console.error('Erreur lors du chargement :', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlat();
  }, [resolvedParams.id]);

  const handleSubmitAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAvis.note) {
      setAvisMessage({ type: 'error', text: 'Veuillez sélectionner une note.' });
      return;
    }
    setSubmitting(true);
    setAvisMessage({ type: '', text: '' });
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/recette/${resolvedParams.id}/avis`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formAvis),
      });
      if (res.ok) {
        setAvisMessage({ type: 'success', text: 'Votre avis a été publié !' });
        setFormAvis({ auteur: '', note: 0, commentaire: '' });
        await fetchAvis(resolvedParams.id);
      } else {
        setAvisMessage({ type: 'error', text: "Erreur lors de l'ajout de l'avis." });
      }
    } catch {
      setAvisMessage({ type: 'error', text: 'Impossible de contacter le serveur.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    );
  }

  if (!plat) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center gap-3 text-center p-20">
        <div className="text-5xl">😕</div>
        <h2 className="text-xl font-semibold text-gray-800">Plat non trouvé</h2>
        <Link href="/plats" className="text-orange-600 hover:underline text-sm">← Retour à la liste</Link>
      </div>
    );
  }

  const typeEmoji = TYPE_EMOJI[plat.type] || '🍴';
  const difficultyLevel = plat.difficulty ?? 0;

  let ingredientsList: string[] = [];
  let etapesList: string[] = [];
  try { ingredientsList = plat.ingredients ? JSON.parse(plat.ingredients) : []; } catch { ingredientsList = []; }
  try { etapesList = plat.etapes ? JSON.parse(plat.etapes) : []; } catch { etapesList = []; }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-3xl mx-auto p-4 md:p-8">

        <Link href="/plats" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
          ← Retour à la liste
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

          {/* En-tête */}
          <div className="relative">
            {plat.image ? (
              <div className="relative h-56 overflow-hidden">
                <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded border border-white/30">
                      {typeEmoji} {plat.type}
                    </span>
                    {plat.regime && (
                      <span className="bg-green-500/30 text-white text-xs font-medium px-3 py-1 rounded border border-green-300/40">
                        {plat.regime}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-1">{plat.nom}</h1>
                  <p className="text-white/80 text-sm">
                    📍 {plat.pays}{plat.region ? `, ${plat.region}` : ''}{plat.continent ? ` · ${plat.continent}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => toggle(Number(plat.id))}
                  className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 transition-colors px-3 py-1.5 rounded text-white text-sm font-medium"
                >
                  {isFavori(Number(plat.id)) ? '❤️' : '🤍'} {isFavori(Number(plat.id)) ? 'Favori' : 'Ajouter'}
                </button>
              </div>
            ) : (
              <div className="bg-orange-600 p-8 text-white">
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded border border-white/30">
                    {typeEmoji} {plat.type}
                  </span>
                  {plat.regime && (
                    <span className="bg-green-500/30 text-white text-xs font-medium px-3 py-1 rounded border border-green-300/40">
                      {plat.regime}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-1">{plat.nom}</h1>
                <p className="text-white/80 text-sm">
                  📍 {plat.pays}{plat.region ? `, ${plat.region}` : ''}{plat.continent ? ` · ${plat.continent}` : ''}
                </p>
                <button
                  onClick={() => toggle(Number(plat.id))}
                  className="mt-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 transition-colors px-3 py-1.5 rounded text-white text-sm font-medium"
                >
                  {isFavori(Number(plat.id)) ? '❤️ Dans vos favoris' : '🤍 Ajouter aux favoris'}
                </button>
              </div>
            )}
          </div>

          {/* Corps */}
          <div className="p-6 md:p-8">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-gray-50 rounded-md p-4 text-center border border-gray-100">
                <div className="text-2xl mb-1">⏱️</div>
                <p className="text-xs text-gray-400 mb-0.5">Temps</p>
                <p className="text-lg font-bold text-gray-900">{plat.temps}<span className="text-sm font-normal text-gray-500"> min</span></p>
              </div>
              <div className="bg-gray-50 rounded-md p-4 text-center border border-gray-100">
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-xs text-gray-400 mb-0.5">Difficulté</p>
                <p className="text-lg font-bold text-gray-900">{difficultyLevel}<span className="text-sm font-normal text-gray-500"> / 5</span></p>
              </div>
              <div className="bg-gray-50 rounded-md p-4 text-center border border-gray-100">
                <div className="text-2xl mb-1">🗺️</div>
                <p className="text-xs text-gray-400 mb-0.5">Pays</p>
                <p className="text-sm font-bold text-gray-900">{plat.pays}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4 text-center border border-gray-100">
                <div className="text-2xl mb-1">🌍</div>
                <p className="text-xs text-gray-400 mb-0.5">Continent</p>
                <p className="text-sm font-bold text-gray-900">{plat.continent || '—'}</p>
              </div>
            </div>

            {/* Note moyenne */}
            {moyenne > 0 && (
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                <span className="text-yellow-400">{'⭐'.repeat(Math.round(moyenne))}{'☆'.repeat(5 - Math.round(moyenne))}</span>
                <span className="font-semibold text-gray-900">{moyenne}/5</span>
                <span className="text-gray-400">· {avis.length} avis</span>
              </div>
            )}

            {/* Piquant visuel */}
            {difficultyLevel > 0 && (
              <div className="mb-6 flex items-center gap-4 bg-orange-50 rounded-md p-4 border border-orange-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Niveau de difficulté</p>
                  <DifficultyDots level={difficultyLevel} />
                </div>
                <p className="text-sm text-orange-700 font-medium ml-auto">
                  {difficultyLevel <= 1 ? 'Doux' : difficultyLevel <= 2 ? 'Léger' : difficultyLevel <= 3 ? 'Moyen' : difficultyLevel <= 4 ? 'Fort' : 'Très fort 🔥'}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">À propos</h2>
              <p className="text-gray-700 leading-relaxed">
                {plat.description || 'Aucune description disponible.'}
              </p>
            </div>

            {/* Ingrédients */}
            {ingredientsList.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Ingrédients</h2>
                <div className="bg-gray-50 rounded-md border border-gray-100 p-5">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ingredientsList.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Étapes */}
            {etapesList.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Préparation</h2>
                <div className="space-y-3">
                  {etapesList.map((etape, i) => (
                    <div key={i} className="flex gap-4 items-start bg-gray-50 rounded-md p-4 border border-gray-100">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 text-sm leading-relaxed pt-0.5">{etape}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Avis */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Avis</h2>
                {avis.length > 0 && (
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded">
                    {moyenne}/5 · {avis.length} avis
                  </span>
                )}
              </div>

              {avis.length > 0 ? (
                <div className="space-y-3 mb-8">
                  {avis.map((a) => (
                    <div key={a.id} className="bg-gray-50 rounded-md p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-xs font-bold">
                            {(a.auteur || 'A')[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{a.auteur || 'Anonyme'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm">{'⭐'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</span>
                          <span className="text-xs text-gray-400">{a.date_format}</span>
                        </div>
                      </div>
                      {a.commentaire && (
                        <p className="text-gray-600 text-sm leading-relaxed pl-9">{a.commentaire}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-6 border border-dashed border-gray-200 rounded-md">
                  <p className="text-gray-400 text-sm">Aucun avis pour l'instant. Soyez le premier !</p>
                </div>
              )}

              {/* Formulaire avis */}
              <div className="bg-gray-50 rounded-md border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Laisser un avis</h3>

                {avisMessage.text && (
                  <div className={`p-3 rounded-md mb-4 text-sm font-medium ${
                    avisMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {avisMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmitAvis} className="space-y-4">
                  {user ? (
                    <p className="text-sm text-gray-600">
                      Publié en tant que <span className="font-medium text-gray-900">{user.nom}</span>
                    </p>
                  ) : (
                    <input
                      type="text"
                      placeholder="Votre nom (optionnel)"
                      value={formAvis.auteur}
                      onChange={(e) => setFormAvis((prev) => ({ ...prev, auteur: e.target.value }))}
                      className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-gray-900 placeholder-gray-400"
                    />
                  )}

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Votre note *</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormAvis((prev) => ({ ...prev, note: star }))}
                          onMouseEnter={() => setHoverNote(star)}
                          onMouseLeave={() => setHoverNote(0)}
                          className="text-3xl transition-transform hover:scale-110 cursor-pointer"
                        >
                          {star <= (hoverNote || formAvis.note) ? '⭐' : '☆'}
                        </button>
                      ))}
                      {formAvis.note > 0 && (
                        <span className="self-center ml-2 text-sm text-gray-600">
                          {['', 'Déçu', 'Moyen', 'Bien', 'Très bien', 'Excellent !'][formAvis.note]}
                        </span>
                      )}
                    </div>
                  </div>

                  <textarea
                    placeholder="Décrivez votre expérience avec ce plat..."
                    value={formAvis.commentaire}
                    onChange={(e) => setFormAvis((prev) => ({ ...prev, commentaire: e.target.value }))}
                    rows={3}
                    className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none text-sm text-gray-900 placeholder-gray-400"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 rounded-md font-medium text-sm text-white transition-colors ${
                      submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {submitting ? 'Publication...' : 'Publier mon avis'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
