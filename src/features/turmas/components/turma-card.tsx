
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Card, Badge } from "@/components/ui";
import { colors, spacing } from "@/theme";

import { Turma } from "../types/turmas.types";

interface TurmaCardProps {
  turma: Turma;
  onPress: () => void;
}

export function TurmaCard({ turma, onPress }: TurmaCardProps) {
  const isAtiva = turma.status === "ativa";

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{turma.nome}</Text>
            <Text style={styles.subtitle}>
              Toque para visualizar os detalhes
            </Text>
          </View>

          <Badge
            label={isAtiva ? "Ativa" : "Arquivada"}
            variant={isAtiva ? "green" : "slate"}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View>
            <Text style={styles.infoLabel}>Turno</Text>
            <Text style={styles.infoValue}>{turma.turno}</Text>
          </View>

          <View>
            <Text style={styles.infoLabel}>Alunos</Text>
            <Text style={styles.infoValue}>
              {turma.quantidadeAlunos}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  titleContainer: {
    flex: 1,
    gap: spacing.xs,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },

  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.xxxl,
  },

  infoLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
