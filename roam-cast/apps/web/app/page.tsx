'use client';

import { useEffect, useState } from 'react';
import { api, setToken } from '../lib/api';

export default function Home() {
  const [pois, setPois] = useState<any[]>([]);
  const [email, setEmail] = useState('demo@roamcast.dev');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<any>(null);

  async function login() {
    const out = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
    setToken(out.token);
    const rows = await api(`/pois?city=Melbourne${category ? `&category=${category}` : ''}`);
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
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="history">history</option>
          <option value="architecture">architecture</option>
          <option value="culture">culture</option>
          <option value="crime">crime</option>
          <option value="famous_people">famous_people</option>
          <option value="art">art</option>
          <option value="hidden_gems">hidden_gems</option>
          <option value="food">food</option>
          <option value="pop_culture">pop_culture</option>
        </select>
        <button onClick={login}>Refresh</button>
      </div>
      <h2>Melbourne CBD POIs</h2>
      <ul>
        {pois.slice(0, 50).map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <strong>{p.name}</strong> — {p.category} ({p.latitude.toFixed(4)}, {p.longitude.toFixed(4)})
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => rebuild(p.id)}>Rebuild story</button>
              <button onClick={async () => setSelected(await api(`/pois/${p.id}`))}>View</button>
            </div>
          </li>
        ))}
      </ul>
      {selected && (
        <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
          <h3>{selected.name}</h3>
          <p><strong>Short:</strong> {selected.shortStory || selected.shortSummary}</p>
          <p><strong>Long:</strong> {selected.longStory || 'N/A'}</p>
          <p><strong>Transcript:</strong> {selected.transcript || 'N/A'}</p>
        </section>
      )}
    </main>
  );
}
