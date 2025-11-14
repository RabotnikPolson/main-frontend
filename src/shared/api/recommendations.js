import http from "../api/http";


// Временная заглушка: 15 фильмов "по ряду"
export const listRightRail = (imdbId, limit = 15) =>
http.get(`/api/movies`, { params: { page: 1, size: limit } }).then(r => r.data);