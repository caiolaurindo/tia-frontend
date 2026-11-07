import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radii, spacing, TagColorVariant } from "@/theme";

export interface BadgeProps {
  label: string;
  variant?: TagColorVariant;
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Badge({
  label,
  variant = "blue",
  uppercase = false,
  style,
}: BadgeProps) {
  const palette = colors.tags[variant];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.bg },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          uppercase && styles.uppercase,
          { color: palette.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.full,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  uppercase: {
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
