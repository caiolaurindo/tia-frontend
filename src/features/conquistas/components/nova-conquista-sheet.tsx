import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme";
import { CATEGORIAS, CATEGORIA_LABEL } from "../data/conquistas-options";
import { useNovaConquistaForm } from "../hooks/use-nova-conquista-form";
import { NovaConquistaInput } from "../types/conquistas.types";
import { ConquistaChip } from "./conquista-chip";

export interface NovaConquistaSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (input: NovaConquistaInput) => void;
}

export function NovaConquistaSheet({
  visible,
  onClose,
  onSave,
}: NovaConquistaSheetProps) {
  const insets = useSafeAreaInsets();
  const form = useNovaConquistaForm(onSave);

  useEffect(() => {
    if (!visible) form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Fechar"
        />

        <View
          style={[styles.sheet, { paddingBottom: spacing.lg + insets.bottom }]}
          accessibilityViewIsModal
        >
          <View style={styles.grab} />
          <Text style={styles.title} accessibilityRole="header">
            Nova conquista
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>O que o aluno vai conseguir fazer?</Text>
            <TextInput
              value={form.nome}
              onChangeText={form.setNome}
              placeholder="Ex.: Pedir ajuda em inglês"
              placeholderTextColor={colors.text.placeholder}
              maxLength={150}
              autoFocus
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Habilidade</Text>
            <View style={styles.chips}>
              {CATEGORIAS.map((key) => (
                <ConquistaChip
                  key={key}
                  label={CATEGORIA_LABEL[key]}
                  selected={form.categoria === key}
                  onPress={() => form.setCategoria(key)}
                />
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Nível <Text style={styles.optional}>(opcional)</Text>
            </Text>
            <TextInput
              value={form.nivel}
              onChangeText={form.setNivel}
              placeholder="A1"
              placeholderTextColor={colors.text.placeholder}
              maxLength={10}
              autoCapitalize="characters"
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={form.submit}
            disabled={!form.valido}
            accessibilityRole="button"
            accessibilityState={{ disabled: !form.valido }}
            style={[styles.save, !form.valido && styles.saveDisabled]}
          >
            <Text style={styles.saveText}>Salvar conquista</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  sheet: {
    backgroundColor: colors.background.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: spacing.lg + 4,
    paddingTop: 10,
  },
  grab: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.border.default,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 14,
  },
  field: { marginBottom: spacing.lg },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  optional: { fontWeight: "500", color: colors.text.secondary },
  input: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text.primary,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  save: {
    alignItems: "center",
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 14,
  },
  saveDisabled: { opacity: 0.45 },
  saveText: { fontSize: 15, fontWeight: "700", color: colors.text.inverse },
});
