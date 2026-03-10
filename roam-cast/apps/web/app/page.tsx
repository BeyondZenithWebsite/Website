'use client';

import { useEffect, useState } from 'react';
import { api, setToken } from '../lib/api';

export default function Home() {
  const [pois, setPois] = useState<any[]>([]);
  const [email, setEmail] = useState('demo@roamcast.dev');

  async function login() {
    const out = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
    setToken(out.token);
    const rows = await api('/pois?city=Melbourne');
    setPois(rows);
  }

  async function rebuild(id: string) {
    await api(`/admin/rebuild-poi/${id}`, { method: 'POST' });
    alert('rebuild triggered');
  }

  useEffect(() => { login(); }, []);

  return (
    <main style={{ padding: 16 }}>
      <h1>Roam Cast — Web Companion</h1>
      <p>Login, browse POIs, trigger story rebuild (admin-lite).</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
      <h2>Melbourne CBD POIs</h2>
      <ul>
        {pois.slice(0, 50).map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <strong>{p.name}</strong> — {p.category} ({p.latitude.toFixed(4)}, {p.longitude.toFixed(4)})
            <div>
              <button onClick={() => rebuild(p.id)}>Rebuild story</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
