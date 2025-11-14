// src/App.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import { ThemeProvider } from "./hooks/useTheme";
import "./styles/theme.css";

// Ленивые импорты страниц
const Home = lazy(() => import("./pages/Home"));
const Genres = lazy(() => import("./pages/Genres"));
const AddMovie = lazy(() => import("./pages/AddMovie"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const MovieWatch = lazy(() => import("./pages/MovieWatch"));
const MovieReviews = lazy(() => import("./pages/MovieReviews"));
const Favorites = lazy(() => import("./pages/Favorites"));
const History = lazy(() => import("./pages/History"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const Settings = lazy(() => import("./pages/SettingsPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

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
            <Route path="add-movie" element={<AddMovie />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="history" element={<History />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="subscription" element={<SubscriptionPage />} />

            {/* Страницы фильмов */}
            <Route path="movie/:imdbId" element={<MovieDetails />} />
            <Route path="movie/:imdbId/watch" element={<MovieWatch />} />
            <Route path="movie/:imdbId/reviews" element={<MovieReviews />} />

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
