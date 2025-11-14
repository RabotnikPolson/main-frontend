// src/pages/Favorites.jsx
import React, { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../hooks/useMovies';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyFavorites, addFavoriteByImdb, removeFavoriteByImdb } from '../shared/api/favorites';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages/Favorites.css';

const localKey = (user='guest') => `favorites_${user}`;

export default function Favorites(){
  const { data: movies = [] } = useMovies();
  const qc = useQueryClient();
  const { user } = useAuth();
  const username = user?.username ?? null;

  const { data: remoteFavs = [], isLoading: favsLoading } = useQuery({
    queryKey: ['favorites', username],
    queryFn: async () => {
      if (!username) return [];
      const data = await getMyFavorites();
      return Array.isArray(data) ? data.map(m => m.imdbId ?? m.imdbID ?? null).filter(Boolean) : [];
    },
    enabled: !!username,
    staleTime: 30_000,
  });

  const addMut = useMutation({
    mutationFn: (imdbId) => addFavoriteByImdb(imdbId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites', username] })
  });
  const delMut = useMutation({
    mutationFn: (imdbId) => removeFavoriteByImdb(imdbId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites', username] })
  });

  const [localFavs, setLocalFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(localKey()) || '[]'); } catch { return []; }
  });
  useEffect(() => { if (!username) try { localStorage.setItem(localKey(), JSON.stringify(localFavs)); } catch {} }, [localFavs, username]);

  const favs = username ? remoteFavs : localFavs;
  const favMovies = movies.filter(m => favs.includes(m.imdbId));

  const toggle = (imdbId) => {
    if (username) {
      remoteFavs.includes(imdbId) ? delMut.mutate(imdbId) : addMut.mutate(imdbId);
    } else {
      setLocalFavs(prev => prev.includes(imdbId) ? prev.filter(x=>x!==imdbId) : [imdbId, ...prev]);
    }
  };

  return (
    <div className="container favorites-page">
      <h1>Избранное</h1>
      {username && favsLoading && <div className="loading">Загрузка…</div>}
      {favMovies.length === 0 ? <div className="empty">Пусто</div> : <MovieGrid movies={favMovies} onToggleFavorite={toggle} />}
      <div className="ids-hint">IDs: {JSON.stringify(favs)}</div>
    </div>
  );
}
