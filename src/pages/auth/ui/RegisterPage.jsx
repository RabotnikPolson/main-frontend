import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import "@/shared/styles/pages/Auth.css";

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: (payload) => register(payload),
    onSuccess: () => {
      nav("/", { replace: true });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ ...form });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Р РµРіРёСЃС‚СЂР°С†РёСЏ</h1>

        {mutation.isError && (
          <p className="error">РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚.</p>
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
            type="text"
            name="username"
            placeholder="Р›РѕРіРёРЅ"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            minLength={3}
            maxLength={50}
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="РџР°СЂРѕР»СЊ"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
            required
          />
          <button className="button" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "РЎРѕР·РґР°РµРј..." : "РЎРћР—Р”РђРўР¬ РђРљРљРђРЈРќРў"}
          </button>
        </form>
      </div>
    </div>
  );
}
