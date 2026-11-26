import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AudioWaveProps {
  active?: boolean;
}

export function AudioWave({ active = true }: AudioWaveProps) {
  const heights = [12, 24, 18, 35, 42, 20, 30, 15, 25, 38, 45, 22, 16, 28, 34, 19, 12];

  return (
    <View style={styles.soundWaveContainer}>
      {heights.map((height, i) => (
        <View
          key={i}
          style={[
            styles.soundBar,
            {
              height: active ? height : Math.max(8, Math.round(height * 0.45)),
              backgroundColor: active ? '#2563EB' : '#93C5FD',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  soundWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 48,
    marginBottom: 12,
  },
  soundBar: {
    width: 3,
    borderRadius: 999,
  },
});