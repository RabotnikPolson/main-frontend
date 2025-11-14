// src/components/RightRail/RecommendationsRail.jsx
import { useRightRail } from "../../hooks/useRecommendations";

export default function RecommendationsRail({ imdbId }) {
  const { data, isLoading, error } = useRightRail(imdbId, 15);

  if (isLoading)
    return <div style={{ color: "#8a8f98" }}>Загрузка рекомендаций…</div>;
  if (error)
    return <div style={{ color: "#8a8f98" }}>Ошибка загрузки рекомендаций</div>;

  // безопасно проверяем структуру
  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
    ? data
    : [];

  if (items.length === 0)
    return <div style={{ color: "#8a8f98" }}>Рекомендаций пока нет</div>;

  return (
    <aside>
      <h3 style={{ marginTop: 0 }}>Рекомендации</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((m) => (
          <a
            key={m.id || m.imdbId}
            href={`/movie/${m.imdbId || m.id}`}
            style={{
              display: "flex",
              gap: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={m.posterUrl || ""}
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
          </a>
        ))}
      </div>
    </aside>
  );
}
