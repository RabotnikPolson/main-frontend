import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CommentsSection } from "@/features/comments";
import { getStream, useMovie } from "@/features/movies";
import { RightRailTabs } from "@/features/recommendations";
import {
  ReviewCard,
  ReviewFormModal,
  ReviewReadModal,
  useReviewMutations,
  useReviewsByMovie,
} from "@/features/reviews";
import { WatchTracker } from "@/features/watch-history";
import "@/shared/styles/pages/MovieWatch.css";

function MoviePlayer({ streamData, title, isLoading, isError, onRetry, movieId }) {
  const [showEmbed, setShowEmbed] = useState(false);

  const onOpenPlayer = () => {
    if (!streamData?.url) {
      return;
    }

    window.open(streamData.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="watch-player">
      <div className="watch-player-inner">
        <div className="watch-player-panel">
          <button className="watch-open-btn" onClick={onOpenPlayer} disabled={!streamData?.url || isLoading}>
            РћС‚РєСЂС‹С‚СЊ РІ РЅРѕРІРѕР№ РІРєР»Р°РґРєРµ
          </button>

          {isLoading && <p className="watch-player-status">Р—Р°РіСЂСѓР·РєР° РІРёРґРµРѕ...</p>}
          {isError && (
            <p className="watch-player-status watch-player-status-error">
              РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РІРёРґРµРѕ.{" "}
              <button className="btn-ghost" onClick={onRetry}>
                РџРѕРІС‚РѕСЂРёС‚СЊ
              </button>
            </p>
          )}

          {!!streamData?.url && (
            <div className="watch-embed-controls" style={{ marginTop: "10px" }}>
              <button className="btn" onClick={() => setShowEmbed((value) => !value)}>
                {showEmbed ? "РЎРєСЂС‹С‚СЊ РїР»РµРµСЂ" : "РЎРјРѕС‚СЂРµС‚СЊ РїСЂСЏРјРѕ Р·РґРµСЃСЊ"}
              </button>
            </div>
          )}

          {showEmbed && !!streamData?.url && (
            <div className="watch-embed-frame-wrap" style={{ marginTop: "15px" }}>
              <WatchTracker url={streamData.url} movieId={movieId} />
            </div>
          )}
        </div>
      </div>

      {title && <div className="watch-player-caption">{title}</div>}
    </div>
  );
}

export default function MovieWatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, error } = useMovie(id);
  const movieId = movie?.id ?? (id ? Number(id) : null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [readOpen, setReadOpen] = useState(false);
  const [readReview, setReadReview] = useState(null);

  useEffect(() => {
    setModalOpen(false);
    setEditing(null);
    setReadOpen(false);
    setReadReview(null);
  }, [id]);

  useEffect(() => {
    if (movie?.title) {
      document.title = `${movie.title} - Cinema App`;
    }
  }, [movie?.title]);

  const streamQuery = useQuery({
    queryKey: ["stream", movieId],
    queryFn: () => getStream(movieId),
    enabled: !!movieId,
  });

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
    } catch (reviewError) {
      console.error(reviewError);
      alert("РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РїСЂР°РІРёС‚СЊ РѕС‚Р·С‹РІ.");
    }
  };

  const onDelete = async (reviewId) => {
    if (!reviewId) {
      return;
    }

    if (!window.confirm("РЈРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ?")) {
      return;
    }

    try {
      await mutations.deleteReview.mutateAsync(reviewId);
    } catch (reviewError) {
      console.error(reviewError);
      alert("РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ.");
    }
  };

  if (isLoading) {
    return <div className="loading container">Р—Р°РіСЂСѓР·РєР° С„РёР»СЊРјР°...</div>;
  }

  if (isError) {
    return (
      <div className="container">
        <div className="error">РћС€РёР±РєР°: {error?.message || "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ С„РёР»СЊРј"}</div>
        <button className="button button--ghost" onClick={() => navigate(-1)}>
          РќР°Р·Р°Рґ
        </button>
      </div>
    );
  }

  if (!movieId) {
    return (
      <div className="container">
        <div className="error">Р¤РёР»СЊРј РЅРµ РЅР°Р№РґРµРЅ</div>
        <Link to="/" className="button button--ghost">
          РќР° РіР»Р°РІРЅСѓСЋ
        </Link>
      </div>
    );
  }

  const title = movie?.title ?? "Р¤РёР»СЊРј";

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
            movieId={movieId}
          />

          <h1 className="watch-title">{title}</h1>

          <button
            className="btn"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            РќР°РїРёСЃР°С‚СЊ РѕС‚Р·С‹РІ
          </button>

          <div className="section" style={{ marginTop: 18 }}>
            <h3 className="section-title">
              РћС‚Р·С‹РІС‹ {typeof totalReviews === "number" ? `(${totalReviews})` : ""}
            </h3>
            {reviewsQuery.isLoading && <div style={{ opacity: 0.75 }}>Р—Р°РіСЂСѓР·РєР°...</div>}
            {reviewsQuery.isError && <div style={{ opacity: 0.75 }}>РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РѕС‚Р·С‹РІРѕРІ.</div>}
            {!reviewsQuery.isLoading && reviews.length === 0 && (
              <div style={{ opacity: 0.75 }}>РџРѕРєР° РЅРµС‚ РѕС‚Р·С‹РІРѕРІ.</div>
            )}

            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReadFull={openRead}
                isOwner={false}
                onEdit={() => {
                  setEditing(review);
                  setModalOpen(true);
                }}
                onDelete={() => onDelete(review.id)}
              />
            ))}
          </div>

          <div className="section card" style={{ marginTop: 18 }}>
            <h3 className="section-title">РљРѕРјРјРµРЅС‚Р°СЂРёРё</h3>
            <CommentsSection movieId={movieId} />
          </div>
        </div>

        {!!movieId && (
          <div className="watch-sidebar" style={{ position: "sticky", top: 20, height: "calc(100vh - 40px)", overflow: "hidden" }}>
            <RightRailTabs movieId={movieId} />
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
