import { api, ApiError } from "./api";

export interface ProfessorUser {
  id: string;
  nome: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  professor: ProfessorUser;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

type RawAuthResponse = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  professor?: ProfessorUser;
  usuario?: ProfessorUser;
  user?: ProfessorUser;
  data?: RawAuthResponse;
  id?: string | number;
  nome?: string;
  email?: string;
};

function normalizeAuthResponse(
  raw: RawAuthResponse,
  fallbackEmail: string,
  fallbackNome?: string
): AuthResponse {
  const source = raw.data ?? raw;
  const token = source.token ?? source.accessToken ?? "";
  const rawUser = source.professor ?? source.usuario ?? source.user;

  const professor: ProfessorUser = rawUser
    ? {
        id: String(rawUser.id),
        nome: rawUser.nome ?? fallbackNome ?? "",
        email: rawUser.email ?? fallbackEmail,
        role: rawUser.role,
      }
    : {
        id: String(source.id ?? ""),
        nome: source.nome ?? fallbackNome ?? "",
        email: source.email ?? fallbackEmail,
      };

  return {
    token,
    refreshToken: source.refreshToken,
    professor,
  };
}

async function postWithFallback<T>(
  paths: string[],
  payload: unknown
): Promise<T> {
  let lastError: unknown;

  for (const path of paths) {
    try {
      return await api.post<T>(path, payload);
    } catch (err) {
      lastError = err;
      if (err instanceof ApiError && err.status === 404) {
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const raw = await postWithFallback<RawAuthResponse>(
      ["/auth/login", "/professores/login"],
      payload
    );
    return normalizeAuthResponse(raw, payload.email);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const raw = await postWithFallback<RawAuthResponse>(
      ["/auth/cadastro", "/professores/cadastro", "/professores"],
      payload
    );
    return normalizeAuthResponse(raw, payload.email, payload.nome);
  },

  getMe: () => api.get<ProfessorUser>("/professores/me"),

  logout: () => api.post<void>("/auth/logout"),
};
