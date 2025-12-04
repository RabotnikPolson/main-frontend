import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";
import http from "../shared/api/http";

import ReviewCard from "../components/ReviewCard";
import ReviewFormModal from "../components/ReviewFormModal";
import CommentsSection from "../components/Comments/CommentsSection";
import RecommendationsRail from "../components/RightRail/RecommendationsRail";

import "../styles/pages/MovieWatch.css";

import {
  useReviews,
  useCreateOrUpdateReview,
  useReactReview,
} from "../hooks/useReviews";

function MoviePlayer({ streamUrl, title }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    if (video.canPlayType("application/vnd.apple.mpegURL")) {
      video.src = streamUrl;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
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
  const { imdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    http
      .get(`/movies/imdb/${imdbId}/watch`)
      .then(r => setMovie(r.data))
      .catch(() => setMovie(null));
  }, [imdbId]);

  const fullStreamUrl =
    movie?.streamUrl && !movie.streamUrl.startsWith("http")
      ? `http://localhost:8080${movie.streamUrl}`
      : movie?.streamUrl;

  const { data: reviews } = useReviews(imdbId, 0, 10);
  const { create, update } = useCreateOrUpdateReview(imdbId);
  const reactReview = useReactReview(imdbId);

  const userReview = reviews?.items?.find(r => r.isOwner);

  const submitReview = async payload => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, payload });
    } else {
      await create.mutateAsync({ imdbId, ...payload });
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="watch">
      <div className="watch-grid">
        <div className="watch-main">
          <MoviePlayer streamUrl={fullStreamUrl} title={movie?.title} />

          <h1 className="watch-title">{movie?.title}</h1>

          {userReview ? (
            <div className="card">
              <h3 className="section-title">Ваш отзыв</h3>
              <ReviewCard review={userReview} isOwner />
              <button
                className="btn"
                onClick={() => {
                  setEditing(userReview);
                  setModalOpen(true);
                }}
              >
                Изменить
              </button>
            </div>
          ) : (
            <button
              className="btn"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              Написать отзыв
            </button>
          )}

          <div className="section">
            <h3 className="section-title">Отзывы</h3>
            {(reviews?.items || []).map(r => (
              <ReviewCard
                key={r.id}
                review={r}
                isOwner={r.isOwner}
                onReact={(id, reaction) =>
                  reactReview.mutate({ id, reaction })
                }
              />
            ))}
          </div>

          <div className="section card">
            <h3 className="section-title">Комментарии</h3>
            <CommentsSection imdbId={imdbId} />
          </div>
        </div>

        <div className="watch-sidebar">
          <RecommendationsRail imdbId={imdbId} />
        </div>
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
    </div>
  );
}
