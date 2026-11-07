import React from "react";
import { StyleSheet, Text, View, ViewStyle, StyleProp } from "react-native";
import { colors, radii, spacing, typography } from "@/theme";

export interface BrandLogoProps {
  style?: StyleProp<ViewStyle>;
}

export function BrandLogo({ style }: BrandLogoProps) {
  return (
    <View style={[styles.container, style]} accessibilityRole="header">
      <View style={styles.badge}>
        <Text style={styles.badgeLetter}>T</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>TIA</Text>
        <Text style={styles.subtitle}>Teaching Intelligent Assistant</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: radii.xl,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLetter: {
    color: colors.text.inverse,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },
  textContainer: {
    justifyContent: "center",
  },
  title: {
    ...typography.brandTitle,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.brandSubtitle,
    color: colors.text.secondary,
    marginTop: 1,
  },
});
