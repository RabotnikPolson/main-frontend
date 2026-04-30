// src/components/MovieGrid.jsx
import React from "react";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies = [] }) {
  if (!movies.length) return <div className="empty-state">Контент не найден</div>;
  return (
    <div className="movie-grid">
      {movies.map(m => (
        <MovieCard key={m.id ?? m.imdbId ?? m.title} movie={m} />
      ))}
    </div>
  );
}