import React, { useCallback } from "react";
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
import { RegisterForm } from "../components/register-form";
import { useLoginForm } from "../hooks/use-login-form";
import { useRegisterForm } from "../hooks/use-register-form";
import { AuthMode } from "../types/auth.types";

const AUTH_TABS: SegmentedOption<AuthMode>[] = [
  { label: "Entrar", value: "login" },
  { label: "Criar conta", value: "register" },
];

export interface LoginScreenProps {
  initialMode?: AuthMode;
}

export function LoginScreen({ initialMode = "login" }: LoginScreenProps) {
  const loginForm = useLoginForm({ initialMode });
  const registerForm = useRegisterForm();

  const { mode, handleModeChange } = loginForm;
  const { resetErrors: resetRegisterErrors } = registerForm;

  const onTabChange = useCallback(
    (nextMode: AuthMode) => {
      handleModeChange(nextMode);
      resetRegisterErrors();
    },
    [handleModeChange, resetRegisterErrors]
  );

  const isLogin = mode === "login";

  return (
    <ScreenContainer>
      <AuthHeader
        title={isLogin ? "Bem-vinda de volta!" : "Crie sua conta"}
        subtitle={
          isLogin
            ? "Registre cada avanço e acompanhe seus alunos de perto."
            : "Comece a organizar suas turmas e acompanhar o desenvolvimento dos seus alunos."
        }
      />

      <SegmentedControl
        options={AUTH_TABS}
        value={mode}
        onChange={onTabChange}
        style={styles.segmentedControl}
      />

      {isLogin ? (
        <LoginForm
          email={loginForm.email}
          password={loginForm.password}
          errors={loginForm.errors}
          isSubmitting={loginForm.isSubmitting}
          onEmailChange={loginForm.handleEmailChange}
          onPasswordChange={loginForm.handlePasswordChange}
          onForgotPasswordPress={loginForm.handleForgotPassword}
          onSubmit={loginForm.handleSubmit}
        />
      ) : (
        <RegisterForm
          name={registerForm.name}
          email={registerForm.email}
          password={registerForm.password}
          confirmPassword={registerForm.confirmPassword}
          errors={registerForm.errors}
          isSubmitting={registerForm.isSubmitting}
          onNameChange={registerForm.handleNameChange}
          onEmailChange={registerForm.handleEmailChange}
          onPasswordChange={registerForm.handlePasswordChange}
          onConfirmPasswordChange={registerForm.handleConfirmPasswordChange}
          onSubmit={registerForm.handleSubmit}
        />
      )}

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
