const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
let token = '';
export const setToken = (t: string) => (token = t);
export async function api(path: string, init?: RequestInit) {
  return fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '', ...(init?.headers || {}) }
  }).then((r) => r.json());
}
