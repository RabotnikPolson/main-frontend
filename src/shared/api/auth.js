import http from './http';

export async function register({ username, password }) {
  const { data } = await http.post('/api/auth/register', { username, password });
  return data; // { token, username, role? }
}

export async function login({ username, password }) {
  const { data } = await http.post('/api/auth/login', { username, password });
  return data; // { token, username, role? }
}
