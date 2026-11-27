import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { Badge, Button, Card, Icon, TextField } from "@/components/ui";
import { useConquistasContext } from "@/features/conquistas";
import { colors, radii, spacing } from "@/theme";
import { useAulasContext } from "../context/aulas-context";
import { useLessonForm } from "../hooks/use-lesson-form";

export function AulaFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; turmaId?: string }>();
  const { lessons } = useAulasContext();
  const { conquistas } = useConquistasContext();

  const existingLesson = params.id
    ? lessons.find((item) => item.id === params.id)
    : undefined;

  const isEditing = Boolean(existingLesson);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    turmas,
    title,
    setTitle,
    groupIndex,
    setGroupIndex,
    dateInput,
    setDateInput,
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
    isSaving,
    saveLesson,
    removeLesson,
  } = useLessonForm(existingLesson, params.turmaId, conquistas);

  const activeConquistas = conquistas.filter((c) => c.ativa);

  const handleSave = async () => {
    setSubmitError(null);
    try {
      const saved = await saveLesson();
      if (saved) {
        router.replace("/aulas");
      }
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar a aula.";
      setSubmitError(mensagem);
      if (Platform.OS !== "web") {
        Alert.alert("Erro ao salvar", mensagem);
      }
    }
  };

  const handleDelete = async () => {
    setSubmitError(null);

    const executarExclusao = async () => {
      try {
        const removed = await removeLesson();
        if (removed) {
          router.replace("/aulas");
        }
      } catch (erro) {
        const mensagem =
          erro instanceof Error
            ? erro.message
            : "Não foi possível excluir a aula.";
        setSubmitError(mensagem);
        if (Platform.OS !== "web") {
          Alert.alert("Erro ao excluir", mensagem);
        }
      }
    };

    if (Platform.OS === "web") {
      await executarExclusao();
      return;
    }

    Alert.alert("Excluir aula", "Deseja realmente excluir esta aula?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => void executarExclusao(),
      },
    ]);
  };

  return (
    <AppShell
      title={isEditing ? "Editar aula" : "Nova aula"}
      onBackPress={() => router.back()}
      onLogoPress={() => router.push("/aulas")}
      showBottomBar={false}
    >
      {submitError ? (
        <Text style={styles.errorText}>{submitError}</Text>
      ) : null}

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>1. Turma, data e horário</Text>

        {turmas.length === 0 ? (
          <Button
            title="Cadastrar minha primeira turma"
            variant="secondary"
            onPress={() => router.push("/turmas/nova")}
          />
        ) : (
          <View style={styles.groupList}>
            {turmas.map((turma, idx) => {
              const isSelected = idx === groupIndex;
              return (
                <Pressable
                  key={turma.id}
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
                    {turma.nome}
                  </Text>
                  <Text
                    style={[
                      styles.groupGrade,
                      isSelected && styles.groupTextSelected,
                    ]}
                  >
                    {turma.serie}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {errors.turma ? (
          <Text style={styles.errorText}>{errors.turma}</Text>
        ) : null}

        <TextField
          label="Data da aula (DD/MM/AAAA)"
          leftIcon="calendar"
          placeholder="20/11/2026"
          value={dateInput}
          onChangeText={setDateInput}
          error={errors.date}
        />

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
          {activeConquistas.map((conquista) => {
            const isSelected = selectedAchievements.includes(conquista.id);

            return (
              <Pressable
                key={conquista.id}
                onPress={() => toggleAchievement(conquista.id)}
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
                  {conquista.nome}
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
          title={
            isSaving
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Planejar aula"
          }
          onPress={() => void handleSave()}
          style={styles.flexBtn}
        />
      </View>

      {isEditing ? (
        <Button
          title={isSaving ? "Aguarde..." : "Excluir aula"}
          variant="ghost"
          onPress={() => void handleDelete()}
          disabled={isSaving}
        />
      ) : null}
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
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.danger,
  },
});
