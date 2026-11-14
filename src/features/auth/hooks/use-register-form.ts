import { useState, useCallback } from "react";
import { useAuth } from "@/contexts";
import { ApiError } from "@/services";
import { RegisterFormData, RegisterFormErrors } from "../types/auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UseRegisterFormOptions {
  onRegisterSuccess?: (data: RegisterFormData) => void;
}

export function useRegisterForm(options?: UseRegisterFormOptions) {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setErrors((prev) =>
      prev.name || prev.general
        ? { ...prev, name: undefined, general: undefined }
        : prev
    );
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrors((prev) =>
      prev.email || prev.general
        ? { ...prev, email: undefined, general: undefined }
        : prev
    );
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setErrors((prev) =>
      prev.password || prev.confirmPassword || prev.general
        ? {
            ...prev,
            password: undefined,
            confirmPassword: undefined,
            general: undefined,
          }
        : prev
    );
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
    setErrors((prev) =>
      prev.confirmPassword || prev.general
        ? { ...prev, confirmPassword: undefined, general: undefined }
        : prev
    );
  }, []);

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const nextErrors: RegisterFormErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      nextErrors.name = "Informe seu nome.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "O nome deve ter pelo menos 2 caracteres.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Informe um e-mail válido.";
    }

    if (!password) {
      nextErrors.password = "Informe uma senha.";
    } else if (password.length < 6) {
      nextErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirme sua senha.";
    } else if (password && confirmPassword !== password) {
      nextErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [name, email, password, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    if (!validate() || isSubmitting) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    setIsSubmitting(true);
    try {
      await signUp({
        nome: trimmedName,
        email: trimmedEmail,
        senha: password,
      });
      options?.onRegisterSuccess?.({
        name: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Não foi possível criar a conta. Tente novamente.";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    confirmPassword,
    email,
    isSubmitting,
    name,
    options,
    password,
    signUp,
    validate,
  ]);

  return {
    name,
    email,
    password,
    confirmPassword,
    errors,
    apiError: errors.general,
    isSubmitting,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    resetErrors,
    handleSubmit,
  };
}
