import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  authService,
  LoginPayload,
  ProfessorUser,
  RegisterPayload,
  setAuthToken,
  ApiError,
} from "@/services";

const AUTH_TOKEN_KEY = "@tia:auth-token";

interface AuthContextValue {
  user: ProfessorUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ProfessorUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ProfessorUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recupera a sessão quando o aplicativo é iniciado.
  useEffect(() => {
    let ativo = true;

    async function recuperarSessao() {
      try {
        const tokenSalvo = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

        if (!ativo) return;

        if (!tokenSalvo) {
          setAuthToken(null);
          setToken(null);
          setUser(null);
          return;
        }

        // Disponibiliza o token antes de consultar o professor.
        setAuthToken(tokenSalvo);
        setToken(tokenSalvo);

        const professor = await authService.getMe();

        if (!ativo) return;

        setUser(professor);
      } catch (erro) {
        if (!ativo) return;

        // Token inválido ou expirado: encerra a sessão local.
        if (
          erro instanceof ApiError &&
          (erro.status === 401 || erro.status === 403)
        ) {
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
          setAuthToken(null);
          setToken(null);
          setUser(null);
        }

        // Falhas de rede não apagam automaticamente o token salvo.
      } finally {
        if (ativo) {
          setIsLoading(false);
        }
      }
    }

    void recuperarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);

    try {
      const response = await authService.login(payload);

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);

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

      if (!response.token) {
        response = await authService.login({
          email: payload.email,
          senha: payload.senha,
        });
      }

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);

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
    } finally {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);

      setAuthToken(null);
      setToken(null);
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback((data: Partial<ProfessorUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
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
      updateProfile,
    }),
    [user, token, isLoading, signIn, signUp, signOut, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return ctx;
}
