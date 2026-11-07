import React from "react";
import { StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/layout";
import {
  InfoBanner,
  SegmentedControl,
  SegmentedOption,
} from "@/components/ui";
import { spacing } from "@/theme";
import { AuthHeader } from "../components/auth-header";
import { LoginForm } from "../components/login-form";
import { useLoginForm } from "../hooks/use-login-form";
import { AuthMode } from "../types/auth.types";

const AUTH_TABS: SegmentedOption<AuthMode>[] = [
  { label: "Entrar", value: "login" },
  { label: "Criar conta", value: "register" },
];

export function LoginScreen() {
  const {
    mode,
    email,
    password,
    errors,
    isSubmitting,
    handleModeChange,
    handleEmailChange,
    handlePasswordChange,
    handleForgotPassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <ScreenContainer>
      <AuthHeader
        title="Bem-vinda de volta!"
        subtitle="Registre cada avanço e acompanhe seus alunos de perto."
      />

      <SegmentedControl
        options={AUTH_TABS}
        value={mode}
        onChange={handleModeChange}
        style={styles.segmentedControl}
      />

      <LoginForm
        email={email}
        password={password}
        errors={errors}
        isSubmitting={isSubmitting}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onForgotPasswordPress={handleForgotPassword}
        onSubmit={handleSubmit}
      />

      <InfoBanner
        message="Menos tempo organizando. Mais tempo ensinando."
        style={styles.banner}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  banner: {
    marginTop: spacing.xxl,
  },
});
