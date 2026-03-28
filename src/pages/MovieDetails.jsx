import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useMovie } from "../hooks/useMovie";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { useRecommendationsTab } from "../hooks/useRecommendations";
import {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
} from "../shared/api/favorites";
import "../styles/pages/MovieDetails.css";

function RecommendationTabs({ movieId }) {
  const tabs = [
    { id: "franchise", label: "Продолжение" },
    { id: "content", label: "Похожие (AI)" },
    { id: "director", label: "Режиссер" },
    { id: "actor", label: "Актеры" },
    { id: "genre", label: "По жанру" },
    { id: "collaborative-item", label: "Смотрят также" },
  ];

  const [activeTab, setActiveTab] = useState("franchise");
  const { data, isLoading } = useRecommendationsTab(activeTab, movieId, 6);

  const items = data?.recommendations || [];

  return (
    <div className="recommendation-tabs" style={{ marginTop: 40 }}>
      <h3 style={{ marginBottom: 16 }}>Рекомендации для вас</h3>
      <div className="tabs-header" style={{ display: "flex", gap: 12, borderBottom: "1px solid var(--border)", marginBottom: 16, overflowX: "auto", paddingBottom: 8 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 16px",
              background: activeTab === t.id ? "var(--primary)" : "transparent",
              color: activeTab === t.id ? "#fff" : "var(--text-secondary)",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              whiteSpace: "nowrap"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ color: "var(--text-secondary)" }}>Загрузка похожих фильмов...</div>
      ) : items.length === 0 ? (
        <div style={{ color: "var(--text-secondary)" }}>В этой категории пока нет рекомендаций.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
          {items.map(m => {
            const posterSrc = m.poster_url || `https://placehold.jp/333/fff/300x450.png?text=${encodeURIComponent(m.title)}`;
            return (
            <Link key={m.movie_id} to={`/movie/${m.movie_id}`} style={{ textDecoration: "none", color: "inherit" }} onClick={() => window.scrollTo(0,0)}>
              <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "2/3", background: "var(--surface)", border: "1px solid var(--border)" }}>
                <img 
                  src={posterSrc} 
                  alt={m.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e) => { e.currentTarget.src = "https://placehold.jp/333/fff/300x450.png?text=No+Image"; }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}>{m.title}</div>
              {m.reason && <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{m.reason}</div>}
            </Link>
          )})}
        </div>
      )}
    </div>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: movie, isLoading, isError, error } = useMovie(id);
  const { user } = useAuth();
  const username = user?.username ?? null;
  const { data: profile } = useUserProfile();
  const userId = profile?.userId ?? null;

  const localKey = (u = "guest") => `favorites_${u}`;

  const {
    data: remoteFavIds = [],
    isLoading: favsLoading,
  } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await getFavoritesByUser(userId);
      return Array.isArray(data) ? data.map((w) => w.movieId) : [];
    },
    enabled: !!username && !!userId,
    staleTime: 30000,
  });

  const addMut = useMutation({
    mutationFn: (movieId) => addFavorite(userId, movieId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["favorites", userId],
      }),
  });

  const delMut = useMutation({
    mutationFn: (movieId) => removeFavorite(userId, movieId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["favorites", userId],
      }),
  });

  const [localFavs, setLocalFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(localKey()) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!username) {
      try {
        localStorage.setItem(localKey(), JSON.stringify(localFavs));
      } catch {}
    }
  }, [localFavs, username]);

  useEffect(() => {
    if (movie) document.title = `${movie.title} — Cinema App`;
  }, [movie]);

  const favIds = username && userId ? remoteFavIds : localFavs;
  const movieId = movie?.id ?? null;
  const isFavorite = !!movieId && favIds.includes(movieId);

  const toggleFavorite = () => {
    if (!movieId) return;

    if (username && userId) {
      if (isFavorite) {
        delMut.mutate(movieId);
      } else {
        addMut.mutate(movieId);
      }
      return;
    }

    setLocalFavs((prev) => {
      const exists = prev.includes(movieId);
      const updated = exists
        ? prev.filter((x) => x !== movieId)
        : [movieId, ...prev];
      try {
        localStorage.setItem(localKey(), JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  if (isLoading) {
    return <div className="loading container">Загрузка фильма…</div>;
  }

  if (isError) {
    return (
      <div className="container">
        <div className="error">
          Ошибка: {error?.message || "Не удалось загрузить фильм"}
        </div>
        <button
          className="button button--ghost"
          onClick={() => navigate(-1)}
        >
          ← Назад
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container">
        <div className="error">Фильм не найден</div>
        <Link to="/" className="button button--ghost">
          ← На главную
        </Link>
      </div>
    );
  }

  const posterSrc =
    movie.poster ||
    `https://placehold.jp/333/fff/400x600.png?text=${encodeURIComponent(
      movie.title
    )}`;

  return (
    <div className="container details-page">
      <Link to="/" className="back-link">
        ← Назад
      </Link>

      <div className="details-layout">
        <div className="left">
          <img
            className="details-poster"
            src={posterSrc}
            alt={movie.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.jp/333/fff/400x600.png?text=No+Image";
            }}
          />

          <div className="actions">
            <button
              className="button"
              onClick={toggleFavorite}
              disabled={addMut.isLoading || delMut.isLoading || favsLoading}
            >
              {isFavorite ? "✓ В избранном" : "Добавить в избранное"}
            </button>

            <button
              className="button button--ghost"
              onClick={() => navigate(`/movie/${id}/watch`)}
            >
              ▶ Смотреть
            </button>
          </div>
        </div>

        <div className="details-info">
          <h2>{movie.title}</h2>

          <div className="meta">
            <strong>Год:</strong> {movie.year ?? "—"} ·{" "}
            <strong>Жанр:</strong> {movie.genre || "—"} ·{" "}
            <strong>IMDb:</strong> {movie.imdbRating ?? "—"}
          </div>

          <p className="description">
            <strong>Описание:</strong>
            <br />
            {movie.description || "Описание отсутствует."}
          </p>

          <div className="more">
            <p>
              <strong>Длительность:</strong> {movie.runtime ?? "—"}
            </p>
            <p>
              <strong>Режиссёр:</strong>{" "}
              {movie.raw?.director || movie.raw?.Director || "—"}
            </p>
            <p>
              <strong>Актёры:</strong>{" "}
              {movie.raw?.actors || movie.raw?.Actors || "—"}
            </p>
            <p>
              <strong>Язык:</strong>{" "}
              {movie.raw?.language || movie.raw?.Language || "—"}
            </p>
            <p>
              <strong>Страна:</strong>{" "}
              {movie.raw?.country || movie.raw?.Country || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* NEW RECOMMENDATION TABS SECTION */}
      <RecommendationTabs movieId={movie.id} />
    </div>
  );
}
