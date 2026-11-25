import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui";
import { colors } from "@/theme";

export interface ConquistasEmptyStateProps {
  variant: "sem-conquistas" | "sem-resultados" | "sem-arquivadas";
}

const CONTEUDO: Record<
  ConquistasEmptyStateProps["variant"],
  { title: string; text: string }
> = {
  "sem-conquistas": {
    title: "Nenhuma conquista ainda",
    text: "Toque em “Nova conquista” para criar a primeira.",
  },
  "sem-resultados": {
    title: "Nenhuma conquista encontrada",
    text: "Tente outra palavra ou limpe os filtros.",
  },
  "sem-arquivadas": {
    title: "Nenhuma conquista arquivada",
    text: "Quando você arquivar uma conquista, ela aparece aqui e pode ser restaurada.",
  },
};

export function ConquistasEmptyState({ variant }: ConquistasEmptyStateProps) {
  const { title, text } = CONTEUDO[variant];

  return (
    <Card>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", paddingVertical: 4 },
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
  },
});
