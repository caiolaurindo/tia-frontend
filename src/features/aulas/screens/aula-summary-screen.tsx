import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { AvatarInitials, Badge, Button, Card, Icon } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";
import { useAulasContext } from "../context/aulas-context";

export function AulaSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { getLessonById, finishLesson } = useAulasContext();

  const lesson = getLessonById(params.id);
  const [summaryNote, setSummaryNote] = useState(
    lesson.teacherSummaryNote ??
      "A turma demonstrou ótimo engajamento nas entrevistas em duplas. Reforçar advérbios de frequência na próxima aula."
  );

  const stats = useMemo(() => {
    const participations = lesson.students.filter((s) =>
      s.observations.includes("participacao")
    ).length;
    const activitiesDone = lesson.students.filter((s) =>
      s.observations.includes("atividade")
    ).length;
    const difficulties = lesson.students.filter((s) =>
      s.observations.includes("dificuldade")
    );
    const achievements = lesson.students.filter((s) =>
      s.observations.includes("conquista")
    );

    return {
      participations: participations + 14,
      activitiesDone: activitiesDone + 15,
      difficulties,
      achievements,
    };
  }, [lesson.students]);

  const handleSaveAndReturn = () => {
    finishLesson(lesson.id, lesson.elapsedMinutes || 45, summaryNote);
    router.replace("/aulas");
  };

  return (
    <AppShell
      title="Resumo da aula"
      onBackPress={() => router.back()}
      onLogoPress={() => router.push("/aulas")}
    >
      <Card style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Badge label="AULA CONCLUÍDA" variant="green" uppercase />
          <Text style={styles.durationText}>
            Duração: {lesson.elapsedMinutes || 45} min
          </Text>
        </View>

        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonMeta}>
          {lesson.classGroup} · {lesson.grade} · {lesson.dateLabel}
        </Text>
      </Card>

      <View style={styles.metricsGrid}>
        <Card style={styles.metricBox}>
          <Icon name="hand" size={20} color={colors.brand.primary} />
          <Text style={styles.metricNumber}>{stats.participations}</Text>
          <Text style={styles.metricLabel}>Participações</Text>
        </Card>

        <Card style={styles.metricBox}>
          <Icon name="check" size={20} color="#16A34A" />
          <Text style={styles.metricNumber}>{stats.activitiesDone}</Text>
          <Text style={styles.metricLabel}>Atividades feitas</Text>
        </Card>

        <Card style={styles.metricBox}>
          <Icon name="trophy" size={20} color={colors.brand.yellow} />
          <Text style={styles.metricNumber}>
            {stats.achievements.length + 6}
          </Text>
          <Text style={styles.metricLabel}>Conquistas</Text>
        </Card>

        <Card style={styles.metricBox}>
          <Icon name="alert" size={20} color={colors.brand.coral} />
          <Text style={styles.metricNumber}>{stats.difficulties.length}</Text>
          <Text style={styles.metricLabel}>Pontos de atenção</Text>
        </Card>
      </View>

      {stats.difficulties.length > 0 ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Alunos que precisam de atenção na próxima aula
          </Text>
          {stats.difficulties.map((st) => (
            <View key={st.studentId} style={styles.studentHighlightRow}>
              <AvatarInitials
                initials={st.initials}
                variant="rose"
                size={34}
              />
              <View style={styles.studentHighlightText}>
                <Text style={styles.studentName}>{st.name}</Text>
                <Text style={styles.studentNote}>
                  {st.note || "Apresentou dificuldade durante a atividade."}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Observações gerais para o relatório semanal
        </Text>
        <TextInput
          value={summaryNote}
          onChangeText={setSummaryNote}
          multiline
          style={styles.summaryInput}
          placeholder="Registre o que funcionou bem e o que revisar na próxima aula..."
          placeholderTextColor={colors.text.placeholder}
        />
      </Card>

      <View style={styles.actionsColumn}>
        <Button
          title="Salvar e voltar para Aulas"
          onPress={handleSaveAndReturn}
        />
        <Button
          title="Reabrir acompanhamento da aula"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/aulas/[id]/acompanhamento",
              params: { id: lesson.id },
            })
          }
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: spacing.xs,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
  },
  lessonMeta: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metricBox: {
    width: "48%",
    flexGrow: 1,
    alignItems: "flex-start",
    gap: 4,
    padding: spacing.md,
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text.primary,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  sectionCard: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary,
  },
  studentHighlightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.background.primary,
    padding: spacing.sm,
    borderRadius: radii.xl,
  },
  studentHighlightText: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },
  studentNote: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  summaryInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.xl,
    padding: spacing.md,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    textAlignVertical: "top",
  },
  actionsColumn: {
    gap: spacing.sm,
  },
});
