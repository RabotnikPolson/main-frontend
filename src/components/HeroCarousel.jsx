import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "../styles/components/HeroCarousel.css";

const HeroCarousel = () => {
    const navigate = useNavigate();
    const { data: movies = [], isLoading } = useMovies();

    const sections = useMemo(() => {
        if (!movies.length) return [];
        
        const base = [...movies];
        return [
            {
                title: "Популярное и рекомендуемое",
                subtitle: "Сортировка по рейтингу",
                items: [...base].sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
            },
            {
                title: "Новинки",
                subtitle: "Сортировка по году",
                items: [...base].sort((a, b) => (b.year || 0) - (a.year || 0))
            },
            {
                title: "Длинные фильмы",
                subtitle: "Сортировка по длительности",
                items: [...base].sort((a, b) => (b.duration || 0) - (a.duration || 0))
            }
        ];
    }, [movies]);

    if (isLoading) return <div>Загрузка…</div>;
    if (!movies.length) return null;

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
                            320: { slidesPerView: 1, spaceBetween: 8 },
                            480: { slidesPerView: 2, spaceBetween: 10 },
                            768: { slidesPerView: 3, spaceBetween: 12 },
                            1024: { slidesPerView: 4, spaceBetween: 14 },
                            1280: { slidesPerView: 5, spaceBetween: 16 },
                        }}
                    >
                        {section.items.map((m) => (
                            <SwiperSlide
                                key={m.id || m.imdbId}
                                onClick={() => navigate(`/movie/${m.id || m.imdbId}`)}
                            >
                                <div className="carousel-card">
                                    <img src={m.poster} alt={m.title} className="carousel-poster" />
                                    <div className="carousel-overlay">
                                        <h3>{m.title}</h3>
                                        <span>{m.year} ⭐ {m.imdbRating}</span>
                                        {m.duration && <span>⏱ {m.duration} мин</span>}
                                        <button
                                            className="watch-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/movie/${m.id || m.imdbId}/watch`);
                                            }}
                                        >
                                            Смотреть сейчас
                                        </button>
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