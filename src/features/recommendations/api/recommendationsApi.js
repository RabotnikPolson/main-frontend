import http from "@/shared/api/http-client";

export const listRecommendationsByTab = async (type, movieId, limit = 15) => {
  const response = await http.get(`/api/v1/recommendations/tab/${type}/${movieId}?limit=${limit}`);
  return response.data;
};

export const listDomesticRecommendations = async (limit = 15) => {
  const response = await http.get(`/api/v1/recommendations/tab/domestic?limit=${limit}`);
  return response.data;
};

// Legacy support
export const listRightRail = async (movieId, limit = 15) => {
  const response = await http.get(`/api/v1/recommendations/movie/${movieId}?limit=${limit}`);
  return response.data;
};

export const getSmartFeed = async () => {
  const response = await http.get('/api/v1/recommendations/feed');
  return response.data;
};
