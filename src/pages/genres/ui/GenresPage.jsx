import React, { useState } from "react";
import { useGenres } from "../../shared/hooks/useGenres";
import { useMovies } from "../../features/movies/model/useMovies";
import MovieGrid from "../../shared/ui/MovieGrid";
import "../../shared/styles/pages/Genres.css";

export default function GenresPage() {
  const { data: genres = [] } = useGenres();
  const { data: movies = [] } = useMovies();
  const [selected, setSelected] = useState(null);

  const filtered = selected
    ? movies.filter(m =>
        (m.genre || "").toLowerCase().includes(selected.toLowerCase())
      )
    : movies;

  return (
    <div className="container genres-page">
      <h1>Жанры</h1>

      <div className="genres-row">
        {genres.map(g => (
          <button
            key={g.id}
            className={`chip ${selected === g.name ? "active" : ""}`}
            onClick={() =>
              setSelected(selected === g.name ? null : g.name)
            }
          >
            {g.name}
          </button>
        ))}
      </div>

      <MovieGrid movies={filtered} />
    </div>
  );
}