import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../shared/api/http-client';
// useAuth находится в этой же директории
import { useAuth } from './useAuth';

/**
 * useUserSettings hook
 *
 * Этот хук обёртывает обращения к API для чтения и обновления настроек пользователя.
 * Настройки доступны только для текущего аутентифицированного пользователя; для других
 * пользователей они не загружаются. Если переданное имя пользователя не совпадает
 * с логином текущего пользователя, хук вернёт `null` в данных. При успешном обновлении
 * инвалидирует кеш.
 *
 * @param {string} username Имя пользователя, чьи настройки нужно загрузить.
 */
export const useUserSettings = (username) => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const isMe = !!username && user?.username === username;

  const key = ['user', username, 'settings'];

  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      // Настройки доступны только для себя
      if (!isMe) return null;
      const res = await http.get('/settings/me');
      return res.data;
    },
    enabled: isMe,
  });

  const m = useMutation({
    mutationFn: async (payload) => {
      const res = await http.put('/settings/me', payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });

  return {
    ...q,
    save: m.mutateAsync,
    saveStatus: m.status,
    saveError: m.error,
  };
};
