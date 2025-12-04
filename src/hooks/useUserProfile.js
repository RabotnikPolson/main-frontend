// src/hooks/useUserProfile.js
import { useQuery, useMutation } from "@tanstack/react-query";
import http from "../shared/api/http";

export const useUserProfile = username => {
  const key = ["user", username, "profile"];

  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await http.get(
        `/users/${encodeURIComponent(username)}/profile`
      );
      return res.data;
    },
    enabled: !!username,
  });

  const m = useMutation({
    mutationFn: async payload => {
      const res = await http.put(
        `/users/${encodeURIComponent(username)}/profile`,
        payload
      );
      return res.data;
    },
  });

  return {
    ...q,
    saveProfile: m.mutateAsync,
    saveStatus: m.status,
    saveError: m.error,
  };
};
