import { api } from "./api";

export interface TurmaApi {
  id: number;
  nome: string;
  serie: string;
  anoLetivo: number;
}

export interface TurmaPayload {
  nome: string;
  serie: string;
  anoLetivo: number;
}

function extrairListaTurmas(resposta: unknown): TurmaApi[] {
  if (Array.isArray(resposta)) return resposta as TurmaApi[];
  if (resposta && typeof resposta === "object") {
    const obj = resposta as Record<string, unknown>;
    for (const key of ["data", "dados", "turmas", "items", "itens", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as TurmaApi[];
    }
    if (obj.data && typeof obj.data === "object") {
      return extrairListaTurmas(obj.data);
    }
  }
  return [];
}

function extrairTurma(resposta: unknown): TurmaApi {
  if (resposta && typeof resposta === "object") {
    const obj = resposta as Record<string, unknown>;
    for (const key of ["turma", "dados", "data"]) {
      if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        return obj[key] as TurmaApi;
      }
    }
  }
  return resposta as TurmaApi;
}

export const turmaService = {
  listar: async () => extrairListaTurmas(await api.get<unknown>("/turmas")),

  buscarPorId: async (id: string | number) =>
    extrairTurma(await api.get<unknown>(`/turmas/${id}`)),

  criar: async (dados: TurmaPayload) =>
    extrairTurma(await api.post<unknown>("/turmas", dados)),

  atualizar: async (id: string | number, dados: Partial<TurmaPayload>) =>
    extrairTurma(await api.put<unknown>(`/turmas/${id}`, dados)),

  remover: (id: string | number) =>
    api.delete<void>(`/turmas/${id}`),
};
