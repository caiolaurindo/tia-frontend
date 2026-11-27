import { api } from "./api";
import { TurmaApi } from "./turma.service";

export type AulaStatus =
  | "proxima"
  | "planejada"
  | "em_andamento"
  | "concluida";

export interface AulaAtividade {
  id: string;
  label: string;
  color: string;
}

export interface AulaApi {
  id: number;
  nome: string;
  assunto?: string | null;
  data?: string | null;
  turmaId?: number;
  turma?: TurmaApi | null;
  horarioInicio?: string | null;
  horarioFim?: string | null;
  status?: AulaStatus;
  atividades?: AulaAtividade[] | null;
}

export interface AulaPayload {
  nome: string;
  assunto: string;
  data: string;
  turmaId: number;
  horarioInicio?: string | null;
  horarioFim?: string | null;
  status?: AulaStatus;
  atividades?: AulaAtividade[];
}

function extrairListaAulas(resposta: unknown): AulaApi[] {
  if (Array.isArray(resposta)) return resposta as AulaApi[];

  if (resposta && typeof resposta === "object") {
    const obj = resposta as Record<string, unknown>;

    for (const key of ["data", "dados", "aulas", "items", "itens", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as AulaApi[];
    }

    if (obj.data && typeof obj.data === "object") {
      return extrairListaAulas(obj.data);
    }
  }

  return [];
}

function extrairAula(resposta: unknown): AulaApi {
  if (resposta && typeof resposta === "object") {
    const obj = resposta as Record<string, unknown>;

    for (const key of ["aula", "dados"]) {
      if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        return obj[key] as AulaApi;
      }
    }

    if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
      return obj.data as AulaApi;
    }
  }

  return resposta as AulaApi;
}

export const aulaService = {
  listar: async () => extrairListaAulas(await api.get<unknown>("/aulas")),

  buscarPorId: async (id: string | number) =>
    extrairAula(await api.get<unknown>(`/aulas/${id}`)),

  criar: async (dados: AulaPayload) =>
    extrairAula(await api.post<unknown>("/aulas", dados)),

  atualizar: async (id: string | number, dados: Partial<AulaPayload>) =>
    extrairAula(await api.put<unknown>(`/aulas/${id}`, dados)),

  remover: (id: string | number) =>
    api.delete<void>(`/aulas/${id}`),
};
