import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/shared/styles/components/HeroBanner.css";

export default function HeroBanner({ movie }) {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  if (!movie) {
    return null;
  }

  const handleWatchNow = () => {
    navigate(`/movie/${movie.id || movie.imdbId}`);
  };

  const handleMoreInfo = () => {
    navigate(`/movie/${movie.id || movie.imdbId}`);
  };

  return (
    <header 
      className="hero-banner"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img 
        src={movie.posterUrl || movie.poster || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop"}
        alt={movie.title}
        className="hero-banner-image"
      />
      
      <div className="hero-banner-overlay"></div>
      <div className="hero-banner-gradient-left"></div>
      <div className="hero-banner-gradient-top"></div>

      <div className="hero-banner-content">
        <div className="hero-banner-label">ЭКСКЛЮЗИВНАЯ ПРЕМЬЕРА</div>
        
        <h1 className="hero-banner-title">{movie.title.toUpperCase()}</h1>
        
        <p className="hero-banner-description">
          {movie.description || movie.plot || "Увлекательное путешествие в мир кино"}
        </p>

        <div className="hero-banner-rating">
          <span className="rating-stars">
            {"★".repeat(Math.floor(Number(movie.imdbRating) / 2))}
            {"☆".repeat(5 - Math.floor(Number(movie.imdbRating) / 2))}
          </span>
          <span className="rating-value">{movie.imdbRating || "0"}/10</span>
          {movie.year && <span className="rating-year">{movie.year}</span>}
        </div>

        <div className="hero-banner-actions">
          <button 
            className="hero-btn hero-btn-primary"
            onClick={handleWatchNow}
          >
            <span className="hero-btn-icon">▶</span>
            Смотреть сейчас
          </button>
          
          <button 
            className="hero-btn hero-btn-secondary"
            onClick={handleMoreInfo}
          >
            <span className="hero-btn-icon">ℹ</span>
            Подробнее
          </button>
        </div>
      </div>
    </header>
  );
}
