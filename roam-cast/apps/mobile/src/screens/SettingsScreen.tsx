import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { api } from '../lib/api';

const categories = ['history','architecture','culture','crime','famous_people','art','hidden_gems','food','pop_culture'];

export default function SettingsScreen() {
  const [selected, setSelected] = useState<string[]>(['history','architecture','culture']);

  useEffect(() => {
    (async () => {
      const prefs = await api('/me/preferences');
      if (Array.isArray(prefs) && prefs.length) setSelected(prefs.filter((p: any) => p.enabled).map((p: any) => p.category));
    })();
  }, []);

  async function toggle(cat: string) {
    const next = selected.includes(cat) ? selected.filter((c) => c !== cat) : [...selected, cat];
    setSelected(next);
    await api('/me/preferences', { method: 'PATCH', body: JSON.stringify({ categories: next }) });
  }

  return (
    <View>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Settings</Text>
      <Text style={{ marginBottom: 8 }}>Categories</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {categories.map((cat) => {
          const on = selected.includes(cat);
          return (
            <Pressable key={cat} onPress={() => toggle(cat)} style={{ paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderRadius: 20, backgroundColor: on ? '#222' : '#fff' }}>
              <Text style={{ color: on ? '#fff' : '#222' }}>{cat.replace('_', ' ')}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ marginTop: 12 }}>Account, permissions, debug mode: MVP TODO hooks ready.</Text>
    </View>
  );
}
