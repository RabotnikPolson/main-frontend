import axios from "axios";

// Python AI сервис — прямое подключение без Java-прокси
const AI_BASE_URL = "http://localhost:8000";

const aiHttp = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 15000,
});

/**
 * Лента рекомендаций для главной страницы.
 * Если пользователь авторизован — передаём user_id из localStorage.
 */
export const getSmartFeed = async () => {
  let userId = null;
  try {
    const user = JSON.parse(localStorage.getItem("authUser") || "null");
    userId = user?.id ?? null;
  } catch {}

  const params = userId ? { user_id: userId } : {};
  const response = await aiHttp.get("/api/v1/recommendations/feed", { params });
  return response.data;
};

/**
 * Рекомендации по типу для страницы фильма.
 * type: franchise | director | actor | genre | content | hybrid | smart | collaborative-item
 */
export const listRecommendationsByTab = async (type, movieId, limit = 15) => {
  const response = await aiHttp.get(
    `/api/v1/recommendations/tab/${type}/${movieId}`,
    { params: { limit } }
  );
  return response.data;
};

/**
 * Казахстанское кино
 */
export const listDomesticRecommendations = async (limit = 15) => {
  const response = await aiHttp.get("/api/v1/recommendations/tab/domestic", {
    params: { limit },
  });
  return response.data;
};

/**
 * Правая колонка — похожие фильмы (legacy)
 */
export const listRightRail = async (movieId, limit = 15) => {
  const response = await aiHttp.get(
    `/api/v1/recommendations/movie/${movieId}`,
    { params: { limit } }
  );
  return response.data;
};
