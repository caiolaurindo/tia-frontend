import { useState, useCallback } from "react";
import { useAuth } from "@/contexts";
import { ApiError } from "@/services";
import { AuthMode, LoginFormData, LoginFormErrors } from "../types/auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UseLoginFormOptions {
  initialMode?: AuthMode;
  onLoginSuccess?: (data: LoginFormData) => void;
  onRegisterTabSelect?: () => void;
  onForgotPasswordPress?: () => void;
}

export function useLoginForm(options?: UseLoginFormOptions) {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>(options?.initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      prev.password || prev.general
        ? { ...prev, password: undefined, general: undefined }
        : prev
    );
  }, []);

  const handleModeChange = useCallback(
    (nextMode: AuthMode) => {
      setMode(nextMode);
      setErrors({});
      if (nextMode === "register") {
        options?.onRegisterTabSelect?.();
      }
    },
    [options]
  );

  const validate = useCallback((): boolean => {
    const nextErrors: LoginFormErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Informe um e-mail válido.";
    }

    if (!password) {
      nextErrors.password = "Informe sua senha.";
    } else if (password.length < 6) {
      nextErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(async () => {
    if (!validate() || isSubmitting) {
      return;
    }

    const trimmedEmail = email.trim();
    setIsSubmitting(true);
    try {
      await signIn({ email: trimmedEmail, senha: password });
      options?.onLoginSuccess?.({
        email: trimmedEmail,
        password,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Não foi possível entrar. Tente novamente.";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setIsSubmitting(false);
    }
  }, [email, isSubmitting, options, password, signIn, validate]);

  const handleForgotPassword = useCallback(() => {
    options?.onForgotPasswordPress?.();
  }, [options]);

  return {
    mode,
    email,
    password,
    errors,
    apiError: errors.general,
    isSubmitting,
    handleModeChange,
    handleEmailChange,
    handlePasswordChange,
    handleForgotPassword,
    handleSubmit,
  };
}
