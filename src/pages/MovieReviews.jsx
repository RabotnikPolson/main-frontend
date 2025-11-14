import { useState } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import { useReactReview } from "../hooks/useReviews";

export default function MovieReviews() {
  const { imdbId } = useParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("helpful");
  const { data, isLoading } = usePagedReviews(imdbId, page, 20, sort);
  const reactReview = useReactReview(imdbId);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Отзывы</h2>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="helpful">Полезные</option>
          <option value="new">Новые</option>
          <option value="rating_desc">Оценка ↓</option>
          <option value="rating_asc">Оценка ↑</option>
        </select>
      </div>

      {isLoading && <div style={{ color: "#8a8f98" }}>Загрузка…</div>}
      {!isLoading && data?.items?.length === 0 && (
        <div style={{ color: "#8a8f98" }}>Отзывов пока нет</div>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {data?.items?.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            isOwner={r.isOwner}
            onReact={(id, reaction) => reactReview.mutate({ id, reaction })}
          />
        ))}
      </div>

      {data?.hasMore && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <button onClick={() => setPage((p) => p + 1)}>Загрузить ещё</button>
        </div>
      )}
    </div>
  );
}
