import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import {
  AvatarInitials,
  Badge,
  Card,
  Icon,
  SearchBar,
} from "@/components/ui";
import { colors, radii, spacing, TagColorVariant } from "@/theme";
import { AlunoFormModal } from "../components/aluno-form-modal";
import { useAlunosContext } from "../context/alunos-context";
import { AlunoFilterKey, AlunoStatus } from "../types/alunos.types";

const STATUS_BADGE: Record<
  AlunoStatus,
  { label: string; variant: TagColorVariant }
> = {
  no_ritmo: { label: "No ritmo", variant: "green" },
  destaque: { label: "Destaque", variant: "green" },
  atencao: { label: "Requer atenção", variant: "amber" },
};

export function AlunosListScreen() {
  const router = useRouter();
  const { alunos, createAluno } = useAlunosContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<AlunoFilterKey>("todos");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const counts = useMemo(() => {
    const destaques = alunos.filter((a) => a.status === "destaque").length;
    const atencao = alunos.filter((a) => a.status === "atencao").length;
    return {
      todos: alunos.length,
      destaques,
      atencao,
    };
  }, [alunos]);

  const filteredAlunos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return alunos.filter((aluno) => {
      const matchesFilter =
        activeFilter === "todos" ||
        (activeFilter === "destaques" && aluno.status === "destaque") ||
        (activeFilter === "atencao" && aluno.status === "atencao");

      const matchesSearch =
        !q ||
        aluno.name.toLowerCase().includes(q) ||
        aluno.turmaName.toLowerCase().includes(q) ||
        aluno.grade.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, alunos, searchQuery]);

  return (
    <AppShell title="Alunos" activeTab="alunos">
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>Alunos</Text>
        <Text style={styles.pageSubtitle}>
          Acompanhe cada trajetória de aprendizagem de forma individual.
        </Text>

        <Pressable
          onPress={() => setIsAddModalOpen(true)}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          accessibilityRole="button"
        >
          <Icon name="plus" size={18} color={colors.text.inverse} />
          <Text style={styles.addButtonText}>Adicionar aluno</Text>
        </Pressable>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar aluno..."
      />

      <View style={styles.filtersRow}>
        <Pressable
          onPress={() => setActiveFilter("todos")}
          style={[
            styles.filterChip,
            { backgroundColor: colors.brand.primaryLight },
            activeFilter === "todos" && styles.filterChipActiveBlue,
          ]}
        >
          <Text style={[styles.filterText, { color: colors.brand.primary }]}>
            Todos · {counts.todos}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter("destaques")}
          style={[
            styles.filterChip,
            { backgroundColor: colors.tags.green.bg },
            activeFilter === "destaques" && styles.filterChipActiveGreen,
          ]}
        >
          <Text style={[styles.filterText, { color: colors.tags.green.text }]}>
            Destaques · {counts.destaques}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter("atencao")}
          style={[
            styles.filterChip,
            { backgroundColor: colors.tags.amber.bg },
            activeFilter === "atencao" && styles.filterChipActiveAmber,
          ]}
        >
          <Text style={[styles.filterText, { color: colors.tags.amber.text }]}>
            Atenção · {counts.atencao}
          </Text>
        </Pressable>
      </View>

      <Card style={styles.listCard}>
        {filteredAlunos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum aluno encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Tente outro termo na busca ou adicione um novo aluno.
            </Text>
          </View>
        ) : (
          filteredAlunos.map((aluno, index) => {
            const badge = STATUS_BADGE[aluno.status];
            const isLast = index === filteredAlunos.length - 1;
            return (
              <Pressable
                key={aluno.id}
                onPress={() => router.push(`/alunos/${aluno.id}` as Href)}
                style={({ pressed }) => [
                  styles.studentRow,
                  !isLast && styles.studentRowBorder,
                  pressed && styles.studentRowPressed,
                ]}
              >
                <AvatarInitials
                  initials={aluno.initials}
                  variant={aluno.avatarVariant}
                  size={42}
                />

                <View style={styles.studentInfo}>
                  <Text style={styles.studentName} numberOfLines={1}>
                    {aluno.name}
                  </Text>
                  <Text style={styles.studentMeta} numberOfLines={1}>
                    {aluno.turmaName} · {aluno.grade}
                  </Text>
                </View>

                <Badge label={badge.label} variant={badge.variant} />
              </Pressable>
            );
          })
        )}
      </Card>

      <AlunoFormModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(input) => {
          const created = createAluno(input);
          router.push(`/alunos/${created.id}` as Href);
        }}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    gap: spacing.xs,
  },
  pageTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  addButton: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
  },
  addButtonPressed: {
    backgroundColor: colors.brand.primaryPressed,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.inverse,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipActiveBlue: {
    borderColor: colors.brand.primary,
  },
  filterChipActiveGreen: {
    borderColor: colors.tags.green.text,
  },
  filterChipActiveAmber: {
    borderColor: colors.tags.amber.text,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
  },
  listCard: {
    overflow: "hidden",
    padding: 0,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  studentRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  studentRowPressed: {
    backgroundColor: colors.background.subtle,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
  },
  studentMeta: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
