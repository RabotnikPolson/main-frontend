// src/hooks/useMovies.js
import { useQuery } from '@tanstack/react-query';
import { getAllMovies } from '../shared/api/movies';
import { mapMovie } from '../entities/movie/mapper';

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const data = await getAllMovies();
      return Array.isArray(data) ? data.map(mapMovie) : [];
    },
    staleTime: 1000 * 60 * 2,
  });
};
