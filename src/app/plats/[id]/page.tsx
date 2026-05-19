'use client';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useFavoris } from '../../../lib/useFavoris';

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
  piquant?: number;
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
  'Plat principal': '🍽️',
  'Entrée': '🥗',
  'Dessert': '🍰',
  'Street Food': '🌮',
  'Soupe': '🍲',
  'Bol': '🥣',
  'Salade': '🥙',
  'Sauce': '🫙',
  'Boisson': '🥤',
};

const CONTINENT_EMOJI: Record<string, string> = {
  'Afrique': '🌍',
  'Amérique': '🌎',
  'Asie': '🌏',
  'Europe': '🏰',
  'Océanie': '🏝️',
};

function PiquantDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xl transition-all ${i <= level ? 'opacity-100' : 'opacity-20 grayscale'}`}
        >
          🌶️
        </span>
      ))}
    </div>
  );
}

export default function PlatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { toggle, isFavori } = useFavoris();
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
      const res = await fetch(`/api/recette/${resolvedParams.id}/avis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center gap-4">
        <div className="text-6xl animate-bounce">🍴</div>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-sm animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!plat) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center gap-4 text-center p-20">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold text-gray-800">Plat non trouvé</h2>
        <Link href="/plats" className="text-orange-500 font-bold hover:underline">← Retour à la liste</Link>
      </div>
    );
  }

  const typeEmoji = TYPE_EMOJI[plat.type] || '🍴';
  const continentEmoji = CONTINENT_EMOJI[plat.continent] || '🌐';
  const piquantLevel = plat.piquant ?? 0;

  let ingredientsList: string[] = [];
  let etapesList: string[] = [];
  try { ingredientsList = plat.ingredients ? JSON.parse(plat.ingredients) : []; } catch { ingredientsList = []; }
  try { etapesList = plat.etapes ? JSON.parse(plat.etapes) : []; } catch { etapesList = []; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      <main className="max-w-4xl mx-auto p-4 md:p-8">

        {/* ── Carte principale ── */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-orange-100">

          {/* Bannière hero */}
          <div className="relative bg-gradient-to-br from-[#FF4D00] via-[#FF6B1A] to-[#FF8A00] p-10 md:p-14 text-white overflow-hidden">
            {/* Image de fond si disponible */}
            {plat.image && (
              <>
                <img src={plat.image} alt={plat.nom} className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00]/80 to-[#FF8A00]/70" />
              </>
            )}
            {/* Cercles décoratifs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute top-1/2 right-24 w-24 h-24 rounded-full bg-white/10" />
            {/* Bouton favori */}
            <button
              onClick={() => toggle(Number(plat.id))}
              className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 transition-all px-4 py-2 rounded-full text-white font-bold text-sm active:scale-95"
            >
              <span className="text-lg">{isFavori(Number(plat.id)) ? '❤️' : '🤍'}</span>
              {isFavori(Number(plat.id)) ? 'Dans vos favoris' : 'Ajouter aux favoris'}
            </button>

            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                {/* Badges type + régime */}
                <div className="flex gap-2 flex-wrap mb-5">
                  <span className="bg-white/25 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
                    {typeEmoji} {plat.type}
                  </span>
                  {plat.regime && (
                    <span className="bg-green-400/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-green-300/40">
                      🌿 {plat.regime}
                    </span>
                  )}
                </div>

                {/* Nom du plat */}
                <h1 className="text-4xl md:text-6xl font-black italic drop-shadow-lg leading-tight mb-3">
                  {plat.nom}
                </h1>

                {/* Localisation */}
                <p className="text-white/90 text-base font-medium flex items-center gap-2 flex-wrap">
                  <span>📍</span>
                  <span className="font-bold">{plat.pays}</span>
                  {plat.region && <><span className="opacity-60">·</span><span>{plat.region}</span></>}
                  {plat.continent && <><span className="opacity-60">·</span><span className="uppercase text-xs opacity-80 font-bold">{continentEmoji} {plat.continent}</span></>}
                </p>

                {/* Note moyenne */}
                {moyenne > 0 && (
                  <div className="flex items-center gap-2 mt-4 bg-white/15 rounded-2xl px-4 py-2 w-fit">
                    <span className="text-yellow-300 text-lg">
                      {'⭐'.repeat(Math.round(moyenne))}{'☆'.repeat(5 - Math.round(moyenne))}
                    </span>
                    <span className="font-black text-white">{moyenne}</span>
                    <span className="text-white/70 text-sm">/ 5 · {avis.length} avis</span>
                  </div>
                )}
              </div>

              {/* Grand emoji */}
              <div className="text-7xl md:text-8xl drop-shadow-xl select-none hidden md:block">
                {typeEmoji}
              </div>
            </div>

            {/* Vague décorative en bas */}
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
              <path d="M0,40 C360,0 1080,40 1440,10 L1440,40 Z" fill="white" />
            </svg>
          </div>

          {/* Corps */}
          <div className="p-8 md:p-12 pt-6">

            {/* ── Grille de stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-orange-50 rounded-2xl p-5 text-center border border-orange-100">
                <div className="text-3xl mb-1">⏱️</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Temps</p>
                <p className="text-xl font-black text-gray-900">{plat.temps}<span className="text-sm font-bold text-gray-500"> min</span></p>
              </div>

              <div className="bg-red-50 rounded-2xl p-5 text-center border border-red-100">
                <div className="text-3xl mb-1">🌶️</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Piquant</p>
                <p className="text-xl font-black text-gray-900">{piquantLevel}<span className="text-sm font-bold text-gray-500"> / 5</span></p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 text-center border border-blue-100">
                <div className="text-3xl mb-1">🗺️</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pays</p>
                <p className="text-sm font-black text-gray-900 leading-tight">{plat.pays}</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-5 text-center border border-green-100">
                <div className="text-3xl mb-1">{continentEmoji}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Continent</p>
                <p className="text-sm font-black text-gray-900 leading-tight">{plat.continent || '—'}</p>
              </div>
            </div>

            {/* Niveau de piquant visuel */}
            {piquantLevel > 0 && (
              <div className="mb-10 bg-red-50/60 rounded-2xl p-5 border border-red-100 flex items-center gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Niveau de piquant</p>
                  <PiquantDots level={piquantLevel} />
                </div>
                <p className="text-sm text-red-600 font-bold ml-auto">
                  {piquantLevel <= 1 ? 'Doux' : piquantLevel <= 2 ? 'Léger' : piquantLevel <= 3 ? 'Moyen' : piquantLevel <= 4 ? 'Fort' : 'Très fort 🔥'}
                </p>
              </div>
            )}

            {/* ── Description ── */}
            <div className="mb-12">
              <h2 className="text-lg font-black uppercase tracking-widest text-gray-300 mb-4">
                À propos de ce plat
              </h2>
              <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-3xl border border-orange-100">
                <span className="absolute top-4 left-6 text-6xl text-orange-200 font-serif leading-none select-none">"</span>
                <p className="text-gray-700 leading-relaxed text-lg pt-4 px-4 relative z-10">
                  {plat.description || 'Aucune description disponible.'}
                </p>
                <span className="absolute bottom-2 right-6 text-6xl text-orange-200 font-serif leading-none select-none rotate-180">"</span>
              </div>
            </div>

            {/* ── Ingrédients ── */}
            {ingredientsList.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-300 mb-4">🥕 Ingrédients</h2>
                <div className="bg-orange-50/60 rounded-3xl border border-orange-100 p-6">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ingredientsList.map((ing, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                        <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Étapes ── */}
            {etapesList.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-300 mb-4">👨‍🍳 Préparation</h2>
                <div className="space-y-3">
                  {etapesList.map((etape, i) => (
                    <div key={i} className="flex gap-4 items-start bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white text-sm font-black flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-1">{etape}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section Avis ── */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-black text-gray-900">💬 Avis</h2>
                {avis.length > 0 && (
                  <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                    {moyenne}/5 · {avis.length} avis
                  </span>
                )}
              </div>

              {/* Liste */}
              {avis.length > 0 ? (
                <div className="space-y-4 mb-10">
                  {avis.map((a) => (
                    <div key={a.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-orange-200 transition-colors">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-black">
                            {(a.auteur || 'A')[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900">{a.auteur || 'Anonyme'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-base">
                            {'⭐'.repeat(a.note)}{'☆'.repeat(5 - a.note)}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{a.date_format}</span>
                        </div>
                      </div>
                      {a.commentaire && (
                        <p className="text-gray-600 text-sm leading-relaxed mt-2 pl-10">{a.commentaire}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 mb-6 border-2 border-dashed border-orange-200 rounded-2xl">
                  <div className="text-4xl mb-2">🌟</div>
                  <p className="text-gray-500 font-semibold">Aucun avis pour l'instant.</p>
                  <p className="text-gray-400 text-sm mt-1">Soyez le premier à donner votre avis !</p>
                </div>
              )}

              {/* Formulaire avis */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100 p-8">
                <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-tight">Ajoutez votre avis</h3>
                <p className="text-sm text-gray-400 mb-6">Partagez votre expérience avec ce plat</p>

                {avisMessage.text && (
                  <div className={`p-4 rounded-2xl mb-5 font-bold text-sm flex items-center gap-2 ${
                    avisMessage.type === 'success'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {avisMessage.type === 'success' ? '✅' : '❌'} {avisMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmitAvis} className="space-y-5">
                  <input
                    type="text"
                    placeholder="Votre nom (optionnel)"
                    value={formAvis.auteur}
                    onChange={(e) => setFormAvis((prev) => ({ ...prev, auteur: e.target.value }))}
                    className="w-full p-4 bg-white border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-gray-900 transition-all placeholder-gray-300"
                  />

                  <div className="bg-white rounded-2xl border border-orange-200 p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                      Votre note *
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormAvis((prev) => ({ ...prev, note: star }))}
                          onMouseEnter={() => setHoverNote(star)}
                          onMouseLeave={() => setHoverNote(0)}
                          className="text-4xl transition-all hover:scale-125 cursor-pointer"
                        >
                          {star <= (hoverNote || formAvis.note) ? '⭐' : '☆'}
                        </button>
                      ))}
                      {formAvis.note > 0 && (
                        <span className="self-center ml-2 text-sm font-bold text-orange-600">
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
                    className="w-full p-4 bg-white border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none resize-none text-gray-900 transition-all placeholder-gray-300"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95 ${
                      submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5'
                    }`}
                  >
                    {submitting ? '⏳ Publication...' : '🚀 Publier mon avis'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/plats"
            className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-orange-500 transition-colors uppercase text-xs tracking-widest"
          >
            ← Retour à la liste des plats
          </Link>
        </div>
      </main>
    </div>
  );
}
