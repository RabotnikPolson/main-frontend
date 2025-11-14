import { useEffect, useState } from "react";
import RatingStars from "./RatingStars";

export default function ReviewFormModal({ open, initial, onClose, onSubmit }) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setStars((initial?.rating || 0) / 2);
      setText(initial?.text || "");
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = () => {
    const rating10 = Math.round(stars * 2); // 5 с половинками → 10-балльная
    onSubmit({ rating: rating10, text });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 520,
          background: "#0f1115",
          border: "1px solid #2a2f3a",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 8 }}>
          {initial ? "Редактировать отзыв" : "Оценить и написать отзыв"}
        </h3>
        <RatingStars value={stars} onChange={setStars} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ width: "100%", marginTop: 12, resize: "vertical" }}
          placeholder="Ваши мысли о фильме"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 12,
          }}
        >
          <button onClick={onClose}>Отмена</button>
          <button onClick={submit} disabled={stars <= 0}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
