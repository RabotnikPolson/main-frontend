// src/components/ReviewFormModal.jsx
import { useEffect, useMemo, useState } from "react";

function ScorePicker({ value, onChange }) {
    // OKKO-style: 1..10
    return (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Array.from({ length: 10 }).map((_, i) => {
                const n = i + 1;
                const active = n <= value;
                return (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange(n)}
                        className="btn"
                        style={{
                            padding: "6px 10px",
                            opacity: active ? 1 : 0.45,
                            minWidth: 38,
                        }}
                    >
                        {n}
                    </button>
                );
            })}
        </div>
    );
}

export default function ReviewFormModal({ open, initial, onClose, onSubmit }) {
    const [content, setContent] = useState("");
    const [score, setScore] = useState(0);
    const [err, setErr] = useState("");

    const isEdit = useMemo(() => Boolean(initial?.id), [initial]);

    useEffect(() => {
        if (!open) return;
        setContent(initial?.content ?? "");
        setScore(initial?.score ?? 0);
        setErr("");
    }, [open, initial]);

    if (!open) return null;

    const handleSubmit = async () => {
        const trimmed = content.trim();

        if (!trimmed) {
            setErr("Текст отзыва не должен быть пустым.");
            return;
        }
        if (!score || score < 1 || score > 10) {
            setErr("Поставь оценку от 1 до 10.");
            return;
        }

        setErr("");
        await onSubmit({ content: trimmed, score });
    };

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: 760, width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <h3 className="section-title" style={{ margin: 0 }}>
                        {isEdit ? "Изменить отзыв" : "Написать отзыв"}
                    </h3>
                    <button className="btn" type="button" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div style={{ marginTop: 14 }}>
                    <div style={{ marginBottom: 8, opacity: 0.85 }}>Оценка</div>
                    <ScorePicker value={score} onChange={setScore} />
                </div>

                <div style={{ marginTop: 14 }}>
                    <div style={{ marginBottom: 8, opacity: 0.85 }}>Текст</div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        style={{ width: "100%" }}
                        placeholder="Напиши, что понравилось/не понравилось..."
                    />
                </div>

                {err && (
                    <div style={{ marginTop: 10, color: "#ff6b6b" }}>
                        {err}
                    </div>
                )}

                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                    <button className="btn" type="button" onClick={handleSubmit}>
                        Отправить
                    </button>
                    <button className="btn" type="button" onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}
