import http from "./http";

export const previewReviews = ({ imdbId, limit = 5 }) =>
  http
    .get(`/movies/${imdbId}/reviews`, { params: { page: 0, size: limit } })
    .then(r => r.data);

export const listReviews = ({ imdbId, page = 0, size = 20, sort = "helpful" }) =>
  http
    .get(`/movies/${imdbId}/reviews`, { params: { page, size, sort } })
    .then(r => r.data);

export const createReview = ({ imdbId, rating, text }) =>
  http
    .post(`/movies/${imdbId}/reviews`, { rating, text })
    .then(r => r.data);

export const updateReview = (id, payload) =>
  http.put(`/reviews/${id}`, payload).then(r => r.data);

export const reactReview = (id, reaction) =>
  http.post(`/reviews/${id}/reactions/${reaction}`).then(r => r.data);
