import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-amber-900/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-orange-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6 nav-wrap">
        <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          {"Les plats du monde"}
        </div>
        <form className="flex w-full max-w-xs items-center gap-2 md:max-w-sm" role="search" aria-label="Recherche">
          <input
            type="search"
            name="q"
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-orange-600 bg-amber-950/60 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
          <button
            type="submit"
            className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          >
            Chercher
          </button>
        </form>
      </div>
    </nav>
  );
}