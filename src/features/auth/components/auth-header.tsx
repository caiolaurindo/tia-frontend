import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BrandLogo } from "@/components/ui";
import { colors, radii, spacing, typography } from "@/theme";

export interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <BrandLogo style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.accentBar}>
        <View style={[styles.accentSegment, { backgroundColor: colors.brand.primary }]} />
        <View style={[styles.accentSegment, { backgroundColor: colors.brand.yellow }]} />
        <View style={[styles.accentSegment, { backgroundColor: colors.brand.purple }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  logo: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.brand.navy,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
  },
  accentBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
  },
  accentSegment: {
    height: 4,
    width: 24,
    borderRadius: radii.full,
  },
});
