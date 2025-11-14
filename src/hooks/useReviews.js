// src/hooks/useReviews.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../shared/api/http";

// получить список отзывов
async function listReviews({ imdbId, page = 0, size = 10 }) {
  const { data } = await http.get(`/api/movies/${imdbId}/reviews`, {
    params: { page, size },
  });

  return {
    items: data.content,
    hasMore: !data.last,
  };
}

// создать отзыв
async function createReview({ imdbId, rating, title, body }) {
  const { data } = await http.post(`/api/movies/${imdbId}/reviews`, {
    rating,
    title,
    body,
  });
  return data;
}

// обновить отзыв
async function updateReview(id, payload) {
  const { data } = await http.put(`/api/reviews/${id}`, payload);
  return data;
}

// реакция
async function reactReview(id, reaction) {
  await http.post(`/api/reviews/${id}/reactions/${reaction}`);
}

// хук: список
export function useReviews(imdbId, page = 0, size = 10) {
  return useQuery({
    queryKey: ["reviews", imdbId, page, size],
    enabled: !!imdbId,
    queryFn: () => listReviews({ imdbId, page, size }),
    keepPreviousData: true,
  });
}

// хук: CRUD
export function useCreateOrUpdateReview(imdbId) {
  const qc = useQueryClient();

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["reviews", imdbId] });

  const create = useMutation({
    mutationFn: createReview,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }) => updateReview(id, payload),
    onSuccess: invalidate,
  });

  return { create, update };
}

// лайки/дизлайки
export function useReactReview(imdbId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reaction }) => reactReview(id, reaction),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["reviews", imdbId] }),
  });
}
