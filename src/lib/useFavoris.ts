'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useFavoris() {
  const { user, token } = useAuth();
  const [favoris, setFavoris] = useState<number[]>([]);

  useEffect(() => {
    if (token) {
      fetch('/api/favoris', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.favoris) setFavoris(data.favoris);
        });
    } else {
      const stored = localStorage.getItem('favoris_plats');
      if (stored) setFavoris(JSON.parse(stored));
    }
  }, [token, user]);

  const toggle = async (id: number) => {
    if (token) {
      if (favoris.includes(id)) {
        await fetch(`/api/favoris/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoris(favoris.filter((x) => x !== id));
      } else {
        await fetch('/api/favoris', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recette_id: id }),
        });
        setFavoris([...favoris, id]);
      }
    } else {
      let next;
      if (favoris.includes(id)) {
        next = favoris.filter((x) => x !== id);
      } else {
        next = [...favoris, id];
      }
      localStorage.setItem('favoris_plats', JSON.stringify(next));
      setFavoris(next);
    }
  };

  const isFavori = (id: number) => favoris.includes(id);

  return { favoris, toggle, isFavori };
}
