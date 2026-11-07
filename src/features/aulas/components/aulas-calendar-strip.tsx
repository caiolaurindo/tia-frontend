import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@/theme";
import { CLASS_GROUPS, WEEK_DAYS } from "../data/mock-aulas";

export interface AulasCalendarStripProps {
  selectedDay: number;
  onSelectDay: (dayIndex: number) => void;
  classFilter: string;
  onSelectClassFilter: (classGroup: string) => void;
}

export function AulasCalendarStrip({
  selectedDay,
  onSelectDay,
  classFilter,
  onSelectClassFilter,
}: AulasCalendarStripProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.daysRow}>
        {WEEK_DAYS.map((day) => {
          const isSelected = day.index === selectedDay;
          return (
            <Pressable
              key={day.index}
              onPress={() => onSelectDay(day.index)}
              style={[styles.dayCard, isSelected && styles.dayCardActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[styles.dayShort, isSelected && styles.dayTextActive]}
              >
                {day.short}
              </Text>
              <Text
                style={[styles.dayNumber, isSelected && styles.dayTextActive]}
              >
                {day.dayNumber}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => onSelectClassFilter("todas")}
          style={[
            styles.filterChip,
            classFilter === "todas" && styles.filterChipActive,
          ]}
        >
          <Text
            style={[
              styles.filterChipText,
              classFilter === "todas" && styles.filterChipTextActive,
            ]}
          >
            Todas as turmas
          </Text>
        </Pressable>

        {CLASS_GROUPS.map((group) => {
          const isSelected = classFilter === group.classGroup;
          return (
            <Pressable
              key={group.id}
              onPress={() => onSelectClassFilter(group.classGroup)}
              style={[
                styles.filterChip,
                isSelected && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextActive,
                ]}
              >
                {group.grade}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  daysRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dayCard: {
    flex: 1,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.xl,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayCardActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  dayShort: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text.primary,
  },
  dayTextActive: {
    color: colors.text.inverse,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filterChipActive: {
    backgroundColor: colors.brand.primarySoft,
    borderColor: colors.brand.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.brand.primary,
  },
});
