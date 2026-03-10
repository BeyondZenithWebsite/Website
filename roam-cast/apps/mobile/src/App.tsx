import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { api, setToken } from './lib/api';
import { useAppStore } from './store/useAppStore';
import WelcomeScreen from './screens/WelcomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import MapScreen from './screens/MapScreen';
import StoryScreen from './screens/StoryScreen';

export default function App() {
  const [email] = useState('walker@roamcast.dev');
  const [screen, setScreen] = useState<'welcome' | 'home' | 'roaming' | 'map' | 'story' | 'settings'>('welcome');
  const [status, setStatus] = useState('Idle');
  const [story, setStory] = useState<any>(null);
  const { roaming, paused, setRoaming, setPaused, recentPoiIds, setCandidate, currentCandidate, pushRecent } = useAppStore();

  useEffect(() => {
    (async () => {
      const login = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
      setToken(login.token);
    })();
  }, [email]);

  useEffect(() => {
    if (!roaming || paused) return;
    let active = true;
    const interval = setInterval(async () => {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        setStatus('Location denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const out = await api('/roaming/check', {
        method: 'POST',
        body: JSON.stringify({ lat: loc.coords.latitude, lng: loc.coords.longitude, radius: 30, recentPoiIds })
      });
      if (!active) return;
      if (out.candidate) {
        setCandidate(out.candidate);
        setStatus(`Story nearby: ${out.candidate.name}`);
      } else {
        setStatus('Roaming... no new nearby story');
      }
    }, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [roaming, paused, recentPoiIds, setCandidate]);

  const playStory = async () => {
    if (!currentCandidate) return;
    await api('/interactions', { method: 'POST', body: JSON.stringify({ poiId: currentCandidate.poiId, action: 'accepted' }) });
    const s = await api(`/stories/${currentCandidate.poiId}`);
    setStory(s);
    pushRecent(currentCandidate.poiId);
    if (s.audioUrl) {
      Alert.alert('Playing', 'Audio playback wired. Replace mock URL with hosted mp3 for live playback.');
      // TODO: switch to real signed URL and remove mock placeholder.
      // const { sound } = await Audio.Sound.createAsync({ uri: `http://localhost:4000${s.audioUrl}` });
      // await sound.playAsync();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, gap: 14 }}>
      {screen === 'welcome' && <WelcomeScreen onContinue={() => setScreen('home')} />}

      {screen !== 'welcome' && (
        <>
          <Text style={{ fontSize: 28, fontWeight: '700' }}>Roam Cast</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Button title="Home" onPress={() => setScreen('home')} />
            <Button title="Roaming" onPress={() => setScreen('roaming')} />
            <Button title="Map" onPress={() => setScreen('map')} />
            <Button title="Story" onPress={() => setScreen('story')} />
            <Button title="Settings" onPress={() => setScreen('settings')} />
          </View>
        </>
      )}

      {screen === 'home' && <Text>Start Roaming, open map, and manage categories from settings.</Text>}

      {screen === 'roaming' && (
        <>
          <Text>{status}</Text>
          {!roaming ? <Button title="Start Roaming" onPress={() => { setRoaming(true); setStatus('Roaming mode on'); }} /> : <Button title="Stop Roaming" onPress={() => setRoaming(false)} />}
          {roaming && <Button title={paused ? 'Resume' : 'Pause'} onPress={() => setPaused(!paused)} />}
          {currentCandidate && (
            <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
              <Text style={{ fontWeight: '700' }}>Interesting story nearby. Want to hear it?</Text>
              <Text>{currentCandidate.name} · {Math.round(currentCandidate.distanceMeters)}m</Text>
              <Button title="Play story" onPress={playStory} />
            </View>
          )}
        </>
      )}

      {screen === 'story' && <StoryScreen story={story} />}
      {screen === 'map' && <MapScreen />}
      {screen === 'settings' && <SettingsScreen />}
    </SafeAreaView>
  );
}
