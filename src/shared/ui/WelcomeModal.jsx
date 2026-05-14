import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "@/features/movies";
import "@/shared/styles/components/WelcomeModal.css";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop";

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  const { data: movies = [] } = useMovies();

  // Same logic as HeroBanner — pick featured or first movie
  const featured =
    movies.find((m) => m.featured) || movies[0] || null;

  const posterUrl =
    featured?.posterUrl || featured?.poster || FALLBACK_POSTER;
  const movieTitle = featured?.title || "Лучшее кино";
  const movieDesc =
    featured?.description ||
    featured?.plot ||
    "Смотрите лучшие фильмы казахского и мирового кинематографа в одном месте.";
  const movieYear = featured?.year || "";
  const movieGenre = featured?.genre || "Кино";

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 350);
  };

  const handleWatch = () => {
    close();
    if (featured?.id || featured?.imdbId) {
      navigate(`/movie/${featured.id || featured.imdbId}`);
    } else {
      navigate("/");
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`wm-backdrop ${closing ? "wm-closing" : ""}`}
      onMouseDown={close}
    >
      <div className="wm-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="wm-close" onClick={close} aria-label="Закрыть">
          &#x2715;
        </button>

        {/* Left — text */}
        <div className="wm-content">
          <div className="wm-brand">СИНЕМА</div>
          <h2 className="wm-title">{movieTitle}</h2>
          <p className="wm-desc">{movieDesc}</p>
          <div className="wm-meta">
            {movieYear && <span className="wm-meta-item">{movieYear}</span>}
            {movieYear && <span className="wm-meta-dot" />}
            <span className="wm-meta-item">{movieGenre}</span>
          </div>
          <div className="wm-actions">
            <button className="wm-btn-primary" onClick={handleWatch}>
              Смотреть
            </button>
            <button className="wm-btn-ghost" onClick={close}>
              Не сейчас
            </button>
          </div>
        </div>

        {/* Right — poster */}
        <div className="wm-poster">
          <img
            src={posterUrl}
            alt={movieTitle}
            className="wm-poster-img"
          />
          <div className="wm-poster-fade" />
        </div>
      </div>
    </div>
  );
}
