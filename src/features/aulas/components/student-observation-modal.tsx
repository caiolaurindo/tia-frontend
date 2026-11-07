import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AvatarInitials, Button, Icon, IconName } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";
import {
  LessonAchievement,
  QuickObservationType,
  StudentLessonRecord,
} from "../types/aulas.types";

export interface StudentObservationModalProps {
  visible: boolean;
  student: StudentLessonRecord | null;
  lessonAchievements: LessonAchievement[];
  onClose: () => void;
  onSave: (payload: {
    observations: QuickObservationType[];
    note: string;
    achievedIds: string[];
  }) => void;
}

const OBSERVATION_PILLS: {
  type: QuickObservationType;
  label: string;
  icon: IconName;
  color: string;
  bg: string;
}[] = [
  {
    type: "participacao",
    label: "Participou oralmente",
    icon: "hand",
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    type: "atividade",
    label: "Realizou a atividade",
    icon: "check",
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  {
    type: "dificuldade",
    label: "Apresentou dificuldade",
    icon: "alert",
    color: "#DC2626",
    bg: "#FEE2E2",
  },
  {
    type: "conquista",
    label: "Demonstrou conquista",
    icon: "trophy",
    color: "#D97706",
    bg: "#FEF3C7",
  },
];

export function StudentObservationModal({
  visible,
  student,
  lessonAchievements,
  onClose,
  onSave,
}: StudentObservationModalProps) {
  const [observations, setObservations] = useState<QuickObservationType[]>([]);
  const [note, setNote] = useState("");
  const [achievedIds, setAchievedIds] = useState<string[]>([]);

  useEffect(() => {
    if (student) {
      setObservations(student.observations);
      setNote(student.note);
      setAchievedIds(student.achievedIds);
    }
  }, [student]);

  if (!student) return null;

  const toggleObs = (type: QuickObservationType) => {
    setObservations((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAchievement = (id: string) => {
    setAchievedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.studentTitleRow}>
              <AvatarInitials
                initials={student.initials}
                variant={student.avatarVariant}
                size={40}
              />
              <View>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentSub}>
                  Registro individual na aula
                </Text>
              </View>
            </View>

            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <Icon name="close" size={18} color={colors.text.secondary} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Marcações rápidas</Text>
            <View style={styles.pillsGrid}>
              {OBSERVATION_PILLS.map((pill) => {
                const isSelected = observations.includes(pill.type);
                return (
                  <Pressable
                    key={pill.type}
                    onPress={() => toggleObs(pill.type)}
                    style={[
                      styles.obsPill,
                      isSelected && {
                        backgroundColor: pill.bg,
                        borderColor: pill.color,
                      },
                    ]}
                  >
                    <Icon name={pill.icon} size={15} color={pill.color} />
                    <Text
                      style={[
                        styles.obsPillText,
                        isSelected && { color: pill.color, fontWeight: "700" },
                      ]}
                    >
                      {pill.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {lessonAchievements.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Conquistas demonstradas nesta aula
              </Text>
              <View style={styles.achList}>
                {lessonAchievements.map((ach) => {
                  const isChecked = achievedIds.includes(ach.id);
                  return (
                    <Pressable
                      key={ach.id}
                      onPress={() => toggleAchievement(ach.id)}
                      style={[
                        styles.achRow,
                        isChecked && styles.achRowSelected,
                      ]}
                    >
                      <Icon
                        name="check"
                        size={16}
                        color={
                          isChecked
                            ? colors.text.success
                            : colors.text.placeholder
                        }
                      />
                      <Text
                        style={[
                          styles.achText,
                          isChecked && styles.achTextSelected,
                        ]}
                      >
                        {ach.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observação pedagógica</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Ex.: Participou bem na entrevista em duplas, mas teve dúvida na pronúncia..."
              placeholderTextColor={colors.text.placeholder}
              multiline
              style={styles.textArea}
            />
          </View>

          <View style={styles.footerRow}>
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={onClose}
              style={styles.footerBtn}
            />
            <Button
              title="Salvar registro"
              onPress={() =>
                onSave({
                  observations,
                  note: note.trim(),
                  achievedIds,
                })
              }
              style={styles.footerBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  sheet: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.background.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  studentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text.primary,
  },
  studentSub: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.background.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  pillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  obsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  obsPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.primary,
  },
  achList: {
    gap: spacing.xs,
  },
  achRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  achRowSelected: {
    backgroundColor: colors.background.successRow,
    borderColor: colors.border.success,
  },
  achText: {
    fontSize: 13,
    color: colors.text.primary,
    flex: 1,
  },
  achTextSelected: {
    fontWeight: "600",
    color: colors.text.success,
  },
  textArea: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text.primary,
    textAlignVertical: "top",
    backgroundColor: colors.background.primary,
  },
  footerRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  footerBtn: {
    flex: 1,
  },
});
