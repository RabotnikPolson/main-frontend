// src/pages/MovieDetails.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMovie } from '../hooks/useMovie';
import { useAuth } from '../hooks/useAuth';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { getMyFavorites, addFavoriteByImdb, removeFavoriteByImdb } from '../shared/api/favorites';
import '../styles/pages/MovieDetails.css';

export default function MovieDetails() {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, error } = useMovie(imdbId);
  const { user } = useAuth();
  const username = user?.username ?? null;
  const qc = useQueryClient();

  const localKey = (u = 'guest') => `favorites_${u}`;

  // remote favorites
  const { data: remoteFavs = [] } = useQuery({
    queryKey: ['favorites', username],
    queryFn: async () => {
      if (!username) return [];
      const data = await getMyFavorites();
      return Array.isArray(data)
        ? data.map(m => m.imdbId ?? m.imdbID ?? null).filter(Boolean)
        : [];
    },
    enabled: !!username,
    staleTime: 30_000,
  });

  const addMut = useMutation({
    mutationFn: (id) => addFavoriteByImdb(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['favorites', username] });
      const prev = qc.getQueryData(['favorites', username]) || [];
      qc.setQueryData(['favorites', username], (old = []) => (old.includes(id) ? old : [id, ...old]));
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(['favorites', username], ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites', username] }),
  });

  const delMut = useMutation({
    mutationFn: (id) => removeFavoriteByImdb(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['favorites', username] });
      const prev = qc.getQueryData(['favorites', username]) || [];
      qc.setQueryData(['favorites', username], (old = []) => old.filter(x => x !== id));
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(['favorites', username], ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites', username] }),
  });

  // local favorites (guest)
  const [localFavs, setLocalFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(localKey()) || '[]'); } catch { return []; }
  });
  useEffect(() => {
    if (!username) {
      try { localStorage.setItem(localKey(), JSON.stringify(localFavs)); } catch {}
    }
  }, [localFavs, username]);

  useEffect(() => { if (movie) document.title = `${movie.title} — Cinema App`; }, [movie]);

  const favs = username ? (remoteFavs || []) : localFavs;
  const isFavorite = useMemo(
    () => !!movie && favs.includes(movie.imdbId),
    [movie, favs]
  );

  const toggleFavorite = () => {
    if (!movie) return;
    const id = movie.imdbId;

    if (username) {
      // бэкенд + оптимистичные апдейты в мутациях
      return isFavorite ? delMut.mutate(id) : addMut.mutate(id);
    }

    // гостевой режим: локальный тумблер + немедленная запись
    setLocalFavs(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(x => x !== id) : [id, ...prev];
      try { localStorage.setItem(localKey(), JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  if (isLoading) return <div className="loading container">Загрузка фильма…</div>;
  if (isError) {
    return (
      <div className="container">
        <div className="error">Ошибка: {error?.message || 'Не удалось загрузить фильм'}</div>
        <button className="button button--ghost" onClick={() => navigate(-1)}>← Назад</button>
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="container">
        <div className="error">Фильм не найден</div>
        <Link to="/" className="button button--ghost">← На главную</Link>
      </div>
    );
  }

  const posterSrc = movie.poster || `https://via.placeholder.com/400x600/333/fff?text=${encodeURIComponent(movie.title)}`;

  return (
    <div className="container details-page">
      <Link to="/" className="back-link">← Назад</Link>

      <div className="details-layout">
        <div className="left">
          <img
            className="details-poster"
            src={posterSrc}
            alt={movie.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x600/333/fff?text=No+Image'; }}
          />

          <div className="actions">
            <button
              className="button"
              onClick={toggleFavorite}
              disabled={addMut.isLoading || delMut.isLoading}
            >
              {isFavorite ? '✓ В избранном' : 'Добавить в избранное'}
            </button>

            <button
                className="button button--ghost"
               onClick={() => navigate(`/movie/${imdbId}/watch`)}>
              ▶ Смотреть
            </button>
          </div>
        </div>

        <div className="details-info">
          <h2>{movie.title}</h2>

          <div className="meta">
            <strong>Год:</strong> {movie.year ?? '—'} · <strong>Жанр:</strong> {movie.genre || '—'} · <strong>IMDb:</strong> {movie.imdbRating ?? '—'}
          </div>

          <p className="description">
            <strong>Описание:</strong><br />
            {movie.description || 'Описание отсутствует.'}
          </p>

          <div className="more">
            <p><strong>Длительность:</strong> {movie.runtime ?? '—'}</p>
            <p><strong>Режиссёр:</strong> {movie.raw?.director || movie.raw?.Director || '—'}</p>
            <p><strong>Актёры:</strong> {movie.raw?.actors || movie.raw?.Actors || '—'}</p>
            <p><strong>Язык:</strong> {movie.raw?.language || movie.raw?.Language || '—'}</p>
            <p><strong>Страна:</strong> {movie.raw?.country || movie.raw?.Country || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
