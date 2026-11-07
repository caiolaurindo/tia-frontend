import { useState, useCallback } from "react";
import { AuthMode, LoginFormData, LoginFormErrors } from "../types/auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UseLoginFormOptions {
  onLoginSuccess?: (data: LoginFormData) => void;
  onRegisterTabSelect?: () => void;
  onForgotPasswordPress?: () => void;
}

export function useLoginForm(options?: UseLoginFormOptions) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrors((prev) => (prev.email ? { ...prev, email: undefined } : prev));
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setErrors((prev) =>
      prev.password ? { ...prev, password: undefined } : prev
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
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      options?.onLoginSuccess?.({
        email: email.trim(),
        password,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [email, options, password, validate]);

  const handleForgotPassword = useCallback(() => {
    options?.onForgotPasswordPress?.();
  }, [options]);

  return {
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
  };
}
