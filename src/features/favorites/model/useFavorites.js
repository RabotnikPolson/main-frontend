import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyFavorites,
  addFavoriteByImdb,
  removeFavoriteByImdb,
} from "../shared/api/favorites";
import { mapMovie } from "../entities/movie/mapper";

export function useFavorites() {
  const qc = useQueryClient();

  const favs = useQuery({
    queryKey: ["favorites", "me"],
    queryFn: async () => {
      const arr = await getMyFavorites();
      return Array.isArray(arr) ? arr.map(mapMovie) : [];
    },
  });

  const add = useMutation({
    mutationFn: addFavoriteByImdb,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", "me"] }),
  });

  const remove = useMutation({
    mutationFn: removeFavoriteByImdb,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", "me"] }),
  });

  return { ...favs, add: add.mutateAsync, remove: remove.mutateAsync };
}
