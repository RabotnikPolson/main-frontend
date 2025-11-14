import http from "../api/http";

// Список последних отзывов для превью
export const previewReviews = ({ imdbId, limit = 5 }) =>
  http
    .get(`/api/movies/${imdbId}/reviews`, { params: { page: 0, size: limit } })
    .then((r) => r.data);

// Полный список отзывов (страницы)
export const listReviews = ({ imdbId, page = 0, size = 20, sort = "helpful" }) =>
  http
    .get(`/api/movies/${imdbId}/reviews`, { params: { page, size, sort } })
    .then((r) => r.data);

// Создать отзыв к фильму
export const createReview = ({ imdbId, rating, text }) =>
  http
    .post(`/api/movies/${imdbId}/reviews`, { rating, text })
    .then((r) => r.data);

// Обновить отзыв (если у тебя реализовано)
export const updateReview = (id, payload) =>
  http.put(`/api/reviews/${id}`, payload).then((r) => r.data);

// Реакции на отзыв (если сделаешь отдельный контроллер)
export const reactReview = (id, reaction) =>
  http.post(`/api/reviews/${id}/reactions/${reaction}`).then((r) => r.data);
