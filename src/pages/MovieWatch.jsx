import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ReviewCard from "../components/ReviewCard";
import ReviewFormModal from "../components/ReviewFormModal";
import ReviewReadModal from "../components/ReviewReadModal";
import CommentsSection from "../components/comments/CommentsSection";
import RecommendationsRail from "../components/RightRail/RecommendationsRail";

import { useReviewsByMovie, useReviewMutations } from "../hooks/useReviews";
import { getStream } from "../shared/api/stream";

import "../styles/pages/MovieWatch.css";

function MoviePlayer({ streamData, title, isLoading, isError, onRetry }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const onOpenPlayer = () => {
    if (!streamData?.url) return;
    window.open(streamData.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="watch-player">
      <div className="watch-player-inner">
        <div className="watch-player-panel">
          <button className="watch-open-btn" onClick={onOpenPlayer} disabled={!streamData?.url || isLoading}>
            Открыть плеер
          </button>

          <p className="watch-player-note">Если откроется реклама — закрой вкладку и нажми Play ещё раз.</p>
          <p className="watch-player-note">Если плеер не запустился — нажми ‘Открыть плеер’ ещё раз.</p>

          {isLoading && <p className="watch-player-status">Загрузка ссылки на плеер…</p>}
          {isError && (
            <p className="watch-player-status watch-player-status-error">
              Не удалось загрузить ссылку на плеер. <button className="btn-ghost" onClick={onRetry}>Повторить</button>
            </p>
          )}

          {!!streamData?.url && (
            <div className="watch-embed-controls">
              <button className="btn" onClick={() => setShowEmbed((v) => !v)}>
                {showEmbed ? "Скрыть встраиваемый плеер" : "Показать встраиваемый плеер (может не работать)"}
              </button>
              {showEmbed && (
                <button className="btn-ghost" onClick={() => setIframeKey((v) => v + 1)}>
                  Перезагрузить
                </button>
              )}
            </div>
          )}

          {showEmbed && !!streamData?.url && (
            <div className="watch-embed-frame-wrap">
              <iframe
                key={iframeKey}
                title={title || "movie-player"}
                className="watch-embed-frame"
                src={streamData.url}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
      {title && <div className="watch-player-caption">{title}</div>}
    </div>
  );
}

export default function MovieWatch() {
  const { id } = useParams();
  const movieId = Number(id || 1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [readOpen, setReadOpen] = useState(false);
  const [readReview, setReadReview] = useState(null);

  const movie = useMemo(
    () => ({
      id: movieId,
      title: "Бойцовский клуб",
      imdbId: "tt0137523",
    }),
    [movieId]
  );

  const streamQuery = useQuery({
    queryKey: ["stream", movieId],
    queryFn: () => getStream(movieId),
    enabled: !!movieId,
  });

  // грузим 5 последних для MovieWatch (как OKKO: превью)
  const reviewsQuery = useReviewsByMovie(movie.id, 0, 5);
  const reviews = reviewsQuery.data?.items || [];
  const totalReviews = reviewsQuery.data?.total ?? 0;

  const mutations = useReviewMutations(movie.id);

  const openRead = (review) => {
    setReadReview(review);
    setReadOpen(true);
  };

  const submitReview = async (payload) => {
    try {
      // payload приходит из ReviewFormModal: { content, score }
      const { content, score } = payload;

      if (editing?.id) {
        await mutations.updateReview.mutateAsync({ id: editing.id, content, score });
      } else {
        await mutations.createReview.mutateAsync({ content, score });
      }

      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      console.error("Review submit failed:", e);
      alert("Не удалось отправить отзыв. Проверь консоль и ответ сервера.");
    }
  };

  const onDelete = async (reviewId) => {
    if (!reviewId) return;
    if (!confirm("Удалить отзыв?")) return;

    try {
      await mutations.remove.mutateAsync(reviewId);
    } catch (e) {
      console.error("Review delete failed:", e);
      alert("Не удалось удалить отзыв.");
    }
  };

  return (
    <div className="watch">
      <div className="watch-grid">
        <div className="watch-main">
          <MoviePlayer
            streamData={streamQuery.data}
            title={movie.title}
            isLoading={streamQuery.isLoading}
            isError={streamQuery.isError}
            onRetry={() => streamQuery.refetch()}
          />

          <h1 className="watch-title">{movie.title}</h1>

          <button
            className="btn"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Написать отзыв
          </button>

          <div className="section" style={{ marginTop: 18 }}>
            <h3 className="section-title">
              Отзывы {typeof totalReviews === "number" ? `(${totalReviews})` : ""}
            </h3>

            {reviewsQuery.isLoading && <div style={{ opacity: 0.75 }}>Загрузка…</div>}
            {reviewsQuery.isError && <div style={{ opacity: 0.75 }}>Ошибка загрузки отзывов. Открой консоль.</div>}

            {!reviewsQuery.isLoading && reviews.length === 0 && <div style={{ opacity: 0.75 }}>Пока нет отзывов.</div>}

            {reviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                onReadFull={openRead}
                // isOwner пока не можем определить без поля from backend
                isOwner={false}
                onEdit={() => {
                  setEditing(r);
                  setModalOpen(true);
                }}
                onDelete={() => onDelete(r.id)}
              />
            ))}

            {/* Позже сделаем отдельную страницу /movie/:id/reviews (как OKKO "все отзывы") */}
          </div>

          <div className="section card" style={{ marginTop: 18 }}>
            <h3 className="section-title">Комментарии</h3>
            <CommentsSection movieId={movie.id} />
          </div>
        </div>

        {movie.imdbId && (
          <div className="watch-sidebar">
            <RecommendationsRail imdbId={movie.imdbId} />
          </div>
        )}
      </div>

      <ReviewFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={submitReview}
      />

      <ReviewReadModal
        open={readOpen}
        review={readReview}
        onClose={() => {
          setReadOpen(false);
          setReadReview(null);
        }}
      />
    </div>
  );
}
