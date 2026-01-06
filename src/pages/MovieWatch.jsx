// src/pages/MovieWatch.jsx
import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";

import ReviewCard from "../components/ReviewCard";
import ReviewFormModal from "../components/ReviewFormModal";
import CommentsSection from "../components/Comments/CommentsSection";
import RecommendationsRail from "../components/RightRail/RecommendationsRail";

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

      return () => {
        hls.destroy();
      };
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const movie = {
    id: 1,
    title: "Бойцовский клуб",
    streamUrl: "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8",
    imdbId: "tt0137523",
  };

  const userReview = null; // временно пусто
  const reviews = { items: [] }; // временно пусто

  const submitReview = async (payload) => {
    console.log("Review submitted:", payload);
    setModalOpen(false);
    setEditing(null);
  };

  return (
      <div className="watch">
        <div className="watch-grid">
          <div className="watch-main">
            <MoviePlayer streamUrl={movie.streamUrl} title={movie.title} />

            <h1 className="watch-title">{movie.title}</h1>

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
              {(reviews.items || []).map((r) => (
                  <ReviewCard key={r.id} review={r} isOwner={r.isOwner} />
              ))}
            </div>

            <div className="section card">
              <h3 className="section-title">Комментарии</h3>
              <CommentsSection imdbId={movie.imdbId} />
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
      </div>
  );
}
