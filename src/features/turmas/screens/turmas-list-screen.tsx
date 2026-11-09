
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

import { AppShell } from "@/components/layout";
import { Button, SearchBar } from "@/components/ui";
import { colors, spacing, radii } from "@/theme";

import { useTurmasContext } from "../context/turmas-context";
import { TurmaCard } from "../components/turma-card";
import { TurmaStatus } from "../types/turmas.types";

type FiltroTurma = "todas" | TurmaStatus;

export function TurmasListScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<FiltroTurma>("todas");

  const { turmas } = useTurmasContext();

  const filteredTurmas = turmas.filter((turma) => {
    const correspondeBusca = turma.nome
      .toLowerCase()
      .includes(search.toLowerCase());

    const correspondeFiltro =
      filtro === "todas" || turma.status === filtro;

    return correspondeBusca && correspondeFiltro;
  });

  const filtros: { label: string; value: FiltroTurma }[] = [
    { label: "Todas", value: "todas" },
    { label: "Ativas", value: "ativa" },
    { label: "Arquivadas", value: "arquivada" },
  ];

  return (
    <AppShell title="Turmas" activeTab="turmas">
      <View style={styles.header}>
        <Text style={styles.title}>Minhas turmas</Text>

        <Text style={styles.subtitle}>
          Acompanhe e organize suas turmas escolares.
        </Text>
      </View>

      <Button
        title="+ Nova turma"
        onPress={() => router.push("/turmas/nova")}
      />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar turma..."
      />

      <View style={styles.filters}>
        {filtros.map((item) => {
          const selecionado = filtro === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => setFiltro(item.value)}
              style={[
                styles.filterButton,
                selecionado && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selecionado && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>
          {filtro === "todas"
            ? "Todas as turmas"
            : filtro === "ativa"
              ? "Turmas ativas"
              : "Turmas arquivadas"}
        </Text>

        <Text style={styles.counter}>
          {filteredTurmas.length}{" "}
          {filteredTurmas.length === 1 ? "turma" : "turmas"}
        </Text>
      </View>

      <View style={styles.list}>
        {filteredTurmas.length > 0 ? (
          filteredTurmas.map((turma) => (
            <TurmaCard
              key={turma.id}
              turma={turma}
              onPress={() =>
                router.push({
                  pathname: "/turmas/detalhes/[id]",
                  params: { id: turma.id },
                })
              }
            />
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

  filters: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  filterButtonActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  filterTextActive: {
    color: colors.text.inverse,
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
