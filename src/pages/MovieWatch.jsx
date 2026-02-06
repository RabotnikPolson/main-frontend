import { useRef, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";

import ReviewCard from "../components/ReviewCard";
import ReviewFormModal from "../components/ReviewFormModal";
import ReviewReadModal from "../components/ReviewReadModal";
import CommentsSection from "../components/Comments/CommentsSection";
import RecommendationsRail from "../components/RightRail/RecommendationsRail";

import { useReviewsByMovie, useReviewMutations } from "../hooks/useReviews";

import "../styles/pages/MovieWatch.css";

function MoviePlayer({ streamUrl, title }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    if (video.canPlayType("application/vnd.apple.mpegURL") !== "") {
      video.src = streamUrl;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", event, data);
      });

      return () => hls.destroy();
    }
  }, [streamUrl]);

  return (
      <div className="watch-player">
        <div className="watch-player-inner">
          <video ref={videoRef} className="watch-video" controls />
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

  // ВАЖНО: позже подключишь useMovie(movieId).
  const movie = useMemo(
      () => ({
        id: movieId,
        title: "Бойцовский клуб",
        streamUrl: "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8",
        imdbId: "tt0137523",
      }),
      [movieId]
  );

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
            <MoviePlayer streamUrl={movie.streamUrl} title={movie.title} />

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
              {reviewsQuery.isError && (
                  <div style={{ opacity: 0.75 }}>
                    Ошибка загрузки отзывов. Открой консоль.
                  </div>
              )}

              {!reviewsQuery.isLoading && reviews.length === 0 && (
                  <div style={{ opacity: 0.75 }}>Пока нет отзывов.</div>
              )}

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
