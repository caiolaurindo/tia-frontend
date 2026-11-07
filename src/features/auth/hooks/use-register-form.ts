import { useState, useCallback } from "react";
import { RegisterFormData, RegisterFormErrors } from "../types/auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UseRegisterFormOptions {
  onRegisterSuccess?: (data: RegisterFormData) => void;
}

export function useRegisterForm(options?: UseRegisterFormOptions) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setErrors((prev) => (prev.name ? { ...prev, name: undefined } : prev));
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrors((prev) => (prev.email ? { ...prev, email: undefined } : prev));
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setErrors((prev) =>
      prev.password || prev.confirmPassword
        ? { ...prev, password: undefined, confirmPassword: undefined }
        : prev
    );
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
    setErrors((prev) =>
      prev.confirmPassword ? { ...prev, confirmPassword: undefined } : prev
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
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      options?.onRegisterSuccess?.({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [name, email, password, confirmPassword, options, validate]);

  return {
    name,
    email,
    password,
    confirmPassword,
    errors,
    isSubmitting,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    resetErrors,
    handleSubmit,
  };
}
