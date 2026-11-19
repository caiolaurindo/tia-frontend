import { api } from "./api";
import { TurmaApi } from "./turma.service";

export interface AulaApi {
  id: number;
  nome: string;
  assunto?: string | null;
  data?: string | null;
  turmaId?: number;
  turma?: TurmaApi | null;
}

export interface AulaPayload {
  nome: string;
  assunto: string;
  data: string;
  turmaId: number;
}

export const aulaService = {
  listar: () => api.get<AulaApi[]>("/aulas"),

  buscarPorId: (id: string | number) =>
    api.get<AulaApi>(`/aulas/${id}`),

  criar: (dados: AulaPayload) =>
    api.post<AulaApi>("/aulas", dados),

  atualizar: (id: string | number, dados: Partial<AulaPayload>) =>
    api.put<AulaApi>(`/aulas/${id}`, dados),

  remover: (id: string | number) =>
    api.delete<void>(`/aulas/${id}`),
};
