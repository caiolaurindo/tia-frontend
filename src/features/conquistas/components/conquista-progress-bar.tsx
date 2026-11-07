import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import { ProgressoTurma } from "../types/conquistas.types";
import { getTotalAlunos } from "../utils/conquistas-progress";

export const PROGRESSO_SEGMENTOS = [
  { key: "conquistado", label: "Conquistado", color: colors.status.success },
  {
    key: "emDesenvolvimento",
    label: "Em desenvolvimento",
    color: colors.status.warning,
  },
  { key: "naoTrabalhado", label: "Não trabalhado", color: colors.text.placeholder },
] as const;

export interface ConquistaProgressBarProps {
  progresso: ProgressoTurma;
}

export function ConquistaProgressBar({ progresso }: ConquistaProgressBarProps) {
  const total = getTotalAlunos(progresso);
  const label = `${progresso.conquistado} conquistaram, ${progresso.emDesenvolvimento} em desenvolvimento, ${progresso.naoTrabalhado} não trabalhado, de ${total} alunos`;

  return (
    <View>
      <View
        style={styles.track}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={label}
      >
        {PROGRESSO_SEGMENTOS.filter((s) => progresso[s.key] > 0).map((s) => (
          <View
            key={s.key}
            style={{ flex: progresso[s.key], backgroundColor: s.color }}
          />
        ))}
      </View>

      <View style={styles.counts} importantForAccessibility="no-hide-descendants">
        {PROGRESSO_SEGMENTOS.map((s) => (
          <View key={s.key} style={styles.count}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.countText}>{progresso[s.key]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: colors.border.default,
    marginTop: spacing.md,
    gap: 2,
  },
  counts: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  count: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  countText: { fontSize: 12, color: colors.text.secondary },
});
