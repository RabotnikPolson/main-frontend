import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  const loc = useLocation();
  const hideUI = /^\/(login|register)(\/|$)/.test(loc.pathname); // скрыть Header+Sidebar

  return (
    <div className="app">
      {!hideUI && <Header />}

      <div className="layout" style={{ display: 'flex' }}>
        {!hideUI && (
          <aside className="sidebar">
            <Sidebar />
          </aside>
        )}

        <main className="main" style={{ flex: 1, minHeight: '100vh' }}>
          <React.Suspense fallback={<p style={{ padding: 24 }}>Загрузка…</p>}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
