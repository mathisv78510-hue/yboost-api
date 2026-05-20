'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputClass = 'w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-gray-900';

export default function AjoutPlatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    nom: '', pays: '', region: '', continent: '',
    type: 'Plat principal', regime: '', description: '',
    image: '', difficulty: 0, temps: 30,
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
      [name]: name === 'difficulty' || name === 'temps' ? Number(value) : value,
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
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-2xl mx-auto px-6 pt-8">

        <Link href="/plats" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
          ← Retour au catalogue
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-orange-600 px-8 py-7 text-white">
            <h1 className="text-2xl font-bold mb-1">Ajouter un plat</h1>
            <p className="text-orange-100 text-sm">Partagez une nouvelle saveur avec le monde</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-7">
            {message.text && (
              <div className={`p-3 rounded-md text-sm font-medium ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Infos générales */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Informations générales</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Nom du plat</label>
                  <input required name="nom" value={formData.nom} onChange={handleChange} className={inputClass} placeholder="Ex: Poulet Yassa" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Type de plat</label>
                  <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                    <option>Entrée</option>
                    <option>Plat principal</option>
                    <option>Dessert</option>
                    <option>Street Food</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Régime alimentaire</label>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Pays</label>
                  <input required name="pays" value={formData.pays} onChange={handleChange} className={inputClass} placeholder="Ex: Sénégal" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Région</label>
                  <input name="region" value={formData.region} onChange={handleChange} className={inputClass} placeholder="Ex: Casamance" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Continent</label>
                  <input name="continent" value={formData.continent} onChange={handleChange} className={inputClass} placeholder="Ex: Afrique" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Temps (min)</label>
                  <input type="number" name="temps" value={formData.temps} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              {/* Piquant */}
              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-gray-600">Niveau de difficulté</label>
                  <span className="text-sm font-medium text-orange-600">{formData.difficulty}/5 ⭐</span>
                </div>
                <input type="range" name="difficulty" min="0" max="5" value={formData.difficulty} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              {/* Description */}
              <div className="space-y-1.5 mt-4">
                <label className="text-xs font-medium text-gray-600">Description courte</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} placeholder="Résumez ce plat en une ou deux phrases..." />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5 mt-4">
                <label className="text-xs font-medium text-gray-600">Image (URL)</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://exemple.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 rounded-md overflow-hidden h-40 border border-gray-200">
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

            {/* Ingrédients */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Ingrédients{ingredients.length > 0 && <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs normal-case font-medium">{ingredients.length}</span>}
              </p>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {ingredients.map((ing, i) => (
                    <span key={i} className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-800 text-xs font-medium px-2.5 py-1 rounded">
                      {ing}
                      <button type="button" onClick={() => removeIngredient(i)} className="text-orange-400 hover:text-red-500 transition-colors font-bold ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              )}

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
                  className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md transition-colors text-sm"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Appuyez sur Entrée ou + pour ajouter</p>
            </div>

            {/* Étapes */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Étapes de préparation{etapes.length > 0 && <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs normal-case font-medium">{etapes.length} étape{etapes.length > 1 ? 's' : ''}</span>}
              </p>

              {etapes.length > 0 && (
                <div className="space-y-2 mb-3">
                  {etapes.map((etape, i) => (
                    <div key={i} className="flex gap-3 items-start bg-gray-50 border border-gray-100 rounded-md p-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="flex-1 text-gray-700 text-sm leading-relaxed">{etape}</p>
                      <button type="button" onClick={() => removeEtape(i)} className="text-gray-300 hover:text-red-500 transition-colors font-bold text-base flex-shrink-0">×</button>
                    </div>
                  ))}
                </div>
              )}

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
                  placeholder={`Étape ${etapes.length + 1}...`}
                />
                <button
                  type="button"
                  onClick={addEtape}
                  className="px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md transition-colors text-sm self-stretch"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Entrée pour ajouter · Shift+Entrée pour un saut de ligne</p>
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-semibold text-white text-sm transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black'
              }`}
            >
              {loading ? 'Création en cours...' : 'Publier la recette'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
