
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

const turnos = ["Manhã", "Tarde", "Noite"];

export function TurmaFormScreen() {
  const router = useRouter();
  const { createTurma } = useTurmasContext();

  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");
  const [anoLetivo, setAnoLetivo] = useState("2026");
  const [faixaEtaria, setFaixaEtaria] = useState("");
  const [turno, setTurno] = useState("");
  const [descricao, setDescricao] = useState("");

  function handleSave() {
    const ano = Number(anoLetivo);

    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome da turma.");
      return;
    }

    if (!serie.trim()) {
      Alert.alert("Atenção", "Informe a série da turma.");
      return;
    }

    if (
      !anoLetivo.trim() ||
      !Number.isInteger(ano) ||
      ano < 2000
    ) {
      Alert.alert("Atenção", "Informe um ano letivo válido.");
      return;
    }

    if (!faixaEtaria.trim()) {
      Alert.alert("Atenção", "Informe a faixa etária.");
      return;
    }

    if (!turno) {
      Alert.alert("Atenção", "Selecione o turno.");
      return;
    }

    createTurma({
      nome: nome.trim(),
      serie: serie.trim(),
      anoLetivo: ano,
      faixaEtaria: faixaEtaria.trim(),
      turno,
      descricao: descricao.trim(),
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
});
