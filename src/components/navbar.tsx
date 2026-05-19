'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Navbar() {
  const router = useRouter();

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

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="group flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <span className="text-white text-lg font-bold">🍽️</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Plats du Monde
              </h1>
              <span className="text-xs text-gray-500">Cuisine globale</span>
            </div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex flex-1 max-w-md items-center gap-2" role="search">
          <div className="relative flex-1 group">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400 group-focus-within:scale-110 group-focus-within:text-orange-600 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder="Rechercher un plat..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-orange-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:border-orange-300"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Chercher
          </button>
        </form>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/plats" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300">
            Catalogue
          </Link>
          <Link href="/favoris" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 flex items-center gap-1">
            ❤️ Favoris
          </Link>
          <Link href="/ajout-plat" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-200 rounded-lg transition-all duration-300 active:scale-95">
            + Ajouter
          </Link>
        </div>
        </div>
    </nav>
  );
}