import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui";
import { colors, radii, spacing, TagColorVariant } from "@/theme";
import { LessonItem, LessonStatus } from "../types/aulas.types";

export interface LessonScheduleItemProps {
  lesson: LessonItem;
  isSelected?: boolean;
  onPress: (lesson: LessonItem) => void;
}

const STATUS_CONFIG: Record<
  LessonStatus,
  { label: string; variant: TagColorVariant }
> = {
  proxima: { label: "Próxima", variant: "blue" },
  planejada: { label: "Planejada", variant: "slate" },
  em_andamento: { label: "Ao vivo", variant: "green" },
  concluida: { label: "Concluída", variant: "green" },
};

export function LessonScheduleItem({
  lesson,
  isSelected = false,
  onPress,
}: LessonScheduleItemProps) {
  const statusInfo = STATUS_CONFIG[lesson.status];

  return (
    <Pressable
      onPress={() => onPress(lesson)}
      style={({ pressed }) => [
        styles.row,
        isSelected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={styles.timeText}>{lesson.startTime}</Text>

      <View style={styles.infoColumn}>
        <Text style={styles.titleText} numberOfLines={1}>
          {lesson.title}
        </Text>
        <Text style={styles.metaText} numberOfLines={1}>
          {lesson.classGroup} · {lesson.grade}
        </Text>
      </View>

      <Badge label={statusInfo.label} variant={statusInfo.variant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  rowSelected: {
    borderColor: colors.brand.primaryLight,
    backgroundColor: "#F4F8FF",
  },
  rowPressed: {
    opacity: 0.85,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.brand.primary,
    minWidth: 42,
  },
  infoColumn: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
