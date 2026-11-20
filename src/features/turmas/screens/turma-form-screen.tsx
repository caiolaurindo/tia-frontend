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
import { Button } from "@/components/ui";
import { colors, spacing, radii } from "@/theme";

import { useTurmasContext } from "../context/turmas-context";

const turnos = ["Manhã", "Tarde", "Noite"];

export function TurmaFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getTurmaById, createTurma, updateTurma } = useTurmasContext();

  const existingTurma = id ? getTurmaById(id) : undefined;
  const isEditing = Boolean(existingTurma);

  const [nome, setNome] = useState(existingTurma?.nome ?? "");
  const [serie, setSerie] = useState(existingTurma?.serie ?? "");
  const [anoLetivo, setAnoLetivo] = useState(
    existingTurma ? String(existingTurma.anoLetivo) : "2026"
  );
  const [faixaEtaria, setFaixaEtaria] = useState(
    existingTurma?.faixaEtaria ?? ""
  );
  const [turno, setTurno] = useState(existingTurma?.turno ?? "");
  const [descricao, setDescricao] = useState(existingTurma?.descricao ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function notifyError(title: string, message: string) {
    setFormError(message);
    if (Platform.OS !== "web") {
      Alert.alert(title, message);
    }
  }

  async function handleSave() {
    if (isSaving) return;
    setFormError(null);

    const ano = Number(anoLetivo);

    if (!nome.trim()) {
      notifyError("Atenção", "Informe o nome da turma.");
      return;
    }

    if (!serie.trim()) {
      notifyError("Atenção", "Informe a série da turma.");
      return;
    }

    if (
      !anoLetivo.trim() ||
      !Number.isInteger(ano) ||
      ano < 2000
    ) {
      notifyError("Atenção", "Informe um ano letivo válido.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        nome: nome.trim(),
        serie: serie.trim(),
        anoLetivo: ano,
        faixaEtaria: faixaEtaria.trim(),
        turno,
        descricao: descricao.trim(),
      };

      if (isEditing && existingTurma) {
        await updateTurma(existingTurma.id, payload);
      } else {
        await createTurma(payload);
      }

      if (Platform.OS === "web") {
        router.replace("/turmas");
      } else {
        Alert.alert(
          "Sucesso",
          isEditing
            ? "Turma atualizada com sucesso!"
            : "Turma cadastrada com sucesso!",
          [
            {
              text: "OK",
              onPress: () => router.replace("/turmas"),
            },
          ]
        );
      }
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar a turma.";

      notifyError("Erro ao salvar", mensagem);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell
      title={isEditing ? "Editar turma" : "Nova turma"}
      onBackPress={() => router.back()}
      activeTab="turmas"
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? "Editar turma" : "Cadastrar turma"}
        </Text>

        <Text style={styles.subtitle}>
          {isEditing
            ? "Atualize as informações desta turma."
            : "Preencha as informações para adicionar uma nova turma."}
        </Text>
      </View>

      {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome da turma</Text>

          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: Turma A"
            placeholderTextColor={colors.text.placeholder}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Série</Text>

          <TextInput
            value={serie}
            onChangeText={setSerie}
            placeholder="Ex.: 5º ano"
            placeholderTextColor={colors.text.placeholder}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ano letivo</Text>

          <TextInput
            value={anoLetivo}
            onChangeText={setAnoLetivo}
            placeholder="Ex.: 2026"
            placeholderTextColor={colors.text.placeholder}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Faixa etária</Text>

          <TextInput
            value={faixaEtaria}
            onChangeText={setFaixaEtaria}
            placeholder="Ex.: 10 a 11 anos"
            placeholderTextColor={colors.text.placeholder}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Turno</Text>

          <View style={styles.options}>
            {turnos.map((item) => {
              const selected = turno === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setTurno(item)}
                  style={[
                    styles.option,
                    styles.turnoOption,
                    selected && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição (opcional)</Text>

          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Adicione informações sobre a turma..."
            placeholderTextColor={colors.text.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title={
              isSaving
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Salvar turma"
            }
            onPress={() => void handleSave()}
          />

          <Button
            title="Cancelar"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.secondary,
  },

  form: {
    gap: spacing.xl,
  },

  field: {
    gap: spacing.sm,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.md,
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.text.primary,
  },

  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
  },

  turnoOption: {
    minWidth: 85,
    alignItems: "center",
  },

  optionSelected: {
    backgroundColor: colors.brand.primaryLight,
    borderColor: colors.brand.primary,
  },

  optionText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.secondary,
  },

  optionTextSelected: {
    color: colors.brand.primary,
    fontWeight: "700",
  },

  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.danger,
  },
});
