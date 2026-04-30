import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../shared/api/http-client';
// useAuth находится в этой же директории, поэтому импорт относительно текущей папки
import { useAuth } from './useAuth';

/**
 * useUserProfile hook
 *
 * Этот хук обёртывает обращения к API для чтения и обновления профиля пользователя.
 * Он автоматически решает, использовать ли эндпоинты «/profile/me» или «/profile/{username}»
 * в зависимости от переданного имени пользователя и текущего аутентифицированного пользователя.
 * Возвращает данные профиля (`data`), флаги загрузки/ошибки и функцию `saveProfile`
 * для сохранения изменений. При успешном сохранении очищает кеш, чтобы данные обновились.
 *
 * @param {string} username Имя пользователя, чей профиль нужно загрузить.
 */
export const useUserProfile = (username) => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const isMe = !!username && user?.username === username;

  const key = ['user', username, 'profile'];

  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      if (!username) return null;
      // Выбираем правильный эндпоинт: /profile/me для текущего пользователя
      // или /profile/{username} для публичного профиля.
      const url = isMe ? '/profile/me' : `/profile/${encodeURIComponent(username)}`;
      const res = await http.get(url);
      return res.data;
    },
    enabled: !!username,
  });

  const m = useMutation({
    mutationFn: async (payload) => {
      // Обновлять можно только собственный профиль
      const res = await http.put('/profile/me', payload);
      return res.data;
    },
    onSuccess: () => {
      // Инвалидируем запрос, чтобы компоненты получили новые данные
      qc.invalidateQueries({ queryKey: key });
    },
  });

  return {
    ...q,
    saveProfile: m.mutateAsync,
    saveStatus: m.status,
    saveError: m.error,
  };
};
