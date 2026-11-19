import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Icon, TextField } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";

export interface AlterarSenhaModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AlterarSenhaModal({
  visible,
  onClose,
  onSuccess,
}: AlterarSenhaModalProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSalvar = async () => {
    if (!senhaAtual) {
      setError("Informe sua senha atual.");
      return;
    }
    if (novaSenha.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError("A confirmação de senha não coincide com a nova senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Simulação de alteração ou chamada para o endpoint de senha
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      if (Platform.OS === "web") {
        window.alert("Senha atualizada com sucesso!");
      } else {
        Alert.alert("Sucesso", "Sua senha foi atualizada com sucesso!");
      }

      onSuccess();
      onClose();
    } catch {
      setError("Não foi possível atualizar sua senha. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Icon name="lock" size={18} color={colors.brand.primary} />
              </View>
              <Text style={styles.title}>Alterar senha</Text>
            </View>

            <Pressable
              onPress={handleClose}
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
              label="Senha atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              placeholder="Digite sua senha atual"
              isPassword
              leftIcon="lock"
            />

            <TextField
              label="Nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="Mínimo de 6 caracteres"
              isPassword
              leftIcon="lock"
            />

            <TextField
              label="Confirmar nova senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Repita a nova senha"
              isPassword
              leftIcon="lock"
            />
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={handleClose}
              style={styles.actionBtn}
            />
            <Button
              title="Atualizar senha"
              variant="primary"
              isLoading={isSubmitting}
              onPress={handleSalvar}
              style={styles.actionBtn}
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
