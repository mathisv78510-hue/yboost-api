'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputClass = 'w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-gray-900';

export default function AjoutPlatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    nom: '', pays: '', region: '', continent: '',
    type: 'Plat principal', regime: '', description: '',
    image: '', piquant: 0, temps: 30,
  });

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [etapes, setEtapes] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [etapeInput, setEtapeInput] = useState('');
  const etapeRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'piquant' || name === 'temps' ? Number(value) : value,
    }));
  };

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (!val) return;
    setIngredients((prev) => [...prev, val]);
    setIngredientInput('');
  };

  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));

  const addEtape = () => {
    const val = etapeInput.trim();
    if (!val) return;
    setEtapes((prev) => [...prev, val]);
    setEtapeInput('');
    etapeRef.current?.focus();
  };

  const removeEtape = (i: number) =>
    setEtapes((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/recette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ingredients, etapes }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Le plat a été ajouté avec succès !' });
        setTimeout(() => router.push('/plats'), 1500);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Une erreur est survenue.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Impossible de contacter le serveur.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      <main className="max-w-3xl mx-auto px-6 pt-12">

        <Link href="/plats" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold mb-8 transition-colors group">
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          Retour au catalogue
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-10 text-white text-center">
            <h1 className="text-4xl font-black italic mb-2">Ajouter un Plat</h1>
            <p className="opacity-90 font-medium">Partagez une nouvelle saveur avec le monde</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {message.text && (
              <div className={`p-4 rounded-2xl text-center font-bold ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* ── Infos générales ── */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-300 mb-4">Informations générales</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Nom du plat</label>
                  <input required name="nom" value={formData.nom} onChange={handleChange} className={inputClass} placeholder="Ex: Poulet Yassa" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Type de plat</label>
                  <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                    <option>Entrée</option>
                    <option>Plat principal</option>
                    <option>Dessert</option>
                    <option>Street Food</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Régime alimentaire</label>
                  <select name="regime" value={formData.regime} onChange={handleChange} className={inputClass}>
                    <option value="">Aucun / Non spécifié</option>
                    <option>Végétarien</option>
                    <option>Vegan</option>
                    <option>Sans gluten</option>
                    <option>Sans lactose</option>
                    <option>Halal</option>
                    <option>Casher</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Pays</label>
                  <input required name="pays" value={formData.pays} onChange={handleChange} className={inputClass} placeholder="Ex: Sénégal" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Région</label>
                  <input name="region" value={formData.region} onChange={handleChange} className={inputClass} placeholder="Ex: Casamance" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Continent</label>
                  <input name="continent" value={formData.continent} onChange={handleChange} className={inputClass} placeholder="Ex: Afrique" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Temps (min)</label>
                  <input type="number" name="temps" value={formData.temps} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              {/* Piquant */}
              <div className="space-y-2 mt-6">
                <div className="flex justify-between items-center px-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Niveau de piquant</label>
                  <span className="font-bold text-orange-600">{formData.piquant}/5 🌶️</span>
                </div>
                <input type="range" name="piquant" min="0" max="5" value={formData.piquant} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              {/* Description courte */}
              <div className="space-y-2 mt-6">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Description courte</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} placeholder="Résumez ce plat en une ou deux phrases..." />
              </div>

              {/* Image URL */}
              <div className="space-y-2 mt-6">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Image (URL)</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://exemple.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 rounded-2xl overflow-hidden h-44 border border-gray-100">
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Ingrédients ── */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-300 mb-4">
                🥕 Ingrédients
                {ingredients.length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs normal-case font-bold">
                    {ingredients.length}
                  </span>
                )}
              </p>

              {/* Liste */}
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {ingredients.map((ing, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 text-sm font-semibold px-3 py-1.5 rounded-full">
                      {ing}
                      <button type="button" onClick={() => removeIngredient(i)} className="text-orange-400 hover:text-red-500 transition-colors font-black leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  className={`${inputClass} flex-1`}
                  placeholder="Ex: 500g de poulet, 2 oignons..."
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-5 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all active:scale-95"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-2">Appuyez sur Entrée ou + pour ajouter</p>
            </div>

            {/* ── Étapes de préparation ── */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-300 mb-4">
                👨‍🍳 Étapes de préparation
                {etapes.length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs normal-case font-bold">
                    {etapes.length} étape{etapes.length > 1 ? 's' : ''}
                  </span>
                )}
              </p>

              {/* Liste des étapes */}
              {etapes.length > 0 && (
                <div className="space-y-2 mb-3">
                  {etapes.map((etape, i) => (
                    <div key={i} className="flex gap-3 items-start bg-gray-50 border border-gray-100 rounded-2xl p-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="flex-1 text-gray-700 text-sm leading-relaxed">{etape}</p>
                      <button type="button" onClick={() => removeEtape(i)} className="text-gray-300 hover:text-red-500 transition-colors font-black text-lg leading-none flex-shrink-0">×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2 items-end">
                <textarea
                  ref={etapeRef}
                  value={etapeInput}
                  onChange={(e) => setEtapeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addEtape();
                    }
                  }}
                  rows={2}
                  className={`${inputClass} flex-1 resize-none`}
                  placeholder={`Étape ${etapes.length + 1} : décrivez la préparation...`}
                />
                <button
                  type="button"
                  onClick={addEtape}
                  className="px-5 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all active:scale-95 self-stretch"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-2">Entrée pour ajouter · Shift+Entrée pour un saut de ligne</p>
            </div>

            {/* ── Bouton ── */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-[1.5rem] font-black text-xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0F172A] text-white hover:bg-black'
              }`}
            >
              {loading ? 'Création en cours...' : '🚀 Publier la recette'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
