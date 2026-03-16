import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { useSmartFeed } from "../hooks/useRecommendations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "../styles/components/HeroCarousel.css";

const HeroCarousel = () => {
    const navigate = useNavigate();
    const { data: allMovies = [], isLoading: isMoviesLoading } = useMovies();
    const { data, isLoading: isFeedLoading } = useSmartFeed();
    const feed = data?.feed;

    const isLoading = isMoviesLoading || isFeedLoading;

    const sections = useMemo(() => {
        if (!feed || !allMovies.length) return [];
        
        const enrichMovies = (mlItems) => {
            if (!mlItems) return [];
            return mlItems
                .map(item => {
                    // Используем == вместо === чтобы игнорировать разницу между "1" и 1
                    const fullMovie = allMovies.find(m => m.id == item.movie_id || m.imdbId == item.movie_id);
                    return fullMovie ? { ...item, ...fullMovie } : null;
                })
                .filter(Boolean);
        };

        const newSections = [];

        if (feed.continue_watching?.length > 0) {
            newSections.push({
                title: "Продолжить просмотр",
                subtitle: "Вы остановились здесь",
                items: enrichMovies(feed.continue_watching)
            });
        }

        if (feed.top_picks_for_you?.length > 0) {
            newSections.push({
                title: "Специально для вас",
                subtitle: "AI подборка",
                items: enrichMovies(feed.top_picks_for_you)
            });
        }

        if (feed.because_you_watched?.recommendations?.length > 0) {
            newSections.push({
                title: feed.because_you_watched.reason,
                subtitle: "Похожий контент",
                items: enrichMovies(feed.because_you_watched.recommendations)
            });
        }

        if (feed.trending?.length > 0) {
            newSections.push({
                title: "В тренде",
                subtitle: "Популярные фильмы",
                items: enrichMovies(feed.trending)
            });
        }

        return newSections;
    }, [feed, allMovies]);

    if (isLoading) return <div style={{color: '#fff', padding: '20px'}}>Загрузка...</div>;
    
    // Если секций нет, выведем дебаг-сообщение (потом удалишь)
    if (!sections.length) return <div style={{color: 'gray', padding: '20px'}}>Добавьте больше фильмов в базу (минимум 5-10), чтобы нейросеть ожила.</div>;

    return (
        <div>
            {sections.map((section, idx) => (
                <div className="hero-carousel" key={idx}>
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
                        {section.items.map((m) => (
                            <SwiperSlide
                                key={`${section.title}-${m.id}`}
                                onClick={() => navigate(`/movie/${m.id || m.imdbId}`)}
                            >
                                <div className="carousel-card">
                                    <img src={m.posterUrl || m.poster} alt={m.title} className="carousel-poster" />
                                    <div className="carousel-overlay">
                                        <h3>{m.title}</h3>
                                        <span>{m.year} ⭐ {m.imdbRating || '0'}</span>
                                        <button className="watch-btn">Смотреть</button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ))}
        </div>
    );
};

export default HeroCarousel;
