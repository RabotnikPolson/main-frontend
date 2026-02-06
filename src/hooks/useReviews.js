// src/hooks/useReviews.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, deleteReview, listByMovie, updateReview } from "../shared/api/reviews";
import { rateMovie } from "../shared/api/ratings";

const keys = {
  byMovie: (movieId, page, size) => ["reviews", "movie", movieId, page, size],
  moviePrefix: (movieId) => ["reviews", "movie", movieId],
};

export function useReviewsByMovie(movieId, page = 0, size = 5) {
  return useQuery({
    queryKey: keys.byMovie(movieId, page, size),
    enabled: !!movieId,
    queryFn: () => listByMovie(movieId, { page, size, sort: "createdAt,desc" }),
  });
}

export function useReviewMutations(movieId) {
  const qc = useQueryClient();

  const invalidateMovie = async () => {
    if (!movieId) return;
    await qc.invalidateQueries({ queryKey: keys.moviePrefix(movieId) });
  };

  const create = useMutation({
    mutationFn: async ({ content, score }) => {
      // 1) оценка
      await rateMovie(movieId, score);
      // 2) текст отзыва
      return createReview({ movieId, content });
    },
    onSuccess: invalidateMovie,
  });

  const update = useMutation({
    mutationFn: async ({ id, content, score }) => {
      await rateMovie(movieId, score);
      return updateReview(id, { content });
    },
    onSuccess: invalidateMovie,
  });

  const remove = useMutation({
    mutationFn: async (id) => deleteReview(id),
    onSuccess: invalidateMovie,
  });

  return {
    createReview: create,
    updateReview: update,
    deleteReview: remove,
  };
}
