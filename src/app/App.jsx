// src/App.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "../shared/ui/AppLayout";
import { ThemeProvider } from "../shared/hooks/useTheme";
import AdminRoute from "../features/auth/ui/AdminRoute";
import "../shared/styles/theme.css";

// Ленивые импорты страниц
const Home = lazy(() => import("../pages/home/ui/HomePage"));
const Genres = lazy(() => import("../pages/genres/ui/GenresPage"));
const AddMovie = lazy(() => import("../pages/add-movie/ui/AddMoviePage"));
const MovieDetails = lazy(() => import("../pages/movie-details/ui/MovieDetailsPage"));
const MovieWatch = lazy(() => import("../pages/movie-watch/ui/MovieWatchPage"));
const MovieReviews = lazy(() => import("../pages/movie-reviews/ui/MovieReviewsPage"));
const Favorites = lazy(() => import("../pages/favorites/ui/FavoritesPage"));
const History = lazy(() => import("../pages/history/ui/HistoryPage"));
const AdminAnalytics = lazy(() => import("../pages/admin-analytics/ui/AdminAnalyticsPage"));
const ProfilePage = lazy(() => import("../pages/profile/ui/ProfilePage"));
const Settings = lazy(() => import("../pages/settings/ui/SettingsPage"));
const SubscriptionPage = lazy(() => import("../pages/subscription/ui/SubscriptionPage"));
const Login = lazy(() => import("../pages/login/ui/LoginPage"));
const Register = lazy(() => import("../pages/register/ui/RegisterPage"));
const UserActivityPage = lazy(() => import("../pages/user-activity/ui/UserActivityPage")); // <- новая страница
const AdminMovies = lazy(() => import("../pages/admin-movies/ui/AdminMoviesPage"));

function ScrollToTop() {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Suspense fallback={<div style={{ padding: 20 }}>Загрузка…</div>}>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Основные страницы */}
            <Route index element={<Home />} />
            <Route path="genres" element={<Genres />} />
            <Route path="add-movie" element={<AdminRoute><AddMovie /></AdminRoute>} />
            <Route path="admin/movies" element={<AdminRoute><AdminMovies /></AdminRoute>} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="history" element={<History />} />
            <Route path="analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="subscription" element={<SubscriptionPage />} />

            {/* Страницы фильмов */}
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="movie/:id/watch" element={<MovieWatch />} />
            <Route path="movie/:id/reviews" element={<MovieReviews />} />

            {/* Страница активности */}
            <Route path="activity/:username" element={<UserActivityPage />} />

            {/* Авторизация */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}