import React from "react";
import { useSearchParams } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { useAuth } from "../hooks/useAuth";
import MovieGrid from "../components/MovieGrid";
import HeroCarousel from "../components/HeroCarousel";
import "../styles/pages/Home.css";

// ВАЖНО: Импортируй свой хук или контекст авторизации, чтобы получить userId
// import { useAuth } from "../hooks/useAuth"; 

export default function Home() {
  const { data: movies = [], isLoading, isError, error } = useMovies();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").toLowerCase();

  const { user } = useAuth();
  const userId = user?.profile?.userId || user?.id || null;

  const filtered = movies.filter((m) => {
    if (!q) return true;
    return (
        m.title.toLowerCase().includes(q) ||
        (m.genre || "").toLowerCase().includes(q)
    );
  });

  return (
      <div className="container home-page">
        {/* Карусель сверху - теперь передаем userId для AI рекомендаций */}
        <HeroCarousel userId={userId} />

        <h1>Импортированные фильмы</h1>
        {isLoading && <div className="loading">Загрузка…</div>}
        {isError && <div className="error">Ошибка: {error.message}</div>}
        {!isLoading && <MovieGrid movies={filtered} />}
      </div>
  );
}
