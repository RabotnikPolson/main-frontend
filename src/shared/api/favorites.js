import http from "./http";

export const getMyFavorites = async () => {
  const res = await http.get("/users/me/favorites");
  return res.data;
};

export const addFavoriteByImdb = async imdbId => {
  const res = await http.put(
    `/users/me/favorites/${encodeURIComponent(imdbId)}`
  );
  return res.data;
};

export const removeFavoriteByImdb = async imdbId => {
  const res = await http.delete(
    `/users/me/favorites/${encodeURIComponent(imdbId)}`
  );
  return res.data;
};
