// src/components/HeroCarousel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../styles/components/HeroCarousel.css";

const HeroCarousel = () => {
    const navigate = useNavigate();
    const { data: movies = [], isLoading } = useMovies();

    if (isLoading) return <div>Загрузка…</div>;
    if (!movies.length) return null;

    return (
        <div className="hero-carousel">
            <div className="carousel-header">
                <h2>Популярное и рекомендуемое</h2>
                <p>Самые популярные фильмы и аниме этой недели</p>
            </div>

            <Swiper
                modules={[Pagination, Navigation]} // <--- вот здесь подключаем модули
                slidesPerView={5}
                spaceBetween={10}
                navigation
                pagination={{ clickable: true }}
                loop={false}
            >
                {movies.map((m) => (
                    <SwiperSlide
                        key={m.id || m.imdbId}
                        onClick={() => navigate(`/movie/${m.id || m.imdbId}`)}
                    >
                        <img src={m.poster} alt={m.title} />
                        <div className="swiper-content">
                            <h3 className="swiper-title">{m.title}</h3>
                            <span className="swiper-caption">{m.year} ⭐ {m.imdbRating}</span>
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
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroCarousel;
