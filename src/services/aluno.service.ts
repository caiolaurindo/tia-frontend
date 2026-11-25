import { api } from "./api";

export type SituacaoAlunoApi = "NO_RITMO" | "DESTAQUE" | "ATENCAO";

export type StatusConquistaApi =
  | "NAO_TRABALHADO"
  | "EM_DESENVOLVIMENTO"
  | "EM_DESENVOLVIMENTO_AVANCADO"
  | "CONQUISTADO";

export interface AlunoApi {
  id: number;
  nome: string;
  dataNascimento: string;
  responsavel?: string | null;
  situacao: SituacaoAlunoApi;
  observacoes?: string | null;
  // No POST, o backend devolve a turma só com o id.
  turma?: { id: number; nome?: string; serie?: string };
}

export interface AlunoPayload {
  nome: string;
  dataNascimento: string; // AAAA-MM-DD
  turmaId: number;
  responsavel?: string;
  situacao?: SituacaoAlunoApi;
}

export interface AlunoConquistaApi {
  id: number;
  alunoId: number;
  conquistaId: number;
  status: StatusConquistaApi;
  dataConquista?: string | null;
  observacao?: string | null;
  conquista?: { id: number; nome: string };
}

export const alunoService = {
  listar: (turmaId?: number) =>
    api.get<AlunoApi[]>("/alunos", { turmaId }),

  buscarPorId: (id: string | number) => api.get<AlunoApi>(`/alunos/${id}`),

  criar: (dados: AlunoPayload) => api.post<AlunoApi>("/alunos", dados),

  atualizar: (id: string | number, dados: Partial<AlunoPayload>) =>
    api.put<AlunoApi>(`/alunos/${id}`, dados),

  remover: (id: string | number) => api.delete<void>(`/alunos/${id}`),
};

export const alunoConquistaService = {
  listarPorAluno: (alunoId: string | number) =>
    api.get<AlunoConquistaApi[]>("/aluno-conquistas", { alunoId }),
};