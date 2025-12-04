import http from "./http";

export const listRootComments = ({ imdbId, page = 0, size = 20, sort = "top" }) =>
  http
    .get(`/movies/${imdbId}/comments`, { params: { page, size, sort } })
    .then(r => r.data);

export const listReplies = ({ commentId, page = 0, size = 10 }) =>
  Promise.resolve({ content: [] });

export const createComment = ({ imdbId, body, parentId }) =>
  http
    .post(`/movies/${imdbId}/comments`, { body, parentId })
    .then(r => r.data);

export const updateComment = (id, payload) =>
  http.put(`/comments/${id}`, payload).then(r => r.data);

export const deleteComment = id =>
  http.delete(`/comments/${id}`).then(r => r.data);

export const reactComment = (id, reaction, method = "POST") => {
  const url = `/comments/${id}/reactions/${reaction}`;
  return method === "DELETE"
    ? http.delete(url).then(r => r.data)
    : http.post(url).then(r => r.data);
};
