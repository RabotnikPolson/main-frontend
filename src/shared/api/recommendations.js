import http from "./http";

export const listRightRail = (imdbId, limit = 15) =>
  http.get("/movies", { params: { page: 1, size: limit } }).then(r => r.data);
