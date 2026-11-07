import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/ui";
import { colors, radii, shadows, spacing, typography } from "@/theme";

export interface AulasPageHeaderProps {
  onNewLessonPress: () => void;
}

export function AulasPageHeader({ onNewLessonPress }: AulasPageHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aulas</Text>
      <Text style={styles.subtitle}>
        Planeje conteúdos, atividades e conquistas trabalhadas.
      </Text>

      <Pressable
        onPress={onNewLessonPress}
        style={({ pressed }) => [
          styles.newButton,
          pressed && styles.newButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Nova aula"
      >
        <Icon name="plus" size={16} color={colors.text.inverse} />
        <Text style={styles.newButtonText}>Nova aula</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  title: {
    ...typography.h1,
    fontSize: 26,
    lineHeight: 32,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radii.xl,
    gap: spacing.xs,
    ...shadows.button,
  },
  newButtonPressed: {
    backgroundColor: colors.brand.primaryPressed,
  },
  newButtonText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: "700",
  },
});
