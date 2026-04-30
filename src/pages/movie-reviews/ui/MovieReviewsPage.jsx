import { useState } from "react";
import { useParams } from "react-router-dom";
import { ReviewCard, useReviewsByMovie } from "@/features/reviews";

export default function MovieReviewsPage() {
  const { id } = useParams();
  const numericMovieId = Number(id);
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useReviewsByMovie(numericMovieId, page, 20);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore =
    typeof total === "number" ? (page + 1) * 20 < total : Boolean(data?.hasMore);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2>РћС‚Р·С‹РІС‹</h2>

      {isLoading && <div>Р—Р°РіСЂСѓР·РєР°...</div>}
      {isError && <div>РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РѕС‚Р·С‹РІРѕРІ</div>}
      {!isLoading && !isError && items.length === 0 && <div>РћС‚Р·С‹РІРѕРІ РїРѕРєР° РЅРµС‚</div>}

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((review) => (
          <ReviewCard key={review.id} review={{ ...review, body: review.content }} isOwner={false} />
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button onClick={() => setPage((value) => value + 1)}>Р—Р°РіСЂСѓР·РёС‚СЊ РµС‰С‘</button>
        </div>
      )}
    </div>
  );
}
