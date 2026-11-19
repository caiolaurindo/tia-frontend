import React, { useState } from "react";
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
import { EditarPerfilInput } from "../types/configuracoes.types";

export interface EditarPerfilModalProps {
  visible: boolean;
  initialData: EditarPerfilInput;
  onClose: () => void;
  onSave: (data: EditarPerfilInput) => void;
}

interface EditarPerfilContentProps {
  initialData: EditarPerfilInput;
  onClose: () => void;
  onSave: (data: EditarPerfilInput) => void;
}

function EditarPerfilContent({
  initialData,
  onClose,
  onSave,
}: EditarPerfilContentProps) {
  const [nome, setNome] = useState(initialData.nome || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [escola, setEscola] = useState(initialData.escola || "");
  const [telefone, setTelefone] = useState(initialData.telefone || "");
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!nome.trim()) {
      setError("Informe seu nome completo.");
      return;
    }
    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }

    onSave({
      nome: nome.trim(),
      email: email.trim(),
      escola: escola.trim(),
      telefone: telefone.trim(),
    });
    onClose();
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.iconCircle}>
              <Icon name="user" size={18} color={colors.brand.primary} />
            </View>
            <Text style={styles.title}>Editar perfil</Text>
          </View>

          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <Icon name="close" size={18} color={colors.text.secondary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextField
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Carolina Silva"
            leftIcon="user"
          />

          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu.email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
          />

          <TextField
            label="Escola / Instituição de ensino"
            value={escola}
            onChangeText={setEscola}
            placeholder="Ex: Colégio Santa Maria"
            leftIcon="groups"
          />

          <TextField
            label="Telefone / Contato (opcional)"
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(81) 99999-9999"
            keyboardType="phone-pad"
          />
        </ScrollView>

        <View style={styles.actions}>
          <Button
            title="Cancelar"
            variant="secondary"
            onPress={onClose}
            style={styles.actionBtn}
          />
          <Button
            title="Salvar alterações"
            variant="primary"
            onPress={handleSave}
            style={styles.actionBtn}
          />
        </View>
      </View>
    </View>
  );
}

export function EditarPerfilModal({
  visible,
  initialData,
  onClose,
  onSave,
}: EditarPerfilModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {visible ? (
        <EditarPerfilContent
          initialData={initialData}
          onClose={onClose}
          onSave={onSave}
        />
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(3, 20, 94, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "90%",
    backgroundColor: colors.background.surface,
    borderRadius: radii.xxl,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.background.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorBanner: {
    backgroundColor: colors.background.dangerSoft,
    borderColor: colors.border.error,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  errorText: {
    fontSize: 13,
    color: colors.text.danger,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  actionBtn: {
    flex: 1,
  },
});
