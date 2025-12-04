import http from "./http";

export const getAllMovies = async () => {
  const res = await http.get("/movies");
  return res.data;
};

export const getMovieByImdb = async imdbId => {
  const res = await http.get(`/movies/imdb/${imdbId}`);
  return res.data;
};

export const addFromImdb = async imdbId => {
  const res = await http.post("/movies/addFromImdb", null, {
    params: { imdbId },
  });
  return res.data;
};

export const getAllGenres = async () => {
  const res = await http.get("/genres");
  return res.data;
};
