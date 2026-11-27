import { api } from "./api";

export interface RegistroApi {
  id: number;
  alunoId: number;
  aulaId?: number | null;
  conquistaId?: number | null;
  data: string;
  participacao?: string | null;
  realizouAtividade?: string | null;
  seguiuComandos?: string | null;
  dificuldades?: string | null;
  observacoesLivres?: string | null;
  aula?: { id: number; nome?: string; assunto?: string | null } | null;
  conquista?: { id: number; nome: string } | null;
}

export interface RegistroPayload {
  alunoId: number;
  aulaId?: number | null;
  conquistaId?: number | null;
  data: string;
  participacao?: string | null;
  realizouAtividade?: string | null;
  seguiuComandos?: string | null;
  dificuldades?: string | null;
  observacoesLivres?: string | null;
}

function extrairListaRegistros(resposta: unknown): RegistroApi[] {
  if (Array.isArray(resposta)) return resposta as RegistroApi[];
  if (resposta && typeof resposta === "object") {
    const obj = resposta as Record<string, unknown>;
    for (const key of ["data", "dados", "registros", "items", "itens", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as RegistroApi[];
    }
    if (obj.data && typeof obj.data === "object") {
      return extrairListaRegistros(obj.data);
    }
  }
  return [];
}

function extrairRegistro(resposta: unknown): RegistroApi {
  if (resposta && typeof resposta === "object") {
    const obj = resposta as Record<string, unknown>;
    for (const key of ["registro", "dados"]) {
      if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        return obj[key] as RegistroApi;
      }
    }
    if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
      return obj.data as RegistroApi;
    }
  }
  return resposta as RegistroApi;
}

export const registroService = {
  listar: async () =>
    extrairListaRegistros(await api.get<unknown>("/registros")),

  buscarPorAluno: async (alunoId: number) =>
    extrairListaRegistros(await api.get<unknown>(`/registros/aluno/${alunoId}`)),

  buscarPorAula: async (aulaId: number) =>
    extrairListaRegistros(await api.get<unknown>(`/registros/aula/${aulaId}`)),

  buscarPorId: async (id: number) =>
    extrairRegistro(await api.get<unknown>(`/registros/${id}`)),

  criar: async (dados: RegistroPayload) =>
    extrairRegistro(await api.post<unknown>("/registros", dados)),

  atualizar: async (id: number, dados: Partial<RegistroPayload>) =>
    extrairRegistro(await api.put<unknown>(`/registros/${id}`, dados)),

  remover: (id: number) =>
    api.delete<void>(`/registros/${id}`),
};