// src/components/Header.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMovies } from '../hooks/useMovies';
import '../styles/components/Header.css';

const HISTORY_KEY = 'search_history_v1';
const MAX_HISTORY = 20;
const MAX_SUGGESTIONS = 10;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveHistory(arr) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, MAX_HISTORY))); } catch {}
}

export default function Header() {
  const { user, logout } = useAuth();
  const { data: movies = [] } = useMovies();

  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(loadHistory());
  const [highlight, setHighlight] = useState(-1);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const urlQ = params.get('q') || '';
    setQ(urlQ);
    setOpen(false);
    setHighlight(-1);
  }, [location.search, params]);

  const dictionary = useMemo(() => {
    const t = new Set();
    for (const m of movies) {
      if (m?.title) t.add(m.title);
      if (m?.genre) String(m.genre).split(',').map(s => s.trim()).forEach(g => t.add(g));
    }
    return Array.from(t);
  }, [movies]);

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return history;
    const prefix = dictionary
      .filter(v => v.toLowerCase().startsWith(term))
      .slice(0, MAX_SUGGESTIONS);
    const histUnique = history.filter(h => !prefix.some(p => p.toLowerCase() === h.toLowerCase()));
    return [...prefix, ...histUnique].slice(0, MAX_SUGGESTIONS);
  }, [q, dictionary, history]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!menuRef.current || !inputRef.current) return;
      if (!menuRef.current.contains(e.target) && !inputRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const navigateWith = (value) => {
    const v = value.trim();
    if (v) navigate(`/?q=${encodeURIComponent(v)}`);
    else navigate(`/`);
  };

  const submit = (e) => {
    e.preventDefault();
    navigateWith(q);
    if (q.trim()) {
      const next = [q.trim(), ...history.filter(x => x.toLowerCase() !== q.trim().toLowerCase())];
      setHistory(next);
      saveHistory(next);
    }
    setOpen(false);
  };

  const clearQuery = () => {
    setQ('');
    navigate(`/`, { replace: true });
    setOpen(false);
    setHighlight(-1);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { setOpen(true); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => (h + 1) % suggestions.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => (h - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === 'Enter' && highlight >= 0 && suggestions[highlight]) {
      e.preventDefault();
      const s = suggestions[highlight];
      setQ(s);
      navigateWith(s);
      const next = [s, ...history.filter(x => x.toLowerCase() !== s.toLowerCase())];
      setHistory(next);
      saveHistory(next);
      setOpen(false);
    } else if (e.key === 'Escape') { setOpen(false); setHighlight(-1); }
  };

  const clearHistory = () => { setHistory([]); saveHistory([]); };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <Link to="/" className="header-title">Cinema&nbsp;App</Link>
        </div>

        <div className="header-center">
          <form onSubmit={submit} className="search-bar" role="search" onFocus={() => setOpen(true)}>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Введите запрос"
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); setHighlight(-1); }}
              onKeyDown={onKeyDown}
            />
            {q && (
              <button type="button" className="search-btn search-clear" aria-label="Очистить" onClick={clearQuery}>✕</button>
            )}
            <button type="submit" className="search-btn" aria-label="Искать">🔍</button>
          </form>

          {open && suggestions.length > 0 && (
            <div ref={menuRef} className="search-panel">
              <ul className="search-list">
                {suggestions.map((s, i) => (
                  <li
                    key={s + i}
                    className={`search-item ${i === highlight ? 'active' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setQ(s);
                      navigateWith(s);
                      const next = [s, ...history.filter(x => x.toLowerCase() !== s.toLowerCase())];
                      setHistory(next);
                      saveHistory(next);
                      setOpen(false);
                    }}
                  >
                    <span className="search-item-icon">{q.trim() ? '🔎' : '↺'}</span>
                    <span className="search-item-text">{s}</span>
                  </li>
                ))}
              </ul>
              <div className="search-footer">
                <button className="clear-history" type="button" onClick={clearHistory}>Очистить историю</button>
              </div>
            </div>
          )}
        </div>

        <div className="header-right">
          {user ? (
            <>
              <Link to="/profile" className="profile-link">@{user.username}</Link>
              <button type="button" className="logout-btn" onClick={logout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">Войти</Link>
              <Link to="/register" className="auth-link">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
