import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing } from "@/theme";

export interface ConquistaChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function ConquistaChip({ label, selected, onPress }: ConquistaChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: spacing.md + 2,
  },
  chipSelected: {
    backgroundColor: colors.brand.primarySoft,
    borderColor: colors.brand.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  labelSelected: {
    color: colors.brand.primary,
  },
});
