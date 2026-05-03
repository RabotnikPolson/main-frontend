import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";

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
    items.push({ to: "/admin/movies", label: "Админ-панель" });
    items.push({ to: "/add-movie", label: "Добавить фильм" });
    items.push({ to: "/analytics", label: "Аналитика" });
  }

  return (
    <nav className="sidebar-nav">
      <ul className="navlist">
        {items.map((item) => (
          <li key={item.to}>
            <Link className="navitem" to={item.to}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
