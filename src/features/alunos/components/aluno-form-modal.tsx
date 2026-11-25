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
import { useTurmasContext } from "@/features/turmas/context/turmas-context";
import { colors, radii, spacing } from "@/theme";
import {
  AlunoItem,
  AlunoStatus,
  SaveAlunoInput,
} from "../types/alunos.types";
import { brParaIso, isoParaBr } from "../utils/aluno-mappers";

const STATUS_OPTIONS: { value: AlunoStatus; label: string }[] = [
  { value: "no_ritmo", label: "No ritmo" },
  { value: "destaque", label: "Destaque" },
  { value: "atencao", label: "Requer atenção" },
];

export interface AlunoFormModalProps {
  visible: boolean;
  initialAluno?: AlunoItem;
  onClose: () => void;
  onSave: (input: SaveAlunoInput) => Promise<unknown> | void;
}

export function AlunoFormModal({
  visible,
  initialAluno,
  onClose,
  onSave,
}: AlunoFormModalProps) {
  const { turmas } = useTurmasContext();
  const turmasAtivas = turmas.filter((t) => t.status === "ativa");

  const [name, setName] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [birthText, setBirthText] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [status, setStatus] = useState<AlunoStatus>("no_ritmo");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setName(initialAluno?.name ?? "");
    setTurmaId(initialAluno?.turmaId ?? "");
    setBirthText(initialAluno ? isoParaBr(initialAluno.birthDate) : "");
    setGuardianName(
      initialAluno && initialAluno.guardianName !== "Não informado"
        ? initialAluno.guardianName
        : ""
    );
    setStatus(initialAluno?.status ?? "no_ritmo");
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialAluno, visible]);

  // Sem turma escolhida, assume a primeira ativa assim que as turmas carregarem.
  const turmaSelecionada = turmaId || turmasAtivas[0]?.id || "";

  const handleSave = async () => {
    if (isSaving) return;
    if (!name.trim() || name.trim().length < 2) {
      setError("Informe o nome do aluno (mínimo 2 caracteres).");
      return;
    }
    if (!turmaSelecionada) {
      setError("Selecione a turma.");
      return;
    }
    const birthDate = brParaIso(birthText);
    if (!birthDate) {
      setError("Informe uma data de nascimento válida (DD/MM/AAAA).");
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        name: name.trim(),
        turmaId: turmaSelecionada,
        birthDate,
        guardianName: guardianName.trim(),
        status,
      });
      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível salvar o aluno."
      );
    } finally {
      setIsSaving(false);
    }
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

            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>Turma</Text>
              {turmasAtivas.length === 0 ? (
                <Text style={styles.errorText}>
                  Cadastre uma turma antes de adicionar alunos.
                </Text>
              ) : (
                <View style={styles.statusRow}>
                  {turmasAtivas.map((turma) => {
                        const selected = turmaSelecionada === turma.id;
                    return (
                      <Pressable
                        key={turma.id}
                        onPress={() => setTurmaId(turma.id)}
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
                          {turma.nome}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.row}>
              <TextField
                label="Nascimento"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={birthText}
                onChangeText={setBirthText}
                containerStyle={styles.dateField}
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
              title={
                isSaving ? "Salvando..." : initialAluno ? "Salvar" : "Adicionar"
              }
              onPress={() => void handleSave()}
              disabled={isSaving}
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
  dateField: {
    width: 140,
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
