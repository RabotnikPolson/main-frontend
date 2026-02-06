// src/components/HeroCarousel.jsx
import React from "react";
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

    if (isLoading) return <div>Загрузка…</div>;
    if (!movies.length) return null;

    // три сортировки
    const byRating = [...movies].sort((a, b) => b.imdbRating - a.imdbRating);
    const byYear = [...movies].sort((a, b) => b.year - a.year);
    const byLength = [...movies].sort((a, b) => b.duration - a.duration); // предполагаем поле duration в минутах

    const renderCarousel = (items, title, subtitle) => (
        <div className="hero-carousel">
            <div className="carousel-header">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            <Swiper
                modules={[Navigation]}
                slidesPerView={5}
                spaceBetween={16}
                navigation
                loop={false}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 8 },
                    480: { slidesPerView: 2, spaceBetween: 10 },
                    768: { slidesPerView: 3, spaceBetween: 12 },
                    1024: { slidesPerView: 4, spaceBetween: 14 },
                    1280: { slidesPerView: 5, spaceBetween: 16 },
                }}
            >
                {items.map((m) => (
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
    );

    return (
        <div>
            {renderCarousel(byRating, "Популярное и рекомендуемое", "Сортировка по рейтингу")}
            {renderCarousel(byYear, "Новинки", "Сортировка по году")}
            {renderCarousel(byLength, "Длинные фильмы", "Сортировка по длительности")}
        </div>
    );
};

export default HeroCarousel;
