import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMovies } from "@/features/movies";
import { useSmartFeed } from "@/features/recommendations";
import "@/shared/styles/components/HeroCarousel.css";
import "swiper/css";
import "swiper/element/css/navigation";

export default function HomeHeroCarousel() {
  const navigate = useNavigate();
  const { data: allMovies = [], isLoading: isMoviesLoading } = useMovies();
  const { data, isLoading: isFeedLoading } = useSmartFeed();
  const feed = data?.feed;
  const isLoading = isMoviesLoading || isFeedLoading;

  const sections = useMemo(() => {
    if (!feed || !allMovies.length) {
      return [];
    }

    const enrichMovies = (items) =>
      (items || [])
        .map((item) => {
          const fullMovie = allMovies.find(
            (movie) => movie.id == item.movie_id || movie.imdbId == item.movie_id
          );
          return fullMovie ? { ...item, ...fullMovie } : null;
        })
        .filter(Boolean);

    const nextSections = [];

    if (feed.continue_watching?.length > 0) {
      nextSections.push({
        title: "РџСЂРѕРґРѕР»Р¶РёС‚СЊ РїСЂРѕСЃРјРѕС‚СЂ",
        subtitle: "Р’С‹ РѕСЃС‚Р°РЅРѕРІРёР»РёСЃСЊ Р·РґРµСЃСЊ",
        items: enrichMovies(feed.continue_watching),
      });
    }

    if (feed.top_picks_for_you?.length > 0) {
      nextSections.push({
        title: "РЎРїРµС†РёР°Р»СЊРЅРѕ РґР»СЏ РІР°СЃ",
        subtitle: "AI РїРѕРґР±РѕСЂРєР°",
        items: enrichMovies(feed.top_picks_for_you),
      });
    }

    if (feed.because_you_watched?.recommendations?.length > 0) {
      nextSections.push({
        title: feed.because_you_watched.reason,
        subtitle: "РџРѕС…РѕР¶РёР№ РєРѕРЅС‚РµРЅС‚",
        items: enrichMovies(feed.because_you_watched.recommendations),
      });
    }

    if (feed.trending?.length > 0) {
      nextSections.push({
        title: "Р’ С‚СЂРµРЅРґРµ",
        subtitle: "РџРѕРїСѓР»СЏСЂРЅС‹Рµ С„РёР»СЊРјС‹",
        items: enrichMovies(feed.trending),
      });
    }

    return nextSections;
  }, [feed, allMovies]);

  if (isLoading) {
    return <div style={{ color: "#fff", padding: "20px" }}>Р—Р°РіСЂСѓР·РєР°...</div>;
  }

  if (!sections.length) {
    return (
      <div style={{ color: "gray", padding: "20px" }}>
        Р”РѕР±Р°РІСЊС‚Рµ Р±РѕР»СЊС€Рµ С„РёР»СЊРјРѕРІ РІ Р±Р°Р·Сѓ, С‡С‚РѕР±С‹ РЅРµР№СЂРѕСЃРµС‚СЊ РѕР¶РёР»Р°.
      </div>
    );
  }

  return (
    <div>
      {sections.map((section, index) => (
        <div className="hero-carousel" key={`${section.title}-${index}`}>
          <div className="carousel-header">
            <h2>{section.title}</h2>
            <p>{section.subtitle}</p>
          </div>

          <Swiper
            modules={[Navigation]}
            slidesPerView={5}
            spaceBetween={16}
            navigation
            breakpoints={{
              320: { slidesPerView: 1 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {section.items.map((movie) => (
              <SwiperSlide
                key={`${section.title}-${movie.id}`}
                onClick={() => navigate(`/movie/${movie.id || movie.imdbId}`)}
              >
                <div className="carousel-card">
                  <img
                    src={movie.posterUrl || movie.poster}
                    alt={movie.title}
                    className="carousel-poster"
                  />
                  <div className="carousel-overlay">
                    <h3>{movie.title}</h3>
                    <span>
                      {movie.year} ? {movie.imdbRating || "0"}
                    </span>
                    <button className="watch-btn">РЎРјРѕС‚СЂРµС‚СЊ</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
}
