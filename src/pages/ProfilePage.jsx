// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages/Profile.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const username = user?.username;
  const { data, isLoading, isError, saveProfile } = useUserProfile(username);
  const [form, setForm] = useState({ displayName: '', email: '', avatarUrl: '', favoriteGenres: [] });

  useEffect(() => {
    if (data) {
      setForm({
        displayName: data.displayName || '',
        email: data.email || '',
        avatarUrl: data.avatarUrl || '',
        favoriteGenres: data.favoriteGenres || []
      });
    }
  }, [data]);

  const onSave = async () => {
    try { await saveProfile(form); } catch {}
  };

  if (!username) return <div className="container profile-page"><p>Войдите для управления профилем</p></div>;
  if (isLoading) return <div className="container profile-page"><p>Загрузка…</p></div>;
  if (isError) return <div className="container profile-page"><p>Ошибка загрузки</p></div>;

  return (
    <div className="container profile-page">
      <h1>Профиль</h1>

      <div className="profile-form">
        <label>
          Имя
          <input className="input" value={form.displayName} onChange={(e) => setForm({...form, displayName: e.target.value})} />
        </label>
        <label>
          Email
          <input className="input" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
        </label>
        <label>
          Аватар URL
          <input className="input" value={form.avatarUrl} onChange={(e) => setForm({...form, avatarUrl: e.target.value})} />
        </label>
        <label>
          Любимые жанры (через запятую)
          <input
            className="input"
            value={(form.favoriteGenres || []).join(', ')}
            onChange={(e) => setForm({...form, favoriteGenres: e.target.value.split(',').map(s => s.trim())})}
          />
        </label>

        <div className="actions">
          <button onClick={onSave} className="button">Сохранить профиль</button>
        </div>
      </div>
    </div>
  );
}
