'use client';

import { useState } from 'react';

interface FormRecetteProps {
  onRecetteCreated?: () => void;
}

export function FormRecette({ onRecetteCreated }: FormRecetteProps) {
  const [formData, setFormData] = useState({
    nom: '',
    pays: '',
    region: '',
    continent: '',
    type: '',
    description: '',
    piquant: 0,
    temps: 30,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'piquant' || name === 'temps' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/recette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ Erreur: ${data.message}`);
        return;
      }

      setMessage(`✅ Recette "${formData.nom}" créée avec succès!`);
      setFormData({ nom: '', pays: '', region: '', continent: '', type: '', description: '', piquant: 0, temps: 30 });
      onRecetteCreated?.();
    } catch (error) {
      setMessage('❌ Erreur lors de la création');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const types = ['Plat principal', 'Entrée', 'Dessert', 'Street food', 'Soupe', 'Bol', 'Salade', 'Sauce', 'Boisson'];
  const continents = ['Afrique', 'Amérique', 'Asie', 'Europe', 'Océanie'];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">➕ Ajouter une recette</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ligne 1: Nom */}
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
            Nom de la recette *
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="ex: Pizza Margherita"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Ligne 2: Pays, Région */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pays" className="block text-sm font-medium text-gray-700">
              Pays *
            </label>
            <input
              type="text"
              id="pays"
              name="pays"
              value={formData.pays}
              onChange={handleChange}
              placeholder="ex: Italie"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Région
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="ex: Rome"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Ligne 3: Continent, Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="continent" className="block text-sm font-medium text-gray-700">
              Continent
            </label>
            <select
              id="continent"
              name="continent"
              value={formData.continent}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Sélectionnez...</option>
              {continents.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type de plat
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Sélectionnez...</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ligne 4: Piquant, Temps */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="piquant" className="block text-sm font-medium text-gray-700">
              Niveau de piquant (0-5)
            </label>
            <input
              type="number"
              id="piquant"
              name="piquant"
              value={formData.piquant}
              onChange={handleChange}
              min="0"
              max="5"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="temps" className="block text-sm font-medium text-gray-700">
              Temps de préparation (min)
            </label>
            <input
              type="number"
              id="temps"
              name="temps"
              value={formData.temps}
              onChange={handleChange}
              min="1"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez le plat..."
            rows={3}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {message && (
          <div className={`rounded-md p-3 text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Création en cours...' : 'Créer la recette'}
        </button>
      </form>
    </div>
  );
}
