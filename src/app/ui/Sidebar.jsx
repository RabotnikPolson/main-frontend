import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const items = [
    { to: "/", label: "Р“Р»Р°РІРЅР°СЏ" },
    { to: "/genres", label: "Р–Р°РЅСЂС‹" },
    { to: "/favorites", label: "РР·Р±СЂР°РЅРЅРѕРµ" },
    { to: "/history", label: "РСЃС‚РѕСЂРёСЏ" },
    { to: "/profile", label: "РџСЂРѕС„РёР»СЊ" },
    { to: "/settings", label: "РќР°СЃС‚СЂРѕР№РєРё" },
    { to: "/subscription", label: "РџРѕРґРїРёСЃРєР°" },
  ];

  if (isAdmin) {
    items.push({ to: "/admin/movies", label: "РђРґРјРёРЅ-РїР°РЅРµР»СЊ" });
    items.push({ to: "/add-movie", label: "Р”РѕР±Р°РІРёС‚СЊ С„РёР»СЊРј" });
    items.push({ to: "/analytics", label: "РђРЅР°Р»РёС‚РёРєР°" });
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
