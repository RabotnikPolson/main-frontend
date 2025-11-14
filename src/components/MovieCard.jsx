import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const poster = movie.poster || `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(movie.title)}`;
  return (
    <Link to={`/movie/${movie.imdbId}`} className="movie-card">
      <div className="movie-thumb">
        <img src={poster} alt={movie.title} loading="lazy" onError={(e)=>e.currentTarget.src='https://via.placeholder.com/300x450/333/fff?text=No+Image'} />
      </div>
      <div className="movie-meta">
        <span className="movie-title">{movie.title}</span>
        <span className="movie-year">{movie.year ?? '—'}</span>
      </div>
    </Link>
  );
}
