import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/ui";
import { colors, shadows, spacing } from "@/theme";

export interface ConquistasPageHeaderProps {
  onNewPress: () => void;
}

export function ConquistasPageHeader({ onNewPress }: ConquistasPageHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <Text style={styles.title} accessibilityRole="header">
          Conquistas
        </Text>
        <Text style={styles.subtitle}>
          Objetivos observáveis e progresso dos alunos.
        </Text>
      </View>

      <Pressable
        onPress={onNewPress}
        accessibilityRole="button"
        accessibilityLabel="Nova conquista"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Icon name="plus" size={18} color={colors.text.inverse} />
        <Text style={styles.buttonText}>Nova</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  texts: { flex: 1 },
  title: { fontSize: 28, fontWeight: "800", color: colors.text.primary },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    marginTop: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    ...shadows.button,
  },
  buttonPressed: { backgroundColor: colors.brand.primaryPressed },
  buttonText: { fontSize: 15, fontWeight: "700", color: colors.text.inverse },
});
