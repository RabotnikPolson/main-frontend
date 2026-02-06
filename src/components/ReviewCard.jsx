export default function ReviewCard({ review, onReadFull, isOwner, onEdit, onDelete }) {
    const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "";
    const content = review.content || "";
    const short = content.length > 180 ? content.slice(0, 180).trim() + "…" : content;

    return (
        <div
            className="card"
            style={{
                marginTop: 14,
                padding: 18,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flex: "0 0 auto",
                    }}
                >
                    {review.authorAvatarUrl ? (
                        <img
                            src={review.authorAvatarUrl}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <span style={{ opacity: 0.9 }}>👤</span>
                    )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 18, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {review.authorUsername || "Пользователь"}
                        </div>

                        {typeof review.score === "number" && (
                            <div
                                style={{
                                    marginLeft: "auto",
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: "rgba(0, 200, 120, 0.25)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    color: "#bfffe0",
                                    flex: "0 0 auto",
                                }}
                            >
                                {review.score}
                            </div>
                        )}
                    </div>

                    <div style={{ opacity: 0.7, marginTop: 4 }}>{date}</div>
                </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {short}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
                {content.length > 180 && (
                    <button
                        className="btn"
                        style={{ padding: "8px 12px" }}
                        onClick={() => onReadFull?.(review)}
                    >
                        Читать полностью
                    </button>
                )}

                {isOwner && (
                    <>
                        <button className="btn" style={{ padding: "8px 12px" }} onClick={onEdit}>
                            Изменить
                        </button>
                        <button className="btn" style={{ padding: "8px 12px" }} onClick={onDelete}>
                            Удалить
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
