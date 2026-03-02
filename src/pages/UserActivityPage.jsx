// src/pages/UserActivityPage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import http from "../shared/api/http";

import ReviewCard from "../components/ReviewCard";
import CommentItem from "../components/comments/CommentItem";

import "../styles/pages/Profile.css";

export default function UserActivityPage() {
  const { username } = useParams();

  // Мутации / удаление можно подключить позже через Review/Comment API
  const [editingReview, setEditingReview] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userActivity", username],
    queryFn: async () => {
      const [reviewsRes, commentsRes] = await Promise.all([
        http.get(`/reviews/user/${username}`),
        http.get(`/comments/user/${username}`),
      ]);

      const reviews = (reviewsRes.data || []).map((r) => ({ ...r, type: "review" }));
      const comments = (commentsRes.data || []).map((c) => ({ ...c, type: "comment" }));

      const combined = [...reviews, ...comments];
      combined.sort((a, b) => new Date(b.ts || b.createdAt) - new Date(a.ts || a.createdAt));
      return combined;
    },
    retry: 1,
  });

  const openReview = (review) => setEditingReview(review);

  if (isLoading) return <p className="profile-muted">Загрузка…</p>;
  if (isError) return <p className="profile-muted">Не удалось загрузить активность.</p>;
  if (!data || data.length === 0) return <p className="profile-muted">Нет активности.</p>;

  return (
    <div className="container profile-page">
      <div className="profile-shell">
        <h1 className="profile-title">Активность пользователя {username}</h1>

        <div className="profile-card">
          {data.map((item, idx) => {
            if (item.type === "review") {
              return (
                <ReviewCard
                  key={`review-${item.id || idx}`}
                  review={item}
                  onReadFull={openReview}
                  isOwner={true} // или false, если чужой пользователь
                  onEdit={() => setEditingReview(item)}
                  onDelete={() => alert("Удалить отзыв " + item.id)}
                />
              );
            }

            if (item.type === "comment") {
              return (
                <CommentItem
                  key={`comment-${item.id || idx}`}
                  node={item}
                  isReply={false}
                  onReply={(text) => alert(`Ответ на комментарий ${item.id}: ${text}`)}
                  onDelete={() => alert("Удалить комментарий " + item.id)}
                  onReact={(emoji) => alert(`Реакция ${emoji} на комментарий ${item.id}`)}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}