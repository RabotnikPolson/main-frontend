// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import "../styles/pages/Auth.css";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const from = loc.state?.from?.pathname || "/";

  const mutation = useMutation({
    mutationFn: payload => login(payload),
    onSuccess: () => {
      nav(from, { replace: true });
    },
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    mutation.mutate({ ...form });
  };

  return (
    <div className="container auth-page">
      <h1>Вход</h1>

      {mutation.isError && (
        <div className="error">
          Не удалось войти. Проверьте email и пароль.
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <button className="button" type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Входим…" : "Войти"}
        </button>
      </form>

      <div className="auth-switch">
        <small>
          Нет аккаунта?{" "}
          <Link to="/register" state={{ from }}>
            Зарегистрироваться
          </Link>
        </small>
      </div>
    </div>
  );
}
