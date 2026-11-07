import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import { PROGRESSO_SEGMENTOS } from "./conquista-progress-bar";

export function ConquistasLegend() {
  return (
    <View style={styles.container}>
      {PROGRESSO_SEGMENTOS.map((s) => (
        <View key={s.key} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: s.color }]} />
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  item: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: "500", color: colors.text.secondary },
});
