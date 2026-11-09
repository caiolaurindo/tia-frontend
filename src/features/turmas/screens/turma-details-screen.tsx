
import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppShell } from "@/components/layout";
import { Badge, Button, Card } from "@/components/ui";
import { colors, spacing } from "@/theme";

import { useTurmasContext } from "../context/turmas-context";

export function TurmaDetailsScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { getTurmaById } = useTurmasContext();

  const turma = getTurmaById(id);

  if (!turma) {
    return (
      <AppShell title="Turma" activeTab="turmas">
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Turma não encontrada</Text>

          <Text style={styles.subtitle}>
            Não foi possível localizar os dados desta turma.
          </Text>

          <Button
            title="Voltar para turmas"
            onPress={() => router.replace("/turmas")}
          />
        </View>
      </AppShell>
    );
  }

  const isAtiva = turma.status === "ativa";

  return (
    <AppShell title="Detalhes da turma" activeTab="turmas">
      <View style={styles.header}>
        <Text style={styles.title}>{turma.nome}</Text>

        <Text style={styles.subtitle}>
          Confira as informações desta turma.
        </Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={styles.sectionTitle}>Informações gerais</Text>

          <Badge
            label={isAtiva ? "Ativa" : "Arquivada"}
            variant={isAtiva ? "green" : "slate"}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome da turma</Text>
          <Text style={styles.infoValue}>{turma.nome}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Turno</Text>
          <Text style={styles.infoValue}>{turma.turno}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Quantidade de alunos</Text>
          <Text style={styles.infoValue}>
            {turma.quantidadeAlunos}
          </Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Voltar para turmas"
          variant="secondary"
          onPress={() => router.back()}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.secondary,
  },

  card: {
    gap: spacing.lg,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },

  infoItem: {
    gap: spacing.xs,
  },

  infoLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
  },

  actions: {
    marginTop: spacing.sm,
  },

  emptyContainer: {
    gap: spacing.md,
  },
});
