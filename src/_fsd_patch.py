from pathlib import Path
root = Path('src')
replacements = {
    'import MovieGrid from "../components/MovieGrid";': 'import MovieGrid from "../../../shared/ui/MovieGrid";',
    'import HeroCarousel from "../components/HeroCarousel";': 'import HeroCarousel from "../../../shared/ui/HeroCarousel";',
    'import ReviewCard from "../components/ReviewCard";': 'import ReviewCard from "../../../features/reviews/ui/ReviewCard";',
    'import ReviewFormModal from "../components/ReviewFormModal";': 'import ReviewFormModal from "../../../features/reviews/ui/ReviewFormModal";',
    'import ReviewReadModal from "../components/ReviewReadModal";': 'import ReviewReadModal from "../../../features/reviews/ui/ReviewReadModal";',
    'import CommentsSection from "../components/comments/CommentsSection";': 'import CommentsSection from "../../../features/comments/ui/CommentsSection";',
    'import RightRailTabs from "../components/RightRail/RightRailTabs";': 'import RightRailTabs from "../../../features/recommendations/ui/RightRailTabs";',
    'import WatchTracker from "../components/WatchTracker";': 'import WatchTracker from "../../../features/watch-history/ui/WatchTracker";',
    'import { useMovie } from "../hooks/useMovie";': 'import { useMovie } from "../../../features/movies/model/useMovie";',
    'import { useReviewsByMovie, useReviewMutations } from "../hooks/useReviews";': 'import { useReviewsByMovie, useReviewMutations } from "../../../features/reviews/model/useReviews";',
    'import { useMovies } from "../hooks/useMovies";': 'import { useMovies } from "../../../features/movies/model/useMovies";',
    'import { useAuth } from "../hooks/useAuth";': 'import { useAuth } from "../../../features/auth/model/useAuth";',
    'import { useUserProfile } from "../hooks/useUserProfile";': 'import { useUserProfile } from "../../../features/user-profile/model/useUserProfile";',
    'import { useRecommendationsTab } from "../hooks/useRecommendations";': 'import { useRecommendationsTab } from "../../../features/recommendations/model/useRecommendations";',
    'import { getStream } from "../shared/api/stream";': 'import { getStream } from "../../../features/movies/api/streamApi";',
    'import { getFavoritesByUser, addFavorite, removeFavorite, } from "../shared/api/favorites";': 'import { getFavoritesByUser, addFavorite, removeFavorite, } from "../../../features/favorites/api/favoritesApi";',
    'import { getFavoritesByUser, addFavorite, removeFavorite } from "../shared/api/favorites";': 'import { getFavoritesByUser, addFavorite, removeFavorite } from "../../../features/favorites/api/favoritesApi";',
    'import { addFromKinopoisk, deleteMovie } from "../shared/api/movies";': 'import { addFromKinopoisk, deleteMovie } from "../../../features/movies/api/moviesApi";',
    'import { addFromKinopoisk } from "../shared/api/movies";': 'import { addFromKinopoisk } from "../../../features/movies/api/moviesApi";',
    'import http from "../shared/api/http";': 'import http from "../../../shared/api/http-client";',
    'import http from "../../shared/api/http";': 'import http from "../../shared/api/http-client";',
    'import api from "../shared/api/http";': 'import api from "../../shared/api/http-client";',
    'import "../styles/pages/Auth.css";': 'import "../../../shared/styles/pages/Auth.css";',
    'import "../styles/pages/Favorites.css";': 'import "../../../shared/styles/pages/Favorites.css";',
    'import "../styles/pages/MovieWatch.css";': 'import "../../../shared/styles/pages/MovieWatch.css";',
    'import "../styles/pages/Profile.css";': 'import "../../../shared/styles/pages/Profile.css";',
    'import "../styles/pages/AddMovie.css";': 'import "../../../shared/styles/pages/AddMovie.css";',
    'import "../styles/pages/AdminAnalytics.css";': 'import "../../../shared/styles/pages/AdminAnalytics.css";',
    'import "../styles/pages/Genres.css";': 'import "../../../shared/styles/pages/Genres.css";',
    'import "../styles/pages/History.css";': 'import "../../../shared/styles/pages/History.css";',
    'import "../styles/pages/Settings.css";': 'import "../../../shared/styles/pages/Settings.css";',
    'import "../styles/pages/Subscription.css";': 'import "../../../shared/styles/pages/Subscription.css";',
    'import "../styles/pages/Home.css";': 'import "../../../shared/styles/pages/Home.css";',
    'import "../styles/pages/MovieDetails.css";': 'import "../../../shared/styles/pages/MovieDetails.css";',
}
files = list(root.glob('pages/*/ui/*.jsx')) + list(root.glob('features/comments/ui/*.jsx')) + list(root.glob('features/reviews/ui/*.jsx')) + list(root.glob('features/comments/model/*.js')) + list(root.glob('features/reviews/model/*.js')) + list(root.glob('features/favorites/model/*.js')) + list(root.glob('features/movies/model/*.js')) + list(root.glob('features/subscription/model/*.js')) + list(root.glob('features/watch-history/ui/*.jsx'))
for path in files:
    text = path.read_text(encoding='utf-8')
    new_text = text
    for old, new in replacements.items():
        new_text = new_text.replace(old, new)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print(f'Patched {path}')
