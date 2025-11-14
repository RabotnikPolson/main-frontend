import React, { createContext, useContext, useEffect, useState } from 'react';
import http from '../shared/api/http'; // <-- важно: ставим токен в defaults

const AuthContext = createContext(null);

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}
function readUserFromStorage() {
  const token = safeGet('token');
  const username = safeGet('username');
  const role = safeGet('role');
  return token && username ? { token, username, role } : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readUserFromStorage());

  // при монтировании — если есть token в storage, уже выставлен в http (см http.js)
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) { setUser(readUserFromStorage()); return; }
      if (['token','username','role'].includes(e.key)) setUser(readUserFromStorage());
    };
    const onLogin = () => setUser(readUserFromStorage());
    const onLogout = () => setUser(null);

    window.addEventListener('storage', onStorage);
    window.addEventListener('app:login', onLogin);
    window.addEventListener('app:logout', onLogout);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('app:login', onLogin);
      window.removeEventListener('app:logout', onLogout);
    };
  }, []);

  const login = (token, username, role='ROLE_USER') => {
    safeSet('token', token);
    safeSet('username', username);
    safeSet('role', role);

    // обязательно сразу сфиксить в axios defaults — избегаем гонки
    try { http.defaults.headers.common.Authorization = `Bearer ${token}`; } catch (e) { /* ignore */ }

    setUser({ token, username, role });
    try { window.dispatchEvent(new CustomEvent('app:login', { detail: { username, role } })); } catch {}
  };

  const logout = () => {
    safeSet('token', null);
    safeSet('username', null);
    safeSet('role', null);

    // убрать заголовок из defaults
    try { delete http.defaults.headers.common.Authorization; } catch (e) { /* ignore */ }

    setUser(null);
    try { window.dispatchEvent(new CustomEvent('app:logout')); } catch {}
  };

  return React.createElement(AuthContext.Provider, { value: { user, login, logout } }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
