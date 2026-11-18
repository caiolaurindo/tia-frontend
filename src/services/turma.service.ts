
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

export const turmaService = {
  listar: () => api.get<TurmaApi[]>("/turmas"),

  buscarPorId: (id: string | number) =>
    api.get<TurmaApi>(`/turmas/${id}`),

  criar: (dados: TurmaPayload) =>
    api.post<TurmaApi>("/turmas", dados),

  atualizar: (id: string | number, dados: Partial<TurmaPayload>) =>
    api.put<TurmaApi>(`/turmas/${id}`, dados),

  remover: (id: string | number) =>
    api.delete<void>(`/turmas/${id}`),
};
