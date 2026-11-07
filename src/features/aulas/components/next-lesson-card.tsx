import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Badge, Button, Card, Icon } from "@/components/ui";
import { colors, spacing } from "@/theme";
import { LessonItem } from "../types/aulas.types";

export interface NextLessonCardProps {
  lesson: LessonItem;
  onStartTracking: (lesson: LessonItem) => void;
  onEditLesson: (lesson: LessonItem) => void;
  onViewSummary: (lesson: LessonItem) => void;
}

export function NextLessonCard({
  lesson,
  onStartTracking,
  onEditLesson,
  onViewSummary,
}: NextLessonCardProps) {
  const badgeLabel =
    lesson.status === "proxima"
      ? "PRÓXIMA AULA"
      : lesson.status === "em_andamento"
        ? "AULA EM ANDAMENTO"
        : lesson.status === "concluida"
          ? "AULA CONCLUÍDA"
          : "AULA PLANEJADA";

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Badge
          label={badgeLabel}
          variant={lesson.status === "concluida" ? "green" : "blue"}
          uppercase
        />

        <Pressable
          onPress={() => onEditLesson(lesson)}
          hitSlop={8}
          style={styles.editButton}
          accessibilityRole="button"
          accessibilityLabel="Editar planejamento da aula"
        >
          <Icon name="edit" size={16} color={colors.text.secondary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>
      </View>

      <View style={styles.headerBlock}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.meta}>
          {lesson.classGroup} · {lesson.grade} · {lesson.startTime}–
          {lesson.endTime}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Conteúdo</Text>
        <Text style={styles.contentBody}>{lesson.content}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Atividades</Text>
        <View style={styles.chipsWrap}>
          {lesson.activities.map((activity) => (
            <Badge
              key={activity.id}
              label={activity.label}
              variant={activity.color}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Conquistas trabalhadas</Text>
        <View style={styles.achievementsList}>
          {lesson.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementRow}>
              <Text style={styles.checkSymbol}>✓</Text>
              <Text style={styles.achievementText}>{achievement.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionsFooter}>
        {lesson.status === "concluida" ? (
          <Button
            title="Ver resumo pós-aula"
            variant="secondary"
            onPress={() => onViewSummary(lesson)}
          />
        ) : (
          <Button
            title={
              lesson.status === "em_andamento"
                ? "Continuar acompanhamento"
                : "Iniciar acompanhamento da aula"
            }
            onPress={() => onStartTracking(lesson)}
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  headerBlock: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: colors.text.primary,
  },
  meta: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  section: {
    gap: spacing.xs,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  contentBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.primary,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: 2,
  },
  achievementsList: {
    gap: 4,
    marginTop: 2,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkSymbol: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text.success,
  },
  achievementText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.success,
  },
  actionsFooter: {
    marginTop: spacing.xs,
  },
});
