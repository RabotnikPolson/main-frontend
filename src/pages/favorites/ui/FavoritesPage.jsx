import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MovieGrid from "../components/MovieGrid";
import { useMovies } from "../hooks/useMovies";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
} from "../shared/api/favorites";
import "../styles/pages/Favorites.css";

const localKey = (user = "guest") => `favorites_${user}`;

export default function Favorites() {
  const qc = useQueryClient();
  const { data: movies = [] } = useMovies();
  const { user } = useAuth();
  const username = user?.username ?? null;
  const { data: profile } = useUserProfile();
  const userId = profile?.userId ?? null;

  const {
    data: remoteFavsRaw = [],
    isLoading: favsLoading,
  } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await getFavoritesByUser(userId);
      return Array.isArray(data) ? data.map((w) => w.movieId) : [];
    },
    enabled: !!username && !!userId,
    staleTime: 30000,
  });

  const addMut = useMutation({
    mutationFn: (movieId) => addFavorite(userId, movieId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["favorites", userId],
      }),
  });

  const delMut = useMutation({
    mutationFn: (movieId) => removeFavorite(userId, movieId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["favorites", userId],
      }),
  });

  const [localFavs, setLocalFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(localKey()) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!username) {
      try {
        localStorage.setItem(localKey(), JSON.stringify(localFavs));
      } catch {}
    }
  }, [localFavs, username]);

  const favIds = username && userId ? remoteFavsRaw : localFavs;
  const favMovies = movies.filter((m) => favIds.includes(m.id));

  const toggle = (movieId) => {
    if (username && userId) {
      if (remoteFavsRaw.includes(movieId)) {
        delMut.mutate(movieId);
      } else {
        addMut.mutate(movieId);
      }
      return;
    }

    setLocalFavs((prev) =>
      prev.includes(movieId)
        ? prev.filter((x) => x !== movieId)
        : [movieId, ...prev]
    );
  };

  return (
    <div className="container favorites-page">
      <h1>Избранное</h1>

      {username && favsLoading && <div className="loading">Загрузка…</div>}

      {favMovies.length === 0 ? (
        <div className="empty">Пусто</div>
      ) : (
        <MovieGrid movies={favMovies} onToggleFavorite={toggle} />
      )}
    </div>
  );
}
