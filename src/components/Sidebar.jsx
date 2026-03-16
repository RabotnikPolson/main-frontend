import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { isAdmin } = useAuth();

  const items = [
    { to: "/", label: "Главная" },
    { to: "/genres", label: "Жанры" },
    { to: "/favorites", label: "Избранное" },
    { to: "/history", label: "История" },
    { to: "/profile", label: "Профиль" },
    { to: "/settings", label: "Настройки" },
    { to: "/subscription", label: "Подписка" },
  ];

  if (isAdmin) {
    items.push({ to: "/add-movie", label: "Добавить фильм" });
    items.push({ to: "/admin/movies", label: "Админ: фильмы" });
    items.push({ to: "/analytics", label: "Аналитика" });
  }

  return (
    <nav className="sidebar-nav">
      <ul className="navlist">
        {items.map((i) => (
          <li key={i.to}>
            <Link className="navitem" to={i.to}>
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
