// src/pages/MovieWatch.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ReviewCard from "../components/ReviewCard";
import ReviewFormModal from "../components/ReviewFormModal";
import ReviewReadModal from "../components/ReviewReadModal";
import CommentsSection from "../components/comments/CommentsSection";
import RecommendationsRail from "../components/RightRail/RecommendationsRail";

import { useMovie } from "../hooks/useMovie";
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
          <button
            className="watch-open-btn"
            onClick={onOpenPlayer}
            disabled={!streamData?.url || isLoading}
          >
            Открыть плеер
          </button>

          <p className="watch-player-note">
            Если откроется реклама — закрой вкладку и нажми Play ещё раз.
          </p>
          <p className="watch-player-note">
            Если плеер не запустился — нажми ‘Открыть плеер’ ещё раз.
          </p>

          {isLoading && <p className="watch-player-status">Загрузка ссылки на плеер…</p>}
          {isError && (
            <p className="watch-player-status watch-player-status-error">
              Не удалось загрузить ссылку на плеер.{" "}
              <button className="btn-ghost" onClick={onRetry}>Повторить</button>
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
  const navigate = useNavigate();

  // 1) реальный фильм из backend
  const { data: movie, isLoading, isError, error } = useMovie(id);

  // 2) нормальный movieId для запросов stream/reviews/comments
  const movieId = movie?.id ?? (id ? Number(id) : null);

  // модалки
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [readOpen, setReadOpen] = useState(false);
  const [readReview, setReadReview] = useState(null);

  // если сменили фильм — сбрасываем модалки/редактирование
  useEffect(() => {
    setModalOpen(false);
    setEditing(null);
    setReadOpen(false);
    setReadReview(null);
  }, [id]);

  // титул вкладки
  useEffect(() => {
    if (movie?.title) document.title = `${movie.title} — Cinema App`;
  }, [movie?.title]);

  // stream (только когда movieId валиден)
  const streamQuery = useQuery({
    queryKey: ["stream", movieId],
    queryFn: () => getStream(movieId),
    enabled: !!movieId,
  });

  // отзывы-превью (5 последних)
  const reviewsQuery = useReviewsByMovie(movieId, 0, 5);
  const reviews = reviewsQuery.data?.items || [];
  const totalReviews = reviewsQuery.data?.total ?? 0;

  const mutations = useReviewMutations(movieId);

  const openRead = (review) => {
    setReadReview(review);
    setReadOpen(true);
  };

  const submitReview = async ({ content, score }) => {
    try {
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
      await mutations.deleteReview.mutateAsync(reviewId);
    } catch (e) {
      console.error("Review delete failed:", e);
      alert("Не удалось удалить отзыв.");
    }
  };

  if (isLoading) {
    return <div className="loading container">Загрузка фильма…</div>;
  }

  if (isError) {
    return (
      <div className="container">
        <div className="error">Ошибка: {error?.message || "Не удалось загрузить фильм"}</div>
        <button className="button button--ghost" onClick={() => navigate(-1)}>
          ← Назад
        </button>
      </div>
    );
  }

  if (!movieId) {
    return (
      <div className="container">
        <div className="error">Фильм не найден</div>
        <Link to="/" className="button button--ghost">← На главную</Link>
      </div>
    );
  }

  const title = movie?.title ?? "Фильм";
  const imdbId = movie?.imdbId ?? movie?.imdb_id ?? movie?.raw?.imdbID ?? null;

  return (
    <div className="watch">
      <div className="watch-grid">
        <div className="watch-main">
          <MoviePlayer
            streamData={streamQuery.data}
            title={title}
            isLoading={streamQuery.isLoading}
            isError={streamQuery.isError}
            onRetry={() => streamQuery.refetch()}
          />

          <h1 className="watch-title">{title}</h1>

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
                isOwner={false}
                onEdit={() => {
                  setEditing(r);
                  setModalOpen(true);
                }}
                onDelete={() => onDelete(r.id)}
              />
            ))}
          </div>

          <div className="section card" style={{ marginTop: 18 }}>
            <h3 className="section-title">Комментарии</h3>
            <CommentsSection movieId={movieId} />
          </div>
        </div>

        {!!imdbId && (
          <div className="watch-sidebar">
            <RecommendationsRail imdbId={imdbId} />
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
