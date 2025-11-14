// src/hooks/useComments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../shared/api/http";

// api
async function listRootComments({ imdbId, page = 0, size = 20, sort = "top" }) {
  const { data } = await http.get(`/api/movies/${imdbId}/comments`, {
    params: { page, size, sort },
  });

  return {
    items: data.content,
    hasMore: !data.last,
  };
}

async function createComment({ imdbId, body, parentId }) {
  const { data } = await http.post(`/api/movies/${imdbId}/comments`, {
    imdbId,
    body,
    parentId,
  });
  return data;
}

async function updateComment(id, payload) {
  const { data } = await http.put(`/api/comments/${id}`, payload);
  return data;
}

async function deleteComment(id) {
  await http.delete(`/api/comments/${id}`);
}

async function reactComment(id, reaction) {
  await http.post(`/api/comments/${id}/reactions/${reaction}`);
}

// hooks
export function useRootComments(imdbId, page, size, sort) {
  return useQuery({
    queryKey: ["commentsRoot", imdbId, page, size, sort],
    enabled: !!imdbId,
    queryFn: () => listRootComments({ imdbId, page, size, sort }),
  });
}

// заглушка
export const useReplies = () => ({
  isLoading: false,
  data: { items: [] },
});

// mutations
export function useCommentMutations(imdbId) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["commentsRoot", imdbId] });

  return {
    create: useMutation({
      mutationFn: createComment,
      onSuccess: invalidate,
    }),

    update: useMutation({
      mutationFn: ({ id, payload }) => updateComment(id, payload),
      onSuccess: invalidate,
    }),

    remove: useMutation({
      mutationFn: deleteComment,
      onSuccess: invalidate,
    }),

    react: useMutation({
      mutationFn: ({ id, reaction }) => reactComment(id, reaction),
      onSuccess: invalidate,
    }),
  };
}
