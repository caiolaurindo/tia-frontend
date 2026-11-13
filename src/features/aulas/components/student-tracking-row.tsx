import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AvatarInitials, Icon, IconName } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";
import {
  QuickObservationType,
  StudentLessonRecord,
} from "../types/aulas.types";

export interface StudentTrackingRowProps {
  student: StudentLessonRecord;
  onToggleObservation: (
    studentId: string,
    type: QuickObservationType
  ) => void;
  onPressStudent: (studentId: string) => void;
}

interface QuickActionConfig {
  type: QuickObservationType;
  icon: IconName;
  label: string;
  tint: string;
  activeBg: string;
  activeBorder: string;
}

const QUICK_ACTIONS: QuickActionConfig[] = [
  {
    type: "participacao",
    icon: "hand",
    label: "Participação",
    tint: colors.brand.primary,
    activeBg: "#E3ECFF",
    activeBorder: "#9BB8FF",
  },
  {
    type: "atividade",
    icon: "check",
    label: "Atividade realizada",
    tint: "#16A34A",
    activeBg: "#DCFCE7",
    activeBorder: "#86EFAC",
  },
  {
    type: "dificuldade",
    icon: "alert",
    label: "Dificuldade",
    tint: colors.text.danger,
    activeBg: "#FFE8E7",
    activeBorder: "#FE6D67",
  },
  {
    type: "conquista",
    icon: "trophy",
    label: "Conquista",
    tint: "#B47A00",
    activeBg: "#FFF4D6",
    activeBorder: colors.brand.yellow,
  },
];

export function StudentTrackingRow({
  student,
  onToggleObservation,
  onPressStudent,
}: StudentTrackingRowProps) {
  const isRegistered =
    student.observations.length > 0 || student.note.trim().length > 0;

  return (
    <View
      style={[
        styles.rowContainer,
        isRegistered && styles.rowContainerRegistered,
      ]}
    >
      <Pressable
        onPress={() => onPressStudent(student.studentId)}
        style={styles.studentInfo}
        accessibilityRole="button"
        accessibilityLabel={`Abrir ficha de ${student.name}`}
      >
        <AvatarInitials
          initials={student.initials}
          variant={isRegistered ? "green" : student.avatarVariant}
          size={34}
        />

        <View style={styles.nameColumn}>
          <Text style={styles.nameText} numberOfLines={1}>
            {student.name}
          </Text>
          {student.note ? (
            <Text style={styles.notePreview} numberOfLines={1}>
              {student.note}
            </Text>
          ) : null}
        </View>
      </Pressable>

      <View style={styles.actionsGroup}>
        {QUICK_ACTIONS.map((action) => {
          const isSelected = student.observations.includes(action.type);

          return (
            <Pressable
              key={action.type}
              onPress={() =>
                onToggleObservation(student.studentId, action.type)
              }
              style={[
                styles.iconBox,
                isSelected && {
                  backgroundColor: action.activeBg,
                  borderColor: action.activeBorder,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${action.label} - ${student.name}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Icon name={action.icon} size={15} color={action.tint} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.primary,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  rowContainerRegistered: {
    backgroundColor: colors.background.successRow,
    borderColor: colors.border.success,
  },
  studentInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  nameColumn: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  notePreview: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 1,
  },
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
});
