import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@/theme";

export interface TrackingProgressBarProps {
  registeredCount: number;
  totalCount: number;
  showOnlyPending: boolean;
  onTogglePending: () => void;
}

export function TrackingProgressBar({
  registeredCount,
  totalCount,
  showOnlyPending,
  onTogglePending,
}: TrackingProgressBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        {registeredCount} de {totalCount} registrados
      </Text>

      <Pressable
        onPress={onTogglePending}
        hitSlop={8}
        accessibilityRole="button"
      >
        <Text style={styles.actionText}>
          {showOnlyPending ? "Ver todos" : "Ver pendentes"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#DCFCE7",
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.success,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.success,
    textDecorationLine: "underline",
  },
});
