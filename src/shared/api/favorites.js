import http from './http';

export const getMyFavorites = async () => {
  const res = await http.get('/api/users/me/favorites');
  return res.data; // ожидаем массив Movie DTO
};

export const addFavoriteByImdb = async (imdbId) => {
  const res = await http.put(`/api/users/me/favorites/${encodeURIComponent(imdbId)}`);
  return res.data;
};

export const removeFavoriteByImdb = async (imdbId) => {
  const res = await http.delete(`/api/users/me/favorites/${encodeURIComponent(imdbId)}`);
  return res.data;
};
