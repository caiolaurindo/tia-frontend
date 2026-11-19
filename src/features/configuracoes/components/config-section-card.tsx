import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui";
import { colors, spacing } from "@/theme";

export interface ConfigSectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ConfigSectionCard({
  title,
  subtitle,
  children,
}: ConfigSectionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <Card style={styles.card}>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    paddingHorizontal: spacing.xs,
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.placeholder,
  },
  card: {
    padding: 0,
    overflow: "hidden",
    backgroundColor: colors.background.surface,
  },
});
