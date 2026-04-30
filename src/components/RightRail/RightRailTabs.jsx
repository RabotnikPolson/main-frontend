// src/components/RightRail/RightRailTabs.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecommendationsTab } from "../../hooks/useRecommendations";

export default function RightRailTabs({ movieId }) {
const tabs = [
{ id: "hybrid", label: "Умные" },
{ id: "franchise", label: "Франшиза" },
{ id: "content", label: "Похожие (AI)" },
{ id: "director", label: "Режиссер" },
{ id: "actor", label: "Актеры" },
{ id: "genre", label: "По жанру" },
{ id: "collaborative-item", label: "Зрители" },
];

const [activeTab, setActiveTab] = useState("hybrid");
const [copiedId, setCopiedId] = useState(null);
const { data, isLoading } = useRecommendationsTab(activeTab, movieId, 15);

const items = data?.recommendations || [];

const handleCopy = (e, text, id) => {
e.preventDefault();
e.stopPropagation();
navigator.clipboard.writeText(text);
setCopiedId(id);
setTimeout(() => setCopiedId(null), 2000);
};

return (
<aside style={{
display: "flex",
flexDirection: "column",
height: "calc(100vh - 100px)",
position: "sticky",
top: "80px",
overflow: "hidden"
}}>
<h3 style={{
marginTop: 0,
marginBottom: 16,
fontSize: 18,
fontWeight: 700,
color: "#fff"
}}>
Рекомендации
</h3>

  <div 
    className="no-scrollbar"
    style={{ 
      display: "flex", 
      gap: 8, 
      overflowX: "auto", 
      paddingBottom: 10, 
      marginBottom: 10,
      flexShrink: 0
    }}
  >
    {tabs.map(t => (
      <button
        key={t.id}
        onClick={() => setActiveTab(t.id)}
        style={{
          padding: "8px 16px",
          background: activeTab === t.id ? "#3b82f6" : "rgba(255,255,255,0.05)",
          color: "#fff",
          border: "none",
          borderRadius: 20,
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
          flexShrink: 0
        }}
      >
        {t.label}
      </button>
    ))}
  </div>

  <div 
    className="no-scrollbar"
    style={{ 
      flex: 1, 
      overflowY: "auto", 
      display: "flex", 
      flexDirection: "column", 
      gap: 12,
      paddingRight: 4
    }}
  >
    {isLoading ? (
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Загрузка...</div>
    ) : items.length === 0 ? (
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Нет рекомендаций.</div>
    ) : (
      items.map((m) => {
        const posterSrc = m.poster_url || `https://placehold.jp/16181d/ffffff/120x180.png?text=${encodeURIComponent(m.title)}`;
        return (
          <Link
            key={m.movie_id}
            to={`/movie/${m.movie_id}`}
            className="movie-card"
            style={{
              display: "flex",
              gap: 12,
              textDecoration: "none",
              color: "inherit",
              borderRadius: 12,
              flexShrink: 0,
              minHeight: "130px",
              background: "rgba(255,255,255,0.02)",
              padding: "6px"
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div style={{ flexShrink: 0, width: "90px", height: "130px" }}>
              <img
                src={posterSrc}
                alt={m.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                }}
              />
            </div>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "4px 0", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: 14, 
                  lineHeight: 1.2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {m.title}
                </div>
                <button
                  onClick={(e) => handleCopy(e, m.movie_id, m.movie_id)}
                  className="copy-btn"
                  style={{
                    background: copiedId === m.movie_id ? "#10b981" : "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: 4,
                    padding: "2px 6px",
                    color: "#fff",
                    fontSize: 9,
                    cursor: "pointer",
                    flexShrink: 0,
                    height: "fit-content"
                  }}
                >
                  {copiedId === m.movie_id ? "✓" : "ID"}
                </button>
              </div>
              
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                {m.year}
              </div>

              {m.score > 0 && (
                <div style={{ 
                  fontSize: 11, 
                  color: "#3b82f6", 
                  marginTop: "auto",
                  fontWeight: 600
                }}>
                  Индекс: {m.score.toFixed(1)}
                </div>
              )}
            </div>
          </Link>
        );
      })
    )}
  </div>

  <style dangerouslySetInnerHTML={{__html: `
    .no-scrollbar::-webkit-scrollbar {
      display: none !important;
    }
    .no-scrollbar {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }
    .movie-card {
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .movie-card:hover {
      background: rgba(255,255,255,0.06);
      transform: translateX(4px);
    }
    .copy-btn {
      opacity: 0;
      transition: opacity 0.2s;
    }
    .movie-card:hover .copy-btn {
      opacity: 1;
    }
  `}} />
</aside>
);
}