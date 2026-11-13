import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { colors, spacing } from "@/theme";

import { Turma } from "../types/turmas.types";

interface TurmaCardProps {
  turma: Turma;
  onPress: () => void;
}

export function TurmaCard({ turma, onPress }: TurmaCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{turma.nome}</Text>
            <Text style={styles.subtitle}>
              {turma.serie} • {turma.anoLetivo}
            </Text>
          </View>

          <Badge
            label={turma.status === "ativa" ? "Ativa" : "Arquivada"}
            variant={turma.status === "ativa" ? "green" : "slate"}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.detail}>
            Turno: {turma.turno}
          </Text>

          <Text style={styles.detail}>
            Faixa etária: {turma.faixaEtaria}
          </Text>
        </View>

        {turma.descricao ? (
          <Text style={styles.description}>{turma.descricao}</Text>
        ) : null}
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  details: {
    gap: spacing.xs,
  },
  detail: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 19,
  },
});