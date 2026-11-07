import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextField } from "@/components/ui";
import { spacing } from "@/theme";
import { RegisterFormErrors } from "../types/auth.types";

export interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors?: RegisterFormErrors;
  isSubmitting?: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export function RegisterForm({
  name,
  email,
  password,
  confirmPassword,
  errors,
  isSubmitting = false,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <View style={styles.form}>
      <TextField
        label="Nome"
        leftIcon="user"
        placeholder="Carolina Silva"
        value={name}
        onChangeText={onNameChange}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
        returnKeyType="next"
        error={errors?.name}
      />

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
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        returnKeyType="next"
        error={errors?.password}
      />

      <TextField
        label="Confirmar senha"
        leftIcon="lock"
        placeholder="••••••••••••"
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        error={errors?.confirmPassword}
      />

      <Button
        title="Criar conta na TIA"
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
