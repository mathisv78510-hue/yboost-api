'use client';
import { useState, useEffect, useCallback } from 'react';

export function useFavoris() {
  const [favoris, setFavoris] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('favoris_plats');
      if (stored) setFavoris(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = useCallback((id: number) => {
    setFavoris((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem('favoris_plats', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isFavori = useCallback((id: number) => favoris.includes(id), [favoris]);

  return { favoris, toggle, isFavori };
}
