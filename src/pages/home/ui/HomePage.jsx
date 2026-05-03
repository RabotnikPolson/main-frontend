import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useMovies } from "@/features/movies";
import HomeHeroCarousel from "@/pages/home/ui/HomeHeroCarousel";
import { MovieGrid } from "@/shared/ui";
import "@/shared/styles/pages/Home.css";

export default function HomePage() {
  const { data: movies = [], isLoading, isError, error } = useMovies();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").toLowerCase();

  const { user } = useAuth();
  const userId = user?.profile?.userId || user?.id || null;

  const filtered = movies.filter((movie) => {
    if (!q) {
      return true;
    }

    return (
      movie.title.toLowerCase().includes(q) ||
      (movie.genre || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container home-page">
      <HomeHeroCarousel userId={userId} />

      <h1>Импортированные фильмы</h1>
      {isLoading && <div className="loading">Загрузка...</div>}
      {isError && <div className="error">Ошибка: {error.message}</div>}
      {!isLoading && <MovieGrid movies={filtered} />}
    </div>
  );
}
