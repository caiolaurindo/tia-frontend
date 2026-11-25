import { api } from "./api";

export interface TurmaApi {
  id: number;
  nome: string;
  serie: string;
  anoLetivo: number;
  faixaEtaria?: string | null;
  turno?: string | null;
  descricao?: string | null;
  arquivada: boolean;
}

export interface TurmaPayload {
  nome: string;
  serie: string;
  anoLetivo: number;
  faixaEtaria?: string | null;
  turno?: string | null;
  descricao?: string | null;
}

interface TurmasPaginadas {
  dados: TurmaApi[];
  paginacao: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
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

async function listarTodas(): Promise<TurmaApi[]> {
  const primeiraPagina = await api.get<TurmasPaginadas>("/turmas", {
    page: 1,
    limit: 100,
  });

  const turmas = [...primeiraPagina.dados];

  for (
    let pagina = 2;
    pagina <= primeiraPagina.paginacao.totalPaginas;
    pagina++
  ) {
    const resposta = await api.get<TurmasPaginadas>("/turmas", {
      page: pagina,
      limit: 100,
    });

    turmas.push(...resposta.dados);
  }

  return turmas;
}

export const turmaService = {
  listar: listarTodas,

  buscarPorId: async (id: string | number) =>
    extrairTurma(await api.get<unknown>(`/turmas/${id}`)),

  criar: async (dados: TurmaPayload) =>
    extrairTurma(await api.post<unknown>("/turmas", dados)),

  atualizar: async (id: string | number, dados: Partial<TurmaPayload>) =>
    extrairTurma(await api.put<unknown>(`/turmas/${id}`, dados)),

  atualizarArquivamento: async (id: string | number, arquivada: boolean) =>
    extrairTurma(
      await api.patch<unknown>(`/turmas/${id}/arquivamento`, { arquivada })
    ),

  remover: (id: string | number) =>
    api.delete<void>(`/turmas/${id}`),
};
