import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";

export interface ConquistasToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export function ConquistasToast({
  message,
  actionLabel,
  onAction,
  onDismiss,
  durationMs = 4500,
}: ConquistasToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={() => {
            onAction();
            onDismiss();
          }}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    backgroundColor: colors.text.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
  },
  message: { flex: 1, fontSize: 13, fontWeight: "600", color: colors.text.inverse },
  action: { fontSize: 13, fontWeight: "800", color: colors.brand.primaryLight },
});
