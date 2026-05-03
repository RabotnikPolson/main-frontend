import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/app/ui/Header";
import Sidebar from "@/app/ui/Sidebar";

export default function AppLayout() {
  const loc = useLocation();
  const hideUI = /^\/(login|register)(\/|$)/.test(loc.pathname);

  return (
    <div className="app">
      {!hideUI && <Header />}

      <div className="layout">
        {!hideUI && (
          <aside className="sidebar">
            <Sidebar />
          </aside>
        )}

        <main className="main">
          <React.Suspense fallback={<div className="loading">Загрузка...</div>}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
