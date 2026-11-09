import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppShell } from "@/components/layout";
import { SearchBar } from "@/components/ui";
import { colors, spacing } from "@/theme";

import { mockTurmas } from "../data/mock-turmas";
import { TurmaCard } from "../components/turma-card";

export function TurmasListScreen() {
  const [search, setSearch] = useState("");

  const filteredTurmas = mockTurmas.filter((turma) =>
    turma.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Turmas" activeTab="turmas">
      <View style={styles.header}>
        <Text style={styles.title}>Minhas turmas</Text>
        <Text style={styles.subtitle}>
          Acompanhe e organize suas turmas escolares.
        </Text>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar turma..."
      />

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Todas as turmas</Text>

        <Text style={styles.counter}>
          {filteredTurmas.length} turmas
        </Text>
      </View>

      <View style={styles.list}>
        {filteredTurmas.length > 0 ? (
          filteredTurmas.map((turma) => (
            <TurmaCard key={turma.id} turma={turma} />
          ))
        ) : (
          <Text style={styles.emptyMessage}>
            Nenhuma turma encontrada.
          </Text>
        )}
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
    color: colors.text.secondary,
    lineHeight: 21,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  counter: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  list: {
    gap: spacing.md,
  },
  emptyMessage: {
    textAlign: "center",
    color: colors.text.secondary,
    paddingVertical: spacing.xxl,
  },
});