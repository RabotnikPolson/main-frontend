// src/hooks/useReviews.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../shared/api/http";

async function listReviews({ imdbId, page = 0, size = 10 }) {
  const { data } = await http.get(`/movies/${imdbId}/reviews`, {
    params: { page, size },
  });
  return {
    items: data.content,
    hasMore: !data.last,
  };
}

async function createReview({ imdbId, rating, title, body }) {
  const { data } = await http.post(`/movies/${imdbId}/reviews`, {
    rating,
    title,
    body,
  });
  return data;
}

async function updateReview(id, payload) {
  const { data } = await http.put(`/reviews/${id}`, payload);
  return data;
}

async function reactReview(id, reaction) {
  await http.post(`/reviews/${id}/reactions/${reaction}`);
}

export function useReviews(imdbId, page = 0, size = 10) {
  return useQuery({
    queryKey: ["reviews", imdbId, page, size],
    enabled: !!imdbId,
    queryFn: () => listReviews({ imdbId, page, size }),
    keepPreviousData: true,
  });
}

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

export function useReactReview(imdbId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reaction }) => reactReview(id, reaction),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["reviews", imdbId] }),
  });
}
