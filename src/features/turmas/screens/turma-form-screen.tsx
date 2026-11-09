
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui";
import { colors, spacing, radii } from "@/theme";

import { useTurmasContext } from "../context/turmas-context";

const etapas = [
  "Educação Infantil",
  "Ensino Fundamental",
  "Ensino Médio",
];

const turnos = ["Manhã", "Tarde", "Noite"];

export function TurmaFormScreen() {
  const router = useRouter();
  const { createTurma } = useTurmasContext();

  const [nome, setNome] = useState("");
  const [etapa, setEtapa] = useState("");
  const [turno, setTurno] = useState("");
  const [quantidadeAlunos, setQuantidadeAlunos] = useState("");

  function handleSave() {
    const quantidade = Number(quantidadeAlunos);

    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome da turma.");
      return;
    }

    if (!etapa) {
      Alert.alert("Atenção", "Selecione a etapa de ensino.");
      return;
    }

    if (!turno) {
      Alert.alert("Atenção", "Selecione o turno.");
      return;
    }

    if (
      !quantidadeAlunos.trim() ||
      !Number.isInteger(quantidade) ||
      quantidade <= 0
    ) {
      Alert.alert(
        "Atenção",
        "Informe uma quantidade de alunos válida."
      );
      return;
    }

    createTurma({
      nome: nome.trim(),
      etapa,
      turno,
      quantidadeAlunos: quantidade,
    });

    Alert.alert("Sucesso", "Turma cadastrada com sucesso!", [
      {
        text: "OK",
        onPress: () => router.replace("/turmas"),
      },
    ]);
  }

  return (
    <AppShell title="Nova turma" activeTab="turmas">
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar turma</Text>
        <Text style={styles.subtitle}>
          Preencha as informações para adicionar uma nova turma.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome da turma</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: Turma 1º Ano A"
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
          <Text style={styles.label}>Quantidade de alunos</Text>
          <TextInput
            value={quantidadeAlunos}
            onChangeText={setQuantidadeAlunos}
            placeholder="Ex.: 25"
            placeholderTextColor={colors.text.placeholder}
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Salvar turma"
            onPress={handleSave}
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
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.md,
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.text.primary,
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
});
