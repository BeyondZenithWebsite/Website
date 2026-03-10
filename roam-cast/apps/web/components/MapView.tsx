'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ pois }: { pois: any[] }) {
  return (
    <MapContainer center={[-37.8136, 144.9631]} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pois.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]}>
          <Popup>
            <strong>{p.name}</strong>
            <div>{p.category}</div>
            <div>{p.shortSummary}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
