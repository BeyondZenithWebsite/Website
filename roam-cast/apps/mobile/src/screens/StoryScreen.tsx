import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
export default function StoryScreen({ story }: { story: any }) {
  if (!story) return <View><Text>No story playing.</Text></View>;
  return <View><Text style={{ fontWeight: '700' }}>Story</Text><Text>{story.shortStory}</Text><Button title="Tell me more" onPress={() => Alert.alert('Expanded story', story.longStory || '')} /></View>;
}
