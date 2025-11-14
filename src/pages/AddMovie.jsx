// src/pages/AddMovie.jsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFromImdb } from '../shared/api/movies';
import '../styles/pages/AddMovie.css';

export default function AddMovie() {
  const [imdbId, setImdbId] = useState('');
  const [msg, setMsg] = useState('');
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => addFromImdb(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['movies'] });
      setMsg(`Фильм "${data?.title || data?.imdbId || imdbId}" добавлен`);
      setImdbId('');
    },
    onError: (err) => setMsg('Ошибка: ' + (err?.message || err)),
  });

  const submit = (e) => {
    e.preventDefault();
    const id = imdbId.trim();
    if (!/^tt\d{7,8}$/.test(id)) {
      setMsg('Неверный IMDb ID');
      return;
    }
    mutation.mutate(id);
  };

  return (
    <div className="addmovie-page container">
      <h1>Добавить фильм по IMDb ID</h1>

      <form onSubmit={submit} className="imdb-import">
        <input
          className="input"
          value={imdbId}
          onChange={(e) => setImdbId(e.target.value)}
          placeholder="tt1234567"
        />
        <button className="button" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Импорт…' : 'Импортировать'}
        </button>
      </form>

      {msg && <p className="status-message" role="status">{msg}</p>}
    </div>
  );
}
