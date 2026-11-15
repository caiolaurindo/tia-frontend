import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Icon, TextField } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";
import {
  AlunoItem,
  AlunoStatus,
  SaveAlunoInput,
} from "../types/alunos.types";

const STATUS_OPTIONS: { value: AlunoStatus; label: string }[] = [
  { value: "no_ritmo", label: "No ritmo" },
  { value: "destaque", label: "Destaque" },
  { value: "atencao", label: "Requer atenção" },
];

export interface AlunoFormModalProps {
  visible: boolean;
  initialAluno?: AlunoItem;
  onClose: () => void;
  onSave: (input: SaveAlunoInput) => void;
}

export function AlunoFormModal({
  visible,
  initialAluno,
  onClose,
  onSave,
}: AlunoFormModalProps) {
  const [name, setName] = useState("");
  const [turmaName, setTurmaName] = useState("");
  const [grade, setGrade] = useState("");
  const [ageText, setAgeText] = useState("12");
  const [guardianName, setGuardianName] = useState("");
  const [status, setStatus] = useState<AlunoStatus>("no_ritmo");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setName(initialAluno?.name ?? "");
    setTurmaName(initialAluno?.turmaName ?? "English Explorers");
    setGrade(initialAluno?.grade ?? "6º A");
    setAgeText(String(initialAluno?.age ?? 12));
    setGuardianName(initialAluno?.guardianName ?? "");
    setStatus(initialAluno?.status ?? "no_ritmo");
    setError(null);
  }, [initialAluno, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Informe o nome do aluno.");
      return;
    }
    if (!turmaName.trim()) {
      setError("Informe a turma.");
      return;
    }

    const parsedAge = Number(ageText);
    const age =
      Number.isFinite(parsedAge) && parsedAge > 0 ? Math.round(parsedAge) : 12;

    onSave({
      name: name.trim(),
      turmaName: turmaName.trim(),
      grade: grade.trim() || "6º A",
      age,
      guardianName: guardianName.trim() || "Não informado",
      status,
    });
    onClose();
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
            <Text style={styles.title}>
              {initialAluno ? "Editar aluno" : "Adicionar aluno"}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Icon name="close" size={20} color={colors.icon.default} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
          >
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextField
              label="Nome completo"
              placeholder="Ex.: Marina Oliveira"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) setError(null);
              }}
            />

            <View style={styles.row}>
              <TextField
                label="Turma"
                placeholder="English Explorers"
                value={turmaName}
                onChangeText={setTurmaName}
                containerStyle={styles.flexField}
              />
              <TextField
                label="Série"
                placeholder="6º A"
                value={grade}
                onChangeText={setGrade}
                containerStyle={styles.smallField}
              />
            </View>

            <View style={styles.row}>
              <TextField
                label="Idade"
                placeholder="12"
                keyboardType="numeric"
                value={ageText}
                onChangeText={setAgeText}
                containerStyle={styles.smallField}
              />
              <TextField
                label="Responsável"
                placeholder="Ex.: Juliana Oliveira"
                value={guardianName}
                onChangeText={setGuardianName}
                containerStyle={styles.flexField}
              />
            </View>

            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>Situação</Text>
              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((option) => {
                  const selected = status === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setStatus(option.value)}
                      style={[
                        styles.statusChip,
                        selected && styles.statusChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          selected && styles.statusChipTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={onClose}
              style={styles.footerBtn}
            />
            <Button
              title={initialAluno ? "Salvar" : "Adicionar"}
              onPress={handleSave}
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
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.background.surface,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    maxHeight: "88%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
  },
  form: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flexField: {
    flex: 1,
  },
  smallField: {
    width: 96,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.danger,
  },
  statusSection: {
    gap: spacing.xs,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  statusChipSelected: {
    backgroundColor: colors.brand.primaryLight,
    borderColor: colors.brand.primary,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  statusChipTextSelected: {
    color: colors.brand.primary,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  footerBtn: {
    flex: 1,
  },
});
