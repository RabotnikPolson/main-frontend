// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register as apiRegister } from '../shared/api/auth';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages/Auth.css';

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });

  const m = useMutation({
    mutationFn: apiRegister,
    onSuccess: (data) => {
      const role = data.role || 'ROLE_USER';
      login(data.token, data.username, role);
      nav('/', { replace: true });
    },
  });

  const submit = (e) => { e.preventDefault(); m.mutate(form); };

  return (
    <div className="container auth-page">
      <h1>Регистрация</h1>
      {m.error && <p className="error">{m.error.message}</p>}
      <form onSubmit={submit} className="auth-form">
        <input
          className="input"
          placeholder="Логин"
          value={form.username}
          onChange={(e)=>setForm({...form, username: e.target.value})}
          autoComplete="username"
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e)=>setForm({...form, password: e.target.value})}
          autoComplete="new-password"
          required
        />
        <button className="button" disabled={m.isLoading}>
          {m.isLoading ? 'Создаём…' : 'Создать аккаунт'}
        </button>
      </form>
    </div>
  );
}
