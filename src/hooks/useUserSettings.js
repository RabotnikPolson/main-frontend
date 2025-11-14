import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../shared/api/http';

export const useUserSettings = (username) => {
  const qc = useQueryClient();
  const key = ['user', username, 'settings'];

  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await http.get(`/api/users/${encodeURIComponent(username)}/settings`);
      return res.data;
    },
    enabled: !!username,
  });

  const m = useMutation({
    mutationFn: async (payload) => {
      const res = await http.put(`/api/users/${encodeURIComponent(username)}/settings`, payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...q, save: m.mutateAsync, saveStatus: m.status, saveError: m.error };
};
