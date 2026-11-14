import Constants from "expo-constants";
import { Platform } from "react-native";

function resolveApiBaseUrl(): string {
  const configured =
    process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";

  if (Platform.OS === "web") {
    return configured;
  }

  if (
    configured.includes("localhost") ||
    configured.includes("127.0.0.1")
  ) {
    const hostUri = Constants.expoConfig?.hostUri;
    const devHost = hostUri?.split(":")[0];

    if (devHost) {
      return configured
        .replace("localhost", devHost)
        .replace("127.0.0.1", devHost);
    }

    if (Platform.OS === "android") {
      return configured
        .replace("localhost", "10.0.2.2")
        .replace("127.0.0.1", "10.0.2.2");
    }
  }

  return configured;
}

export const API_BASE_URL = resolveApiBaseUrl();

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers, ...rest } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      ...rest,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Falha de rede";
    throw new ApiError(
      `Não foi possível conectar ao servidor (${API_BASE_URL}). ${detail}`,
      0,
      err
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const hasJson = contentType.includes("application/json");
  const payload = hasJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === "object" &&
        payload !== null &&
        ("message" in payload || "error" in payload) &&
        String(
          (payload as { message?: string; error?: string }).message ??
            (payload as { error?: string }).error
        )) ||
      `Erro na requisição (${response.status})`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, params?: RequestOptions["params"]) =>
    apiRequest<T>(path, { method: "GET", params }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
