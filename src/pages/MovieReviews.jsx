import { useState } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import { useReviewsByMovie } from "../hooks/useReviews";

export default function MovieReviews() {
    const { movieId } = useParams();
    const numericMovieId = Number(movieId);

    const [page, setPage] = useState(0);

    const { data, isLoading } = useReviewsByMovie(numericMovieId, page, 20);

    const items = data?.items ?? [];

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
            <h2>Отзывы</h2>

            {isLoading && <div>Загрузка…</div>}
            {!isLoading && items.length === 0 && <div>Отзывов пока нет</div>}

            <div style={{ display: "grid", gap: 12 }}>
                {items.map((r) => (
                    <ReviewCard
                        key={r.id}
                        review={{ ...r, body: r.content }}
                        isOwner={false}
                    />
                ))}
            </div>

            {data?.hasMore && (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                    <button onClick={() => setPage((p) => p + 1)}>
                        Загрузить ещё
                    </button>
                </div>
            )}
        </div>
    );
}
