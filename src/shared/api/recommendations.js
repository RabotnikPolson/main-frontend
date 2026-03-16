import http from "./http";

// movieId теперь должен быть обычным числом (id из БД)
export const listRightRail = async (movieId, limit = 15) => {
  const response = await http.get(`/api/v1/recommendations/movie/${movieId}?limit=${limit}`);
  return response.data;
};

export const getSmartFeed = async () => {
  const response = await http.get('/api/v1/recommendations/feed');
  return response.data;
};
