// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { login as apiLogin } from '../shared/api/auth';
import '../styles/pages/Auth.css';

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const from = loc.state?.from?.pathname || '/';

  const mutation = useMutation({
    mutationFn: () => apiLogin(form),
    onSuccess: (data) => {
      const token = data?.token || data?.accessToken;
      const username = data?.username || form.username;
      const role = data?.role || 'ROLE_USER';
      if (!token) return alert('Сервер не вернул токен');
      login(token, username, role);
      nav(from, { replace: true });
    },
  });

  const submit = (e) => { e.preventDefault(); mutation.mutate(); };

  return (
    <div className="container auth-page">
      <h1>Вход</h1>
      {mutation.isError && <div className="error">{mutation.error.message}</div>}
      <form onSubmit={submit} className="auth-form">
        <input
          className="input"
          placeholder="Логин"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          autoComplete="username"
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
          required
        />
        <button className="button" type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Входим…' : 'Войти'}
        </button>
      </form>

      <div className="auth-switch">
        <small>
          Нет аккаунта? <Link to="/register" state={{ from }}>Зарегистрироваться</Link>
        </small>
      </div>
    </div>
  );
}
