'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { api, setToken } from '../../lib/api';

const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

export default function MapPage() {
  const [pois, setPois] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const login = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'web@roamcast.dev' }) });
      setToken(login.token);
      const rows = await api('/pois?city=Melbourne');
      setPois(rows);
    })();
  }, []);

  return <div style={{ height: '100vh' }}><MapView pois={pois} /></div>;
}
