import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextField } from "@/components/ui";
import { spacing } from "@/theme";
import { LoginFormErrors } from "../types/auth.types";

export interface LoginFormProps {
  email: string;
  password: string;
  errors?: LoginFormErrors;
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onForgotPasswordPress: () => void;
  onSubmit: () => void;
}

export function LoginForm({
  email,
  password,
  errors,
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onForgotPasswordPress,
  onSubmit,
}: LoginFormProps) {
  return (
    <View style={styles.form}>
      <TextField
        label="E-mail"
        leftIcon="mail"
        placeholder="carolina@escola.com.br"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        returnKeyType="next"
        error={errors?.email}
      />

      <TextField
        label="Senha"
        leftIcon="lock"
        placeholder="••••••••••••"
        value={password}
        onChangeText={onPasswordChange}
        isPassword
        rightActionLabel="Esqueci minha senha"
        onRightActionPress={onForgotPasswordPress}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        error={errors?.password}
      />

      <Button
        title="Entrar na TIA"
        onPress={onSubmit}
        isLoading={isSubmitting}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    gap: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
});
