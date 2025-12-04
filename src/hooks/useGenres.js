import { useQuery } from "@tanstack/react-query";
import { getAllGenres } from "../shared/api/movies";

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: getAllGenres,
    staleTime: 1000 * 60 * 10,
  });
}
