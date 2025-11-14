// src/pages/History.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/History.css';

const KEY = 'watch_history_guest';

function useHistoryStorage() {
  const push = (item) => {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const existing = arr.filter(i => i.imdbId !== item.imdbId);
    existing.unshift(item);
    const truncated = existing.slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(truncated));
  };
  const read = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const clear = () => localStorage.removeItem(KEY);
  return { push, read, clear };
}

export default function History(){
  const { read, clear } = useHistoryStorage();
  const items = read();

  if (!items.length) {
    return <div className="container history-page"><h1>История</h1><p className="muted">Пока нет записей</p></div>;
  }

  return (
    <div className="container history-page">
      <div className="header-row">
        <h1>История</h1>
        <button onClick={clear} className="button button--ghost">Очистить</button>
      </div>

      <div className="history-grid">
        {items.map(i => (
          <Link key={i.imdbId} to={`/movie/${i.imdbId}`} className="history-card">
            <img
              src={i.posterUrl || `https://via.placeholder.com/200x300/333/fff?text=${encodeURIComponent(i.title)}`}
              loading="lazy" width="120" height="180" alt={i.title}
            />
            <div className="meta">
              <h3>{i.title}</h3>
              <div className="ts">{new Date(i.timestamp).toLocaleString()}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
