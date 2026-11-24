// Contas no servidor (server/server.mjs). Usado quando EXPO_PUBLIC_API_URL está definida.
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');

export const mode = 'remote';

async function call(path, { method = 'GET', body, session } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(session?.token && { Authorization: `Bearer ${session.token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw { code: 'network', message: 'Não consegui falar com o servidor. Verifique a internet.' };
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { code: json.code || 'error', message: json.message || 'Algo deu errado. Tente de novo.' };
  return json;
}

export async function restoreSession(saved) {
  if (!saved?.token) return null;
  try {
    const { user } = await call('/me', { session: saved });
    return { token: saved.token, user };
  } catch (e) {
    if (e.code === 'network') return saved; // sem internet: mantém a sessão salva
    return null;
  }
}

export const register = (dados) => call('/auth/register', { method: 'POST', body: dados });
export const login = (dados) => call('/auth/login', { method: 'POST', body: dados });
export const logout = (session) => call('/auth/logout', { method: 'POST', session }).catch(() => {});

export const loadData = (session) => call('/me/data', { session }).then((r) => r.data);
export const saveData = (session, data) => call('/me/data', { method: 'PUT', body: { data }, session });

export const loadGlobal = (session) => call('/global', { session });
export const addAdocao = (session, item) => call('/adocao', { method: 'POST', body: item, session });
export const removeAdocao = (session, id) => call(`/adocao/${encodeURIComponent(id)}`, { method: 'DELETE', session });
export const saveNoticias = (session, noticias) => call('/admin/noticias', { method: 'PUT', body: { noticias }, session });

export const listUsers = (session) => call('/admin/users', { session });
export const getUserData = (session, id) =>
  call(`/admin/users/${encodeURIComponent(id)}/data`, { session }).then((r) => r.data);
export const updateUser = (session, id, patch) =>
  call(`/admin/users/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch, session });
export const deleteUser = (session, id) => call(`/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE', session });
export const resetPassword = (session, id) =>
  call(`/admin/users/${encodeURIComponent(id)}/reset-password`, { method: 'POST', session });
