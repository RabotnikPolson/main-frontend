import http from "../api/http";

// корневые комментарии под фильмом
export const listRootComments = ({ imdbId, page = 0, size = 20, sort = "top" }) =>
  http
    .get(`/api/movies/${imdbId}/comments`, { params: { page, size, sort } })
    .then((r) => r.data);

// ответы под комментарием — если хочешь сделать отдельный эндпоинт, добавь в бэк,
// но пока можно использовать тот же listRootComments, фильтруя parentId на фронте
export const listReplies = ({ commentId, page = 0, size = 10 }) =>
  Promise.resolve({ content: [] }); // нет эндпоинта — заглушка

// создание комментария под фильмом
export const createComment = ({ imdbId, body, parentId }) =>
  http
    .post(`/api/movies/${imdbId}/comments`, { body, parentId })
    .then((r) => r.data);

// обновление
export const updateComment = (id, payload) =>
  http.put(`/api/comments/${id}`, payload).then((r) => r.data);

// удаление
export const deleteComment = (id) =>
  http.delete(`/api/comments/${id}`).then((r) => r.data);

// реакции
export const reactComment = (id, reaction, method = "POST") => {
  const url = `/api/comments/${id}/reactions/${reaction}`;
  return method === "DELETE"
    ? http.delete(url).then((r) => r.data)
    : http.post(url).then((r) => r.data);
};
