// src/components/RightRail/RecommendationsRail.jsx
import { Link } from "react-router-dom";
import { useRightRail } from "../../hooks/useRecommendations";

export default function RecommendationsRail({ imdbId }) {
  const { data, isLoading, error } = useRightRail(imdbId, 15);

  if (isLoading)
    return <div style={{ color: "#8a8f98" }}>Загрузка рекомендаций…</div>;
  if (error)
    return <div style={{ color: "#8a8f98" }}>Ошибка загрузки рекомендаций</div>;

  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
    ? data
    : [];

  const usableItems = items.filter(m => m && (m.id != null || m.movieId != null));

  if (usableItems.length === 0)
    return <div style={{ color: "#8a8f98" }}>Рекомендаций пока нет</div>;

  return (
    <aside>
      <h3 style={{ marginTop: 0 }}>Рекомендации</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {usableItems.map(m => {
          const id = m.id ?? m.movieId;
          const poster =
            m.posterUrl ||
            m.poster ||
            `https://via.placeholder.com/120x68/16181d/ffffff?text=${encodeURIComponent(
              m.title || ""
            )}`;
          return (
            <Link
              key={id}
              to={`/movie/${id}`}
              style={{
                display: "flex",
                gap: 12,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={poster}
                alt={m.title}
                width={120}
                height={68}
                style={{
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#16181d",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{m.title}</div>
                {m.year && (
                  <div style={{ fontSize: 12, color: "#8a8f98" }}>{m.year}</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
