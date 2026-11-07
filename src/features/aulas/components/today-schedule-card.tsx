import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui";
import { colors, spacing } from "@/theme";
import { LessonItem } from "../types/aulas.types";
import { LessonScheduleItem } from "./lesson-schedule-item";

export interface TodayScheduleCardProps {
  dateTitle: string;
  lessons: LessonItem[];
  selectedLessonId: string;
  onSelectLesson: (lesson: LessonItem) => void;
}

export function TodayScheduleCard({
  dateTitle,
  lessons,
  selectedLessonId,
  onSelectLesson,
}: TodayScheduleCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.dateTitle}>{dateTitle}</Text>

      {lessons.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Nenhuma aula planejada para este filtro.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {lessons.map((lesson) => (
            <LessonScheduleItem
              key={lesson.id}
              lesson={lesson}
              isSelected={lesson.id === selectedLessonId}
              onPress={onSelectLesson}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  dateTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
  },
  list: {
    gap: spacing.sm,
  },
  emptyBox: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
});
