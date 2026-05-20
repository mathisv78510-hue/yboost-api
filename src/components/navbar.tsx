'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useAuth } from "../lib/useAuth";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q') as string;
    if (query.trim()) {
      router.push(`/plats?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/plats');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍽️</span>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 leading-tight">Plats du Monde</span>
              <span className="text-xs text-gray-400">Cuisine globale</span>
            </div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex flex-1 max-w-md items-center gap-2" role="search">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder="Rechercher un plat..."
              className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Chercher
          </button>
        </form>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Link href="/plats" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            Catalogue
          </Link>
          <Link href="/favoris" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1">
            ❤️ Favoris
          </Link>
          <Link href="/ajout-plat" className="px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors">
            + Ajouter
          </Link>

          {!loading && (
            user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <span className="text-sm text-gray-700 font-medium">👤 {user.nom}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
                <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                  Connexion
                </Link>
                <Link href="/inscription" className="px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-md transition-colors">
                  S'inscrire
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
