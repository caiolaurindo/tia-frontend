import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import { NovaConquistaInput } from "../types/conquistas.types";

export interface ConquistasEmptyStateProps {
  variant: "sem-conquistas" | "sem-resultados";
  sugestoes?: NovaConquistaInput[];
  onSugestaoPress?: (sugestao: NovaConquistaInput) => void;
}

export function ConquistasEmptyState({
  variant,
  sugestoes = [],
  onSugestaoPress,
}: ConquistasEmptyStateProps) {
  if (variant === "sem-resultados") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhuma conquista encontrada</Text>
        <Text style={styles.text}>
          Tente outra palavra ou limpe o filtro de habilidade.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comece pelo que você já ensina</Text>
      <Text style={styles.text}>
        Toque em uma sugestão para adicionar ou crie a sua própria conquista.
      </Text>
      <View style={styles.suggestions}>
        {sugestoes.map((s) => (
          <Pressable
            key={s.nome}
            onPress={() => onSugestaoPress?.(s)}
            accessibilityRole="button"
            accessibilityLabel={`Adicionar ${s.nome}`}
            style={styles.suggestion}
          >
            <Text style={styles.suggestionText}>+ {s.nome}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 6,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: spacing.lg,
  },
  suggestions: { gap: spacing.sm, alignItems: "center" },
  suggestion: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.brand.primary,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: spacing.lg,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brand.primary,
  },
});
