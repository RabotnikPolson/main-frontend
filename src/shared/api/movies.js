import http from './http';

// возвращает Movie[] (с сервера)
export const getAllMovies = async () => {
  const res = await http.get('/api/movies');
  return res.data;
};

// возвращает один фильм по imdbId: GET /api/movies/imdb/{imdbId}
export const getMovieByImdb = async (imdbId) => {
  const res = await http.get(`/api/movies/imdb/${imdbId}`);
  return res.data;
};

// POST /api/movies/addFromImdb?imdbId=tt...
export const addFromImdb = async (imdbId) => {
  const res = await http.post('/api/movies/addFromImdb', null, { params: { imdbId } });
  return res.data;
};

// GET /genres (у тебя просто /genres)
export const getAllGenres = async () => {
  const res = await http.get('/genres');
  return res.data;
};
