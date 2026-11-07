import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { Badge, Button, Card, Icon, TextField } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";
import { useAulasContext } from "../context/aulas-context";
import { CLASS_GROUPS, SUGGESTED_ACHIEVEMENTS } from "../data/mock-aulas";
import { useLessonForm } from "../hooks/use-lesson-form";

export function AulaFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { lessons } = useAulasContext();

  const existingLesson = params.id
    ? lessons.find((item) => item.id === params.id)
    : undefined;

  const isEditing = Boolean(existingLesson);

  const {
    title,
    setTitle,
    groupIndex,
    setGroupIndex,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    content,
    setContent,
    newActivityText,
    setNewActivityText,
    activities,
    addActivity,
    removeActivity,
    selectedAchievements,
    toggleAchievement,
    errors,
    saveLesson,
  } = useLessonForm(existingLesson);

  const handleSave = () => {
    const saved = saveLesson();
    if (saved) {
      router.replace("/aulas");
    }
  };

  return (
    <AppShell
      title={isEditing ? "Editar aula" : "Nova aula"}
      onBackPress={() => router.back()}
      onLogoPress={() => router.push("/aulas")}
      showBottomBar={false}
    >
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>1. Turma e horário</Text>

        <View style={styles.groupList}>
          {CLASS_GROUPS.map((group, idx) => {
            const isSelected = idx === groupIndex;
            return (
              <Pressable
                key={group.id}
                onPress={() => setGroupIndex(idx)}
                style={[
                  styles.groupChip,
                  isSelected && styles.groupChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.groupName,
                    isSelected && styles.groupTextSelected,
                  ]}
                >
                  {group.classGroup}
                </Text>
                <Text
                  style={[
                    styles.groupGrade,
                    isSelected && styles.groupTextSelected,
                  ]}
                >
                  {group.grade}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.timeRow}>
          <TextField
            label="Início"
            leftIcon="clock"
            placeholder="10:00"
            value={startTime}
            onChangeText={setStartTime}
            error={errors.startTime}
            containerStyle={styles.halfField}
          />
          <TextField
            label="Término"
            leftIcon="clock"
            placeholder="11:00"
            value={endTime}
            onChangeText={setEndTime}
            containerStyle={styles.halfField}
          />
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>2. Tema e conteúdo</Text>

        <TextField
          label="Título da aula"
          placeholder="Ex.: Daily routines & frequency"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <TextField
          label="Conteúdo trabalhado"
          placeholder="Ex.: Adverbs of frequency, daily routine vocabulary..."
          value={content}
          onChangeText={setContent}
          error={errors.content}
        />
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>3. Atividades planejadas</Text>

        <View style={styles.addActivityRow}>
          <TextInput
            value={newActivityText}
            onChangeText={setNewActivityText}
            placeholder="Adicionar atividade (ex.: Exit ticket)"
            placeholderTextColor={colors.text.placeholder}
            style={styles.activityInput}
            onSubmitEditing={addActivity}
          />
          <Pressable onPress={addActivity} style={styles.addChipBtn}>
            <Icon name="plus" size={18} color={colors.text.inverse} />
          </Pressable>
        </View>

        <View style={styles.chipsWrap}>
          {activities.map((act) => (
            <Pressable
              key={act.id}
              onPress={() => removeActivity(act.id)}
              style={styles.removableChip}
            >
              <Badge label={`${act.label}  ×`} variant={act.color} />
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>4. Conquistas trabalhadas</Text>
        <Text style={styles.helperText}>
          Selecione as conquistas de aprendizagem que serão observadas nesta aula:
        </Text>

        <View style={styles.achievementsList}>
          {SUGGESTED_ACHIEVEMENTS.map((achTitle) => {
            const isSelected = selectedAchievements.includes(achTitle);
            return (
              <Pressable
                key={achTitle}
                onPress={() => toggleAchievement(achTitle)}
                style={[
                  styles.achievementItem,
                  isSelected && styles.achievementItemSelected,
                ]}
              >
                <Icon
                  name="check"
                  size={16}
                  color={
                    isSelected ? colors.text.success : colors.text.placeholder
                  }
                />
                <Text
                  style={[
                    styles.achievementLabel,
                    isSelected && styles.achievementLabelSelected,
                  ]}
                >
                  {achTitle}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <View style={styles.footerButtons}>
        <Button
          title="Cancelar"
          variant="secondary"
          onPress={() => router.back()}
          style={styles.flexBtn}
        />
        <Button
          title={isEditing ? "Salvar alterações" : "Planejar aula"}
          onPress={handleSave}
          style={styles.flexBtn}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text.primary,
  },
  helperText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: -6,
  },
  groupList: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  groupChip: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
    alignItems: "center",
    gap: 2,
  },
  groupChipSelected: {
    backgroundColor: colors.brand.primarySoft,
    borderColor: colors.brand.primary,
  },
  groupName: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
  },
  groupGrade: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text.secondary,
  },
  groupTextSelected: {
    color: colors.brand.primary,
  },
  timeRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfField: {
    flex: 1,
  },
  addActivityRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  activityInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  addChipBtn: {
    width: 46,
    height: 46,
    borderRadius: radii.xl,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  removableChip: {
    alignSelf: "flex-start",
  },
  achievementsList: {
    gap: spacing.xs,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  achievementItemSelected: {
    backgroundColor: colors.background.successRow,
    borderColor: colors.border.success,
  },
  achievementLabel: {
    fontSize: 13,
    color: colors.text.primary,
    flex: 1,
  },
  achievementLabelSelected: {
    fontWeight: "700",
    color: colors.text.success,
  },
  footerButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  flexBtn: {
    flex: 1,
  },
});
