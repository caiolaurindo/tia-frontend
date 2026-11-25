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
      <View>
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
        <Text style={styles.buttonText}>Nova conquista</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
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
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand.primary,
    borderRadius: 16,
    paddingVertical: 15,
    ...shadows.button,
  },
  buttonPressed: { backgroundColor: colors.brand.primaryPressed },
  buttonText: { fontSize: 16, fontWeight: "700", color: colors.text.inverse },
});
