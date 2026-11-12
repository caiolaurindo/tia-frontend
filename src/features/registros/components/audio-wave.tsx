import React from 'react';
import { View, StyleSheet } from 'react-native';

export function AudioWave() {
  const heights = [12, 24, 18, 35, 42, 20, 30, 15, 25, 38, 45, 22, 16, 28, 34, 19, 12];

  return (
    <View style={styles.soundWaveContainer}>
      {heights.map((height, i) => (
        <View key={i} style={[styles.soundBar, { height }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  soundWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 50,
    marginBottom: 24,
  },
  soundBar: {
    width: 3,
    backgroundColor: '#60A5FA',
    borderRadius: 2,
  },
});