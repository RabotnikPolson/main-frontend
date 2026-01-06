import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../shared/api/http";

async function fetchReviews({ movieId, page, size }) {
  const { data } = await http.get(`/reviews/movie/${movieId}`, {
    params: { page, size },
  });

  return {
    items: data.content,
    page: data.number,
    totalPages: data.totalPages,
    hasMore: !data.last,
  };
}

async function createReview({ movieId, content, parentId }) {
  const { data } = await http.post("/reviews", {
    movieId,
    content,
    parentId: parentId ?? null,
  });
  return data;
}

async function updateReview({ id, content }) {
  const { data } = await http.put(`/reviews/${id}`, { content });
  return data;
}

export function useReviews(movieId, page = 0, size = 20) {
  return useQuery({
    queryKey: ["reviews", movieId, page, size],
    enabled: Number.isFinite(movieId),
    queryFn: () => fetchReviews({ movieId, page, size }),
    keepPreviousData: true,
  });
}

export function useCreateReview(movieId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", movieId] });
    },
  });
}

export function useUpdateReview(movieId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", movieId] });
    },
  });
}
