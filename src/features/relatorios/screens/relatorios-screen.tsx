import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { AvatarInitials, Card, Icon } from "@/components/ui";
import { useAlunosContext } from "@/features/alunos";
import { useTurmasContext } from "@/features/turmas";
import { colors, radii, spacing } from "@/theme";

interface WeekOption {
  label: string;
  subtitle: string;
  multiplier: number;
}

const WEEKS: WeekOption[] = [
  { label: "21 set – 27 set", subtitle: "Semana anterior", multiplier: 0.85 },
  { label: "28 set – 04 out", subtitle: "Semana atual", multiplier: 1 },
  { label: "05 out – 11 out", subtitle: "Próxima semana", multiplier: 0.6 },
];

export function RelatoriosScreen() {
  const router = useRouter();
  const { turmaId } = useLocalSearchParams<{ turmaId?: string }>();
  const { turmas } = useTurmasContext();
  const { alunos } = useAlunosContext();

  const turmaFilterOptions = useMemo(() => {
    if (turmas.length > 0) {
      return turmas.map((t) => ({ id: t.id, label: t.nome }));
    }
    const uniqueNames = Array.from(new Set(alunos.map((a) => a.turmaName)));
    return uniqueNames.map((name) => ({ id: name, label: name }));
  }, [alunos, turmas]);

  const [selectedTurmaKey, setSelectedTurmaKey] = useState<string>(
    turmaId ?? "todas"
  );
  const [weekIndex, setWeekIndex] = useState(1);

  const selectedTurmaLabel = useMemo(() => {
    if (selectedTurmaKey === "todas") return null;
    const byId = turmas.find((t) => t.id === selectedTurmaKey);
    return byId ? byId.nome : selectedTurmaKey;
  }, [selectedTurmaKey, turmas]);

  const filteredAlunos = useMemo(() => {
    if (!selectedTurmaLabel) return alunos;
    return alunos.filter(
      (a) => a.turmaName.toLowerCase() === selectedTurmaLabel.toLowerCase()
    );
  }, [alunos, selectedTurmaLabel]);

  const currentWeek = WEEKS[weekIndex] ?? WEEKS[1];

  const summaryStats = useMemo(() => {
    const baseRecords = filteredAlunos.reduce(
      (acc, a) => acc + a.recordsCount,
      0
    );
    const totalRecords = Math.max(
      0,
      Math.round(baseRecords * currentWeek.multiplier)
    );
    const totalStudents = filteredAlunos.length;
    const followedStudents = filteredAlunos.filter(
      (a) => a.recordsCount > 0
    ).length;

    return {
      totalRecords,
      followedStudents,
      totalStudents,
    };
  }, [currentWeek.multiplier, filteredAlunos]);

  return (
    <AppShell
      title="Relatório semanal"
      activeTab="turmas"
      onBackPress={turmaId ? () => router.back() : undefined}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>Relatório semanal</Text>
        <Text style={styles.pageSubtitle}>
          Acompanhamento consolidado por aluno, turma e semana.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.turmaFilterRow}
      >
        <Pressable
          onPress={() => setSelectedTurmaKey("todas")}
          style={[
            styles.turmaChip,
            selectedTurmaKey === "todas" && styles.turmaChipActive,
          ]}
        >
          <Text
            style={[
              styles.turmaChipText,
              selectedTurmaKey === "todas" && styles.turmaChipTextActive,
            ]}
          >
            Todas as turmas
          </Text>
        </Pressable>

        {turmaFilterOptions.map((item) => {
          const isSelected = selectedTurmaKey === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedTurmaKey(item.id)}
              style={[
                styles.turmaChip,
                isSelected && styles.turmaChipActive,
              ]}
            >
              <Text
                style={[
                  styles.turmaChipText,
                  isSelected && styles.turmaChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.weekSelectorRow}>
        <Pressable
          onPress={() => setWeekIndex((i) => Math.max(0, i - 1))}
          disabled={weekIndex === 0}
          style={[styles.weekArrowBtn, weekIndex === 0 && styles.weekArrowDisabled]}
        >
          <Icon name="chevron-left" size={18} color={colors.icon.default} />
        </Pressable>

        <View style={styles.weekCenterPill}>
          <Text style={styles.weekLabel}>{currentWeek.label}</Text>
          <Text style={styles.weekSubtitle}>{currentWeek.subtitle}</Text>
        </View>

        <Pressable
          onPress={() => setWeekIndex((i) => Math.min(WEEKS.length - 1, i + 1))}
          disabled={weekIndex === WEEKS.length - 1}
          style={[
            styles.weekArrowBtn,
            weekIndex === WEEKS.length - 1 && styles.weekArrowDisabled,
          ]}
        >
          <Icon name="chevron-right" size={18} color={colors.icon.default} />
        </Pressable>
      </View>

      <View style={styles.kpiRow}>
        <Card style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>REGISTROS</Text>
            <View
              style={[
                styles.kpiIconBox,
                { backgroundColor: colors.brand.primaryLight },
              ]}
            >
              <Icon name="list" size={16} color={colors.brand.primary} />
            </View>
          </View>
          <Text style={styles.kpiValue}>{summaryStats.totalRecords}</Text>
        </Card>

        <Card style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>ALUNOS ACOMPANHADOS</Text>
          </View>
          <Text style={styles.kpiValue}>
            {summaryStats.followedStudents}/{summaryStats.totalStudents}
          </Text>
        </Card>
      </View>

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumo por aluno</Text>
          <Pressable onPress={() => router.push("/alunos" as Href)}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </Pressable>
        </View>

        {filteredAlunos.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum aluno encontrado para a turma selecionada.
          </Text>
        ) : (
          <View style={styles.studentSummaryList}>
            {filteredAlunos.map((aluno) => {
              const avgProgress =
                aluno.skills.length > 0
                  ? Math.round(
                      aluno.skills.reduce((acc, s) => acc + s.percentage, 0) /
                        aluno.skills.length
                    )
                  : 60;

              const isAttention = aluno.status === "atencao";
              const subtitleText =
                aluno.status === "destaque"
                  ? "Evolução consistente"
                  : aluno.status === "atencao"
                  ? "Acompanhar comandos"
                  : "Boa participação";

              const subtitleColor =
                aluno.status === "destaque"
                  ? colors.text.success
                  : aluno.status === "atencao"
                  ? colors.tags.amber.text
                  : colors.brand.primary;

              const barColor = isAttention
                ? colors.status.warning
                : colors.status.success;

              return (
                <Pressable
                  key={aluno.id}
                  onPress={() => router.push(`/alunos/${aluno.id}` as Href)}
                  style={styles.studentSummaryCard}
                >
                  <View style={styles.studentSummaryTop}>
                    <AvatarInitials
                      initials={aluno.initials}
                      variant={aluno.avatarVariant}
                      size={40}
                    />

                    <View style={styles.studentSummaryInfo}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {aluno.name}
                      </Text>
                      <Text
                        style={[styles.studentStatus, { color: subtitleColor }]}
                      >
                        {subtitleText}
                      </Text>
                    </View>

                    <Text style={styles.studentRecords}>
                      {Math.max(
                        1,
                        Math.round(aluno.recordsCount * currentWeek.multiplier)
                      )}{" "}
                      registros
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(100, avgProgress)}%`,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Destaques da semana</Text>

        <View
          style={[
            styles.highlightBanner,
            { backgroundColor: colors.background.successRow },
          ]}
        >
          <Icon name="chart" size={18} color={colors.text.success} />
          <Text style={styles.highlightText}>
            Participação oral cresceu 18% em relação à semana anterior.
          </Text>
        </View>

        <View
          style={[
            styles.highlightBanner,
            { backgroundColor: colors.tags.amber.bg },
          ]}
        >
          <Icon name="sparkles" size={18} color={colors.tags.amber.text} />
          <Text style={styles.highlightText}>
            Retomar comandos de sala com os alunos em atenção.
          </Text>
        </View>
      </Card>
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
  turmaFilterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: 2,
  },
  turmaChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.full,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  turmaChipActive: {
    backgroundColor: colors.brand.primaryLight,
    borderColor: colors.brand.primary,
  },
  turmaChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  turmaChipTextActive: {
    color: colors.brand.primary,
    fontWeight: "700",
  },
  weekSelectorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  weekArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.xl,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  weekArrowDisabled: {
    opacity: 0.45,
  },
  weekCenterPill: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  weekSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.brand.primary,
  },
  kpiRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  kpiCard: {
    flex: 1,
    gap: spacing.sm,
  },
  kpiHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.text.secondary,
  },
  kpiIconBox: {
    width: 30,
    height: 30,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text.primary,
  },
  sectionCard: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text.primary,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.brand.primary,
  },
  emptyText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  studentSummaryList: {
    gap: spacing.sm,
  },
  studentSummaryCard: {
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.background.primary,
    gap: spacing.sm,
  },
  studentSummaryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  studentSummaryInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  studentStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  studentRecords: {
    fontSize: 12,
    color: colors.text.placeholder,
  },
  progressTrack: {
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.border.subtle,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.full,
  },
  highlightBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.xl,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.primary,
    fontWeight: "500",
  },
});
