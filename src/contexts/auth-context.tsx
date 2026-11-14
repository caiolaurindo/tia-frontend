import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  authService,
  LoginPayload,
  ProfessorUser,
  RegisterPayload,
  setAuthToken,
} from "@/services";

interface AuthContextValue {
  user: ProfessorUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ProfessorUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.professor);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      let response = await authService.register(payload);

      // Caso o endpoint de cadastro crie a professora sem retornar o JWT,
      // realizamos o primeiro login automaticamente logo em seguida.
      if (!response.token) {
        response = await authService.login({
          email: payload.email,
          senha: payload.senha,
        });
      }

      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.professor);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignora falha de rede ao encerrar sessão local
    } finally {
      setAuthToken(null);
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [user, token, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
}
