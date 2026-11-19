import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Href, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui";
import { useAuth } from "@/contexts";
import { colors, spacing } from "@/theme";

import { AlterarSenhaModal } from "../components/alterar-senha-modal";
import { ConfigActionRow } from "../components/config-action-row";
import { ConfigSectionCard } from "../components/config-section-card";
import { ConfigSwitchRow } from "../components/config-switch-row";
import { EditarPerfilModal } from "../components/editar-perfil-modal";
import { PerfilHeaderCard } from "../components/perfil-header-card";
import {
  ConfiguracoesPreferencias,
  EditarPerfilInput,
} from "../types/configuracoes.types";

export function ConfiguracoesScreen() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Preferências locais do docente
  const [preferencias, setPreferencias] = useState<ConfiguracoesPreferencias>({
    lembreteDiario: true,
    alertaSemRegistro7Dias: true,
    transcricaoAutomatica: true,
    notificacoesPush: true,
    somAoRegistrar: false,
  });

  const updatePreferencia = (
    key: keyof ConfiguracoesPreferencias,
    val: boolean
  ) => {
    setPreferencias((prev) => ({ ...prev, [key]: val }));
  };

  const handleSavePerfil = (data: EditarPerfilInput) => {
    updateProfile({
      nome: data.nome,
      email: data.email,
      escola: data.escola,
      telefone: data.telefone,
    });

    if (Platform.OS === "web") {
      window.alert("Perfil atualizado com sucesso!");
    } else {
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    }
  };

  const handleLogout = () => {
    const doLogout = async () => {
      try {
        setIsLoggingOut(true);
        await signOut();
        router.replace("/(auth)/login" as Href);
      } catch {
        Alert.alert("Erro", "Ocorreu um erro ao sair. Tente novamente.");
      } finally {
        setIsLoggingOut(false);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Deseja realmente sair da sua conta no TIA?")) {
        void doLogout();
      }
    } else {
      Alert.alert(
        "Sair da conta",
        "Tem certeza que deseja desconectar do TIA?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sair",
            style: "destructive",
            onPress: () => {
              void doLogout();
            },
          },
        ]
      );
    }
  };

  const handleShowAbout = () => {
    const msg =
      "TIA (Teaching Intelligent Assistant)\nVersão 1.0.0 (Build 2026.11)\n\nProjeto Integrador IV — UNICAP\nPlataforma de acompanhamento pedagógico para professores de língua inglesa.";
    if (Platform.OS === "web") {
      window.alert(msg);
    } else {
      Alert.alert("Sobre o TIA", msg);
    }
  };

  const handleShowPrivacy = () => {
    const msg =
      "Os registros pedagógicos e dados de alunos são protegidos conforme as diretrizes da LGPD e os princípios pedagógicos da instituição.";
    if (Platform.OS === "web") {
      window.alert(msg);
    } else {
      Alert.alert("Privacidade & Proteção de Dados", msg);
    }
  };

  const handleShowHelp = () => {
    const msg =
      "Para dúvidas pedagógicas ou problemas técnicos, envie uma mensagem para o suporte da equipe TIA pelo e-mail: suporte@tia-edu.com.br";
    if (Platform.OS === "web") {
      window.alert(msg);
    } else {
      Alert.alert("Central de Ajuda & Suporte", msg);
    }
  };

  const professorNome = user?.nome || "Professora Carolina";
  const professorEmail = user?.email || "carolina.docente@escola.com";
  const professorEscola = user?.escola || "Colégio Santa Maria";

  return (
    <AppShell
      title="Configurações"
      showSettings={false}
      onBackPress={() => router.back()}
      contentContainerStyle={styles.container}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>Configurações e Perfil</Text>
        <Text style={styles.pageSubtitle}>
          Gerencie sua conta docente, preferências de registro e segurança.
        </Text>
      </View>

      {/* Cartão de Identificação do Perfil */}
      <PerfilHeaderCard
        nome={professorNome}
        email={professorEmail}
        escola={professorEscola}
        onEditPress={() => setIsEditProfileOpen(true)}
      />

      {/* Seção: Preferências Pedagógicas e de Registro */}
      <ConfigSectionCard
        title="Preferências de Registro Pedagógico"
        subtitle="Ajuste como as observações e alertas são acionados"
      >
        <ConfigSwitchRow
          icon="clock"
          iconBg={colors.tags.blue.bg}
          iconColor={colors.tags.blue.text}
          title="Lembretes diários de aula"
          description="Receba avisos para registrar o fechamento das aulas."
          value={preferencias.lembreteDiario}
          onValueChange={(val) => updatePreferencia("lembreteDiario", val)}
        />

        <ConfigSwitchRow
          icon="alert"
          iconBg={colors.tags.amber.bg}
          iconColor={colors.tags.amber.text}
          title="Alerta de atenção a alunos"
          description="Notificar caso um aluno passe 7 dias sem novas anotações."
          value={preferencias.alertaSemRegistro7Dias}
          onValueChange={(val) =>
            updatePreferencia("alertaSemRegistro7Dias", val)
          }
        />

        <ConfigSwitchRow
          icon="sparkles"
          iconBg={colors.tags.purple.bg}
          iconColor={colors.tags.purple.text}
          title="Transcrição de áudio automática"
          description="Processar transcrição inteligente logo após finalizar a gravação."
          value={preferencias.transcricaoAutomatica}
          onValueChange={(val) =>
            updatePreferencia("transcricaoAutomatica", val)
          }
          showDivider={false}
        />
      </ConfigSectionCard>

      {/* Seção: Notificações do Sistema */}
      <ConfigSectionCard
        title="Notificações"
        subtitle="Controle a forma como você recebe alertas"
      >
        <ConfigSwitchRow
          icon="bell"
          iconBg={colors.brand.primaryLight}
          iconColor={colors.brand.primary}
          title="Notificações push"
          description="Alertas no aparelho sobre horários e novidades de turmas."
          value={preferencias.notificacoesPush}
          onValueChange={(val) => updatePreferencia("notificacoesPush", val)}
          showDivider={false}
        />
      </ConfigSectionCard>

      {/* Seção: Segurança & Acesso */}
      <ConfigSectionCard
        title="Segurança & Conta"
        subtitle="Mantenha seus dados e credenciais protegidos"
      >
        <ConfigActionRow
          icon="lock"
          iconBg={colors.tags.navy.bg}
          iconColor={colors.brand.navy}
          title="Alterar senha"
          subtitle="Trocar sua senha de acesso ao aplicativo"
          onPress={() => setIsChangePasswordOpen(true)}
        />

        <ConfigActionRow
          icon="user"
          iconBg={colors.tags.blue.bg}
          iconColor={colors.brand.primary}
          title="Editar dados cadastrais"
          subtitle="Nome, e-mail institucional e telefone"
          onPress={() => setIsEditProfileOpen(true)}
          showDivider={false}
        />
      </ConfigSectionCard>

      {/* Seção: Sobre e Suporte */}
      <ConfigSectionCard title="Aplicativo & Apoio">
        <ConfigActionRow
          icon="info"
          iconBg={colors.background.subtle}
          iconColor={colors.icon.default}
          title="Sobre o TIA"
          valueLabel="v1.0.0"
          onPress={handleShowAbout}
        />

        <ConfigActionRow
          icon="shield"
          iconBg={colors.tags.green.bg}
          iconColor={colors.tags.green.text}
          title="Privacidade & LGPD pedagógica"
          subtitle="Como os dados dos seus alunos são protegidos"
          onPress={handleShowPrivacy}
        />

        <ConfigActionRow
          icon="mail"
          iconBg={colors.background.subtle}
          iconColor={colors.icon.default}
          title="Ajuda e Suporte docente"
          subtitle="Fale com nossa equipe técnica e pedagógica"
          onPress={handleShowHelp}
          showDivider={false}
        />
      </ConfigSectionCard>

      {/* Ação de Logout */}
      <View style={styles.logoutWrapper}>
        <Button
          title="Sair da conta"
          variant="danger"
          leftIcon="logout"
          isLoading={isLoggingOut}
          onPress={handleLogout}
        />
        <Text style={styles.logoutHint}>
          Ao sair, você precisará informar suas credenciais para acessar novamente.
        </Text>
      </View>

      {/* Modal: Editar Perfil */}
      <EditarPerfilModal
        visible={isEditProfileOpen}
        initialData={{
          nome: professorNome,
          email: professorEmail,
          escola: professorEscola,
          telefone: user?.telefone || "",
        }}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSavePerfil}
      />

      {/* Modal: Alterar Senha */}
      <AlterarSenhaModal
        visible={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          // Callback após atualizar senha
        }}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.xl,
    paddingBottom: spacing.section,
  },
  headerBlock: {
    gap: spacing.xs,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  logoutWrapper: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  logoutHint: {
    fontSize: 12,
    color: colors.text.placeholder,
    textAlign: "center",
  },
});
