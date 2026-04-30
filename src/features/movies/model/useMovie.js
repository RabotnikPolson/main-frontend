import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../shared/api/movies";
import { mapMovie } from "../entities/movie/mapper";

export const useMovie = (id) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      if (!id) throw new Error("No id provided");
      const data = await getMovie(id);
      return mapMovie(data);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
