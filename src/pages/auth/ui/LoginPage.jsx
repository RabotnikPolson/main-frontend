import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import "@/shared/styles/pages/Auth.css";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const from = loc.state?.from?.pathname || "/";

  const mutation = useMutation({
    mutationFn: (payload) => login(payload),
    onSuccess: () => {
      nav(from, { replace: true });
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
        <h1>Р’С…РѕРґ</h1>

        {mutation.isError && (
          <div className="error">
            РќРµ СѓРґР°Р»РѕСЃСЊ РІРѕР№С‚Рё. РџСЂРѕРІРµСЂСЊС‚Рµ email Рё РїР°СЂРѕР»СЊ.
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
            placeholder="РџР°СЂРѕР»СЊ"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button className="button" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Р’С…РѕРґРёРј..." : "Р’РѕР№С‚Рё"}
          </button>
        </form>

        <div className="auth-switch">
          <small>
            РќРµС‚ Р°РєРєР°СѓРЅС‚Р°?{" "}
            <Link to="/register" state={{ from }}>
              Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
