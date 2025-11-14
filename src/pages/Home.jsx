// src/pages/Home.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import MovieGrid from '../components/MovieGrid';
import '../styles/pages/Home.css';

export default function Home() {
  const { data: movies = [], isLoading, isError, error } = useMovies();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();

  const filtered = movies.filter(m => {
    if (!q) return true;
    return m.title.toLowerCase().includes(q) || (m.genre || '').toLowerCase().includes(q);
  });

  return (
    <div className="container home-page">
      <h1>Импортированные фильмы</h1>
      {isLoading && <div className="loading">Загрузка…</div>}
      {isError && <div className="error">Ошибка: {error.message}</div>}
      {!isLoading && <MovieGrid movies={filtered} />}
    </div>
  );
}
