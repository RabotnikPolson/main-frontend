import RatingStars from "./RatingStars";

export default function ReviewCard({ review, isOwner, onReact, onEdit }) {
  return (
    <div className="card">
      <div className="review-header">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>{review.username}</strong>
          <span className="muted">
            {review.createdAt
              ? new Date(review.createdAt).toLocaleString()
              : ""}
          </span>
        </div>

        {review.rating != null && (
          <div style={{ marginTop: 4 }}>
            <RatingStars value={review.rating} readOnly />
          </div>
        )}
      </div>

      <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{review.body}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {onReact && (
          <>
            <button onClick={() => onReact(review.id, "like")}>Полезно</button>
            <button onClick={() => onReact(review.id, "dislike")}>
              Бесполезно
            </button>
          </>
        )}
        {isOwner && onEdit && (
          <button onClick={() => onEdit(review)}>Редактировать</button>
        )}
      </div>
    </div>
  );
}
