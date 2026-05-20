'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/useAuth';

export default function InscriptionPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      login(data.token, data.user);
      router.push('/plats');
    } catch {
      setError('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-3xl">🍽️</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez Plats du Monde</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Nom</label>
              <input
                type="text"
                name="nom"
                required
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre prénom ou pseudo"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Mot de passe</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Au moins 6 caractères"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirm"
                required
                value={formData.confirm}
                onChange={handleChange}
                placeholder="Répétez le mot de passe"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-md text-sm font-medium text-white transition-colors mt-2 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-orange-600 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
