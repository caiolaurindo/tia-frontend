import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { AvatarInitials, Button, Card, Icon, IconName } from "@/components/ui";
import type { StatusConquistaApi } from "@/services";
import { colors, radii, spacing } from "@/theme";
import { AlunoFormModal } from "../components/aluno-form-modal";
import { useAlunosContext } from "../context/alunos-context";
import { useAlunoConquistas } from "../hooks/use-aluno-conquistas";
import {
  AlunoConquistaItem,
  AlunoEventType,
  AlunoProfileTab,
} from "../types/alunos.types";

const PROFILE_TABS: { key: AlunoProfileTab; label: string }[] = [
  { key: "visao_geral", label: "Visão geral" },
  { key: "historico", label: "Histórico" },
  { key: "evolucao", label: "Evolução" },
];

const EVENT_ICON_STYLE: Record<
  AlunoEventType,
  { icon: IconName; bg: string; color: string }
> = {
  conquista: {
    icon: "trophy",
    bg: colors.tags.amber.bg,
    color: colors.tags.amber.text,
  },
  participacao: {
    icon: "hand",
    bg: colors.brand.primaryLight,
    color: colors.brand.primary,
  },
  atividade: {
    icon: "check",
    bg: colors.tags.green.bg,
    color: colors.tags.green.text,
  },
};

const STATUS_OPTIONS: { value: StatusConquistaApi; label: string }[] = [
  { value: "NAO_TRABALHADO", label: "Não trabalhado" },
  { value: "EM_DESENVOLVIMENTO", label: "Em desenv." },
  { value: "EM_DESENVOLVIMENTO_AVANCADO", label: "Avançado" },
  { value: "CONQUISTADO", label: "Conquistado" },
];

export function AlunoProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getAlunoById, updateAluno } = useAlunosContext();

  const alunoBase = getAlunoById(id);
  const { events, skills, achievementsCount, itens, salvarStatus } =
    useAlunoConquistas(alunoBase?.id, alunoBase?.turmaId);
  const [savingId, setSavingId] = useState<number | null>(null);
  const aluno = useMemo(
    () =>
      alunoBase
        ? { ...alunoBase, events, skills, achievementsCount }
        : undefined,
    [alunoBase, events, skills, achievementsCount]
  );

  const [activeTab, setActiveTab] = useState<AlunoProfileTab>("visao_geral");
  const [historyFilter, setHistoryFilter] = useState<"todos" | AlunoEventType>(
    "todos"
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    if (!aluno) return [];
    if (historyFilter === "todos") return aluno.events;
    return aluno.events.filter((ev) => ev.type === historyFilter);
  }, [aluno, historyFilter]);

  const handleChangeStatus = async (
    item: AlunoConquistaItem,
    status: StatusConquistaApi
  ) => {
    if (savingId !== null) return;
    try {
      setSavingId(item.conquistaId);
      await salvarStatus(item, status);
    } catch (e) {
      const mensagem =
        e instanceof Error ? e.message : "Não foi possível salvar o status.";
      if (Platform.OS === "web") {
        window.alert(mensagem);
      } else {
        Alert.alert("Erro", mensagem);
      }
    } finally {
      setSavingId(null);
    }
  };

  if (!aluno) {
    return (
      <AppShell
        title="Perfil do aluno"
        activeTab="alunos"
        onBackPress={() => router.back()}
      >
        <Card style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>Aluno não encontrado</Text>
          <Button
            title="Voltar para alunos"
            variant="secondary"
            onPress={() => router.replace("/alunos" as Href)}
          />
        </Card>
      </AppShell>
    );
  }

  const recentEvents = aluno.events.slice(0, 3);
  const previewSkills = aluno.skills.slice(0, 2);

  return (
    <AppShell
      title="Perfil do aluno"
      activeTab="alunos"
      onBackPress={() => router.back()}
    >
      <Card style={styles.heroCard}>
        <View style={styles.heroTop}>
          <AvatarInitials
            initials={aluno.initials}
            variant={aluno.avatarVariant}
            size={68}
          />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{aluno.name}</Text>
            <Text style={styles.heroMeta}>
              {aluno.turmaName} · {aluno.grade} · {aluno.age} anos
            </Text>
            <Text style={styles.heroGuardian}>
              Responsável: {aluno.guardianName}
            </Text>
          </View>
        </View>

        <View style={styles.heroActions}>
          <Pressable
            onPress={() => setIsEditModalOpen(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/registros/novo")}
            style={styles.newRecordButton}
          >
            <Icon name="plus" size={16} color={colors.text.inverse} />
            <Text style={styles.newRecordButtonText}>Novo registro</Text>
          </Pressable>
        </View>
      </Card>

      <View style={styles.subTabsRow}>
        {PROFILE_TABS.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.subTab, isSelected && styles.subTabActive]}
            >
              <Text
                style={[
                  styles.subTabText,
                  isSelected && styles.subTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === "visao_geral" ? (
        <>
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
              <Text style={styles.kpiValue}>{aluno.recordsCount}</Text>
            </Card>

            <Card style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Text style={styles.kpiLabel}>CONQUISTAS</Text>
                <View
                  style={[
                    styles.kpiIconBox,
                    { backgroundColor: colors.tags.green.bg },
                  ]}
                >
                  <Icon name="trophy" size={16} color={colors.tags.green.text} />
                </View>
              </View>
              <Text style={styles.kpiValue}>{aluno.achievementsCount}</Text>
            </Card>
          </View>

          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Acontecimentos recentes</Text>
              <Pressable onPress={() => setActiveTab("historico")}>
                <Text style={styles.sectionLink}>Ver histórico</Text>
              </Pressable>
            </View>

            {recentEvents.length === 0 ? (
              <Text style={styles.emptySectionText}>
                Nenhum acontecimento registrado ainda.
              </Text>
            ) : (
              <View style={styles.timeline}>
                {recentEvents.map((event, index) => {
                  const iconConfig = EVENT_ICON_STYLE[event.type];
                  const isLast = index === recentEvents.length - 1;
                  return (
                    <View key={event.id} style={styles.timelineRow}>
                      <View style={styles.timelineLeft}>
                        <View
                          style={[
                            styles.timelineIconCircle,
                            { backgroundColor: iconConfig.bg },
                          ]}
                        >
                          <Icon
                            name={iconConfig.icon}
                            size={16}
                            color={iconConfig.color}
                          />
                        </View>
                        {!isLast ? <View style={styles.timelineLine} /> : null}
                      </View>

                      <View style={styles.timelineContent}>
                        <View style={styles.timelineTitleRow}>
                          <Text style={styles.timelineTitle}>
                            {event.title}
                          </Text>
                          <Text style={styles.timelineDate}>
                            {event.dateLabel}
                          </Text>
                        </View>
                        <Text style={styles.timelineDescription}>
                          {event.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </Card>

          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Evolução</Text>
              <Pressable onPress={() => setActiveTab("evolucao")}>
                <Text style={styles.sectionLink}>Ver detalhes</Text>
              </Pressable>
            </View>

            <View style={styles.skillsList}>
              {previewSkills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                  <View style={styles.skillHeader}>
                    <Text style={styles.skillLabel}>{skill.label}</Text>
                    <Text style={styles.skillPercent}>
                      {skill.statusLabel} · {skill.percentage}%
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(100, skill.percentage)}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </>
      ) : null}

      {activeTab === "historico" ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Histórico completo</Text>

          <View style={styles.historyFilters}>
            {(
              [
                { key: "todos", label: "Todos" },
                { key: "conquista", label: "Conquistas" },
                { key: "participacao", label: "Participação" },
                { key: "atividade", label: "Atividades" },
              ] as const
            ).map((opt) => {
              const selected = historyFilter === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setHistoryFilter(opt.key)}
                  style={[
                    styles.historyChip,
                    selected && styles.historyChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.historyChipText,
                      selected && styles.historyChipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredEvents.length === 0 ? (
            <Text style={styles.emptySectionText}>
              Nenhum registro encontrado para este filtro.
            </Text>
          ) : (
            <View style={styles.timeline}>
              {filteredEvents.map((event, index) => {
                const iconConfig = EVENT_ICON_STYLE[event.type];
                const isLast = index === filteredEvents.length - 1;
                return (
                  <View key={event.id} style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineIconCircle,
                          { backgroundColor: iconConfig.bg },
                        ]}
                      >
                        <Icon
                          name={iconConfig.icon}
                          size={16}
                          color={iconConfig.color}
                        />
                      </View>
                      {!isLast ? <View style={styles.timelineLine} /> : null}
                    </View>

                    <View style={styles.timelineContent}>
                      <View style={styles.timelineTitleRow}>
                        <Text style={styles.timelineTitle}>{event.title}</Text>
                        <Text style={styles.timelineDate}>
                          {event.dateLabel}
                        </Text>
                      </View>
                      <Text style={styles.timelineDescription}>
                        {event.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Card>
      ) : null}

      {activeTab === "evolucao" ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Evolução por conquista</Text>

          {itens.length === 0 ? (
            <Text style={styles.emptySectionText}>
              A turma deste aluno ainda não tem conquistas vinculadas. Vincule
              conquistas à turma na tela de Conquistas.
            </Text>
          ) : (
            <View style={styles.skillsList}>
              {itens.map((item) => (
                <View key={item.conquistaId} style={styles.skillItem}>
                  <Text style={styles.skillLabel}>{item.nome}</Text>
                  <View style={styles.statusRow}>
                    {STATUS_OPTIONS.map((opt) => {
                      const selected = item.status === opt.value;
                      return (
                        <Pressable
                          key={opt.value}
                          disabled={savingId === item.conquistaId}
                          onPress={() =>
                            void handleChangeStatus(item, opt.value)
                          }
                          style={[
                            styles.statusChip,
                            selected && styles.statusChipSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusChipText,
                              selected && styles.statusChipTextSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>
      ) : null}

      <AlunoFormModal
        visible={isEditModalOpen}
        initialAluno={aluno}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(input) => updateAluno(aluno.id, input)}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  notFoundCard: {
    gap: spacing.md,
    alignItems: "center",
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  heroCard: {
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  heroInfo: {
    flex: 1,
    gap: 3,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text.primary,
  },
  heroMeta: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  heroGuardian: {
    fontSize: 12,
    color: colors.text.placeholder,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  editButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  newRecordButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primary,
  },
  newRecordButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.inverse,
  },
  subTabsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  subTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  subTabActive: {
    backgroundColor: colors.brand.primaryLight,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  subTabTextActive: {
    color: colors.brand.primary,
    fontWeight: "700",
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
    letterSpacing: 0.6,
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
  emptySectionText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  timeline: {
    gap: spacing.xs,
  },
  timelineRow: {
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 62,
  },
  timelineLeft: {
    alignItems: "center",
    width: 36,
  },
  timelineIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.md,
    gap: 2,
  },
  timelineTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.text.placeholder,
  },
  timelineDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  skillsList: {
    gap: spacing.md,
  },
  skillItem: {
    gap: spacing.xs,
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  skillPercent: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.success,
  },
  progressTrack: {
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.background.subtle,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.full,
    backgroundColor: colors.status.success,
  },
  historyFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  historyChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  historyChipSelected: {
    backgroundColor: colors.brand.primaryLight,
    borderColor: colors.brand.primary,
  },
  historyChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  historyChipTextSelected: {
    color: colors.brand.primary,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  statusChipSelected: {
    backgroundColor: colors.brand.primaryLight,
    borderColor: colors.brand.primary,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  statusChipTextSelected: {
    color: colors.brand.primary,
  },
});