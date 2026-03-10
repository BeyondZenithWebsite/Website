import React from 'react';
import { View, Text, Button } from 'react-native';
export default function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return <View><Text style={{ fontSize: 22, fontWeight: '700' }}>Welcome to Roam Cast</Text><Text>Location-aware city storytelling.</Text><Button title="Continue" onPress={onContinue} /></View>;
}
