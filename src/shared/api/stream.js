import http from "./http";

export async function getStream(movieId, params = {}) {
  const { data } = await http.get(`/stream/${movieId}`, { params });
  return data;
}

