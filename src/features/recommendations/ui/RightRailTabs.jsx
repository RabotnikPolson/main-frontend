import React from "react";
import { Link } from "react-router-dom";
import { useRecommendationsTab } from "@/features/recommendations/model/useRecommendations";

const sections = [
  {
    type: "franchise",
    title: "Продолжение франшизы",
    description: "Похожие фильмы, предыстории и логичные сиквелы",
  },
  {
    type: "content",
    title: "Похожие фильмы",
    description: "Фильмы с похожей атмосферой и стилем",
  },
  {
    type: "hybrid",
    title: "Рекомендации для вас",
    description: "Автоматически подобранные подборки",
  },
];

export default function RightRailTabs({ movieId }) {
  return (
    <aside className="right-rail glass">
      <h3>Рекомендации</h3>

      <div className="right-rail-sections">
        {sections.map((section) => (
          <RecommendationBlock
            key={section.type}
            section={section}
            movieId={movieId}
          />
        ))}
      </div>
    </aside>
  );
}

function RecommendationBlock({ section, movieId }) {
  const { data, isLoading } = useRecommendationsTab(section.type, movieId, 7);
  const items = data?.recommendations || [];

  return (
    <div className="right-rail-block glass">
      <div className="block-header">
        <div>
          <h4>{section.title}</h4>
          <p>{section.description}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="right-rail-empty">Загрузка...</div>
      ) : items.length === 0 ? (
        <div className="right-rail-empty">Пока нет данных.</div>
      ) : (
        <div className="right-rail-list no-scrollbar">
          {items.map((item) => {
            const posterSrc =
              item.poster_url ||
              `https://placehold.jp/333/fff/300x450.png?text=${encodeURIComponent(item.title)}`;

            return (
              <Link
                key={item.movie_id}
                to={`/movie/${item.movie_id}`}
                className="rail-card"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img src={posterSrc} alt={item.title} loading="lazy" />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.year || "—"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
