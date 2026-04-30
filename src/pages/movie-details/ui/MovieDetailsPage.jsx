import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import {
  addFavorite,
  getFavoritesByUser,
  removeFavorite,
} from "@/features/favorites";
import { useMovie } from "@/features/movies";
import { useRecommendationsTab } from "@/features/recommendations";
import { useUserProfile } from "@/features/user-profile";
import "@/shared/styles/pages/MovieDetails.css";

function RecommendationTabs({ movieId }) {
  const tabs = [
    { id: "franchise", label: "РџСЂРѕРґРѕР»Р¶РµРЅРёРµ" },
    { id: "content", label: "РџРѕС…РѕР¶РёРµ (AI)" },
    { id: "director", label: "Р РµР¶РёСЃСЃРµСЂ" },
    { id: "actor", label: "РђРєС‚РµСЂС‹" },
    { id: "genre", label: "РџРѕ Р¶Р°РЅСЂСѓ" },
    { id: "collaborative-item", label: "РЎРјРѕС‚СЂСЏС‚ С‚Р°РєР¶Рµ" },
  ];

  const [activeTab, setActiveTab] = useState("franchise");
  const { data, isLoading } = useRecommendationsTab(activeTab, movieId, 6);
  const items = data?.recommendations || [];

  return (
    <div className="recommendation-tabs" style={{ marginTop: 40 }}>
      <h3 style={{ marginBottom: 16 }}>Р РµРєРѕРјРµРЅРґР°С†РёРё РґР»СЏ РІР°СЃ</h3>
      <div
        className="tabs-header"
        style={{
          display: "flex",
          gap: 12,
          borderBottom: "1px solid var(--border)",
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ color: "var(--text-secondary)" }}>Р—Р°РіСЂСѓР·РєР°...</div>
      ) : items.length === 0 ? (
        <div style={{ color: "var(--text-secondary)" }}>Р РµРєРѕРјРµРЅРґР°С†РёР№ РїРѕРєР° РЅРµС‚.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
          {items.map((movie) => {
            const posterSrc =
              movie.poster_url ||
              `https://placehold.jp/333/fff/300x450.png?text=${encodeURIComponent(movie.title)}`;

            return (
              <Link
                key={movie.movie_id}
                to={`/movie/${movie.movie_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <div
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    aspectRatio: "2/3",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <img
                    src={posterSrc}
                    alt={movie.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.jp/333/fff/300x450.png?text=No+Image";
                    }}
                  />
                </div>
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}>
                  {movie.title}
                </div>
                {movie.reason && (
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
                    {movie.reason}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: movie, isLoading, isError, error } = useMovie(id);
  const { user } = useAuth();
  const username = user?.username ?? null;
  const { data: profile } = useUserProfile();
  const userId = profile?.userId ?? null;
  const localKey = (value = "guest") => `favorites_${value}`;

  const { data: remoteFavIds = [], isLoading: favsLoading } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const data = await getFavoritesByUser(userId);
      return Array.isArray(data) ? data.map((item) => item.movieId) : [];
    },
    enabled: !!username && !!userId,
    staleTime: 30000,
  });

  const addMut = useMutation({
    mutationFn: (movieId) => addFavorite(userId, movieId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", userId] }),
  });

  const delMut = useMutation({
    mutationFn: (movieId) => removeFavorite(userId, movieId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", userId] }),
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
    if (movie) {
      document.title = `${movie.title} - Cinema App`;
    }
  }, [movie]);

  const favIds = username && userId ? remoteFavIds : localFavs;
  const movieId = movie?.id ?? null;
  const isFavorite = !!movieId && favIds.includes(movieId);

  const toggleFavorite = () => {
    if (!movieId) {
      return;
    }

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
      const updated = exists ? prev.filter((value) => value !== movieId) : [movieId, ...prev];

      try {
        localStorage.setItem(localKey(), JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  if (isLoading) {
    return <div className="loading container">Р—Р°РіСЂСѓР·РєР° С„РёР»СЊРјР°...</div>;
  }

  if (isError) {
    return (
      <div className="container">
        <div className="error">РћС€РёР±РєР°: {error?.message || "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ С„РёР»СЊРј"}</div>
        <button className="button button--ghost" onClick={() => navigate(-1)}>
          РќР°Р·Р°Рґ
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container">
        <div className="error">Р¤РёР»СЊРј РЅРµ РЅР°Р№РґРµРЅ</div>
        <Link to="/" className="button button--ghost">
          РќР° РіР»Р°РІРЅСѓСЋ
        </Link>
      </div>
    );
  }

  const posterSrc =
    movie.poster ||
    `https://placehold.jp/333/fff/400x600.png?text=${encodeURIComponent(movie.title)}`;

  return (
    <div className="container details-page">
      <Link to="/" className="back-link">
        РќР°Р·Р°Рґ
      </Link>

      <div className="details-layout">
        <div className="left">
          <img
            className="details-poster"
            src={posterSrc}
            alt={movie.title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.jp/333/fff/400x600.png?text=No+Image";
            }}
          />

          <div className="actions">
            <button
              className="button"
              onClick={toggleFavorite}
              disabled={addMut.isPending || delMut.isPending || favsLoading}
            >
              {isFavorite ? "Р’ РёР·Р±СЂР°РЅРЅРѕРј" : "Р”РѕР±Р°РІРёС‚СЊ РІ РёР·Р±СЂР°РЅРЅРѕРµ"}
            </button>

            <button className="button button--ghost" onClick={() => navigate(`/movie/${id}/watch`)}>
              РЎРјРѕС‚СЂРµС‚СЊ
            </button>
          </div>
        </div>

        <div className="details-info">
          <h2>{movie.title}</h2>

          <div className="meta">
            <strong>Р“РѕРґ:</strong> {movie.year ?? "-"} · <strong>Р–Р°РЅСЂ:</strong> {movie.genre || "-"} ·{" "}
            <strong>IMDb:</strong> {movie.imdbRating ?? "-"}
          </div>

          <p className="description">
            <strong>РћРїРёСЃР°РЅРёРµ:</strong>
            <br />
            {movie.description || "РћРїРёСЃР°РЅРёРµ РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚."}
          </p>

          <div className="more">
            <p>
              <strong>Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ:</strong> {movie.runtime ?? "-"}
            </p>
            <p>
              <strong>Р РµР¶РёСЃСЃРµСЂ:</strong> {movie.raw?.director || movie.raw?.Director || "-"}
            </p>
            <p>
              <strong>РђРєС‚С‘СЂС‹:</strong> {movie.raw?.actors || movie.raw?.Actors || "-"}
            </p>
            <p>
              <strong>РЇР·С‹Рє:</strong> {movie.raw?.language || movie.raw?.Language || "-"}
            </p>
            <p>
              <strong>РЎС‚СЂР°РЅР°:</strong> {movie.raw?.country || movie.raw?.Country || "-"}
            </p>
          </div>
        </div>
      </div>

      <RecommendationTabs movieId={movie.id} />
    </div>
  );
}
