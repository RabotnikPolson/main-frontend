// src/hooks/useMovie.js
import { useQuery } from '@tanstack/react-query';
import { getMovieByImdb } from '../shared/api/movies';
import { mapMovie } from '../entities/movie/mapper';

export const useMovie = (imdbId) => {
  return useQuery({
    queryKey: ['movie', imdbId],
    queryFn: async () => {
      if (!imdbId) throw new Error('No imdbId provided');
      const data = await getMovieByImdb(imdbId);
      return mapMovie(data);
    },
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 5,
  });
};
