
import { api } from "./api";
import type {
  Conquista,
  ConquistaCategoria,
  NovaConquistaInput,
} from "@/features/conquistas/types/conquistas.types";

/** Formato que o backend devolve (id numérico, campos de auditoria). */
interface ConquistaApi {
  id: number;
  nome: string;
  descricao?: string | null;
  categoria: ConquistaCategoria;
  nivel?: string | null;
  ativa: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

/** Uma linha de GET /conquistas/progresso. */
export interface ProgressoConquistaApi {
  conquistaId: number;
  turmaId: number;
  conquistado: number;
  emDesenvolvimento: number;
  naoTrabalhado: number;
}

/** Resposta do vínculo entre uma aula e uma conquista. */
export interface AulaConquistaApi {
  id: number;
  aula: {
    id: number;
  };
  conquista: {
    id: number;
    nome: string;
  };
  meta?: string | null;
}

/** Campos editáveis de uma conquista. */
export type AtualizarConquistaInput = Partial<
  Omit<NovaConquistaInput, "turmaIds">
>;

function toConquista(c: ConquistaApi): Conquista {
  return {
    id: String(c.id),
    nome: c.nome,
    categoria: c.categoria,
    nivel: c.nivel || undefined,
    ativa: c.ativa,
    progressoPorTurma: {},
  };
}

export const conquistaService = {
  listar: async (): Promise<Conquista[]> => {
    const lista = await api.get<ConquistaApi[]>("/conquistas");
    return lista.map(toConquista);
  },

  progresso: (): Promise<ProgressoConquistaApi[]> =>
    api.get<ProgressoConquistaApi[]>("/conquistas/progresso"),

  criar: async (
    dados: Omit<NovaConquistaInput, "turmaIds">,
  ): Promise<Conquista> => {
    const criada = await api.post<ConquistaApi>("/conquistas", dados);
    return toConquista(criada);
  },

  atualizar: async (
    id: string,
    dados: AtualizarConquistaInput,
  ): Promise<void> => {
    await api.put<ConquistaApi>(`/conquistas/${id}`, dados);
  },

  definirAtiva: async (id: string, ativa: boolean): Promise<void> => {
    await api.put<ConquistaApi>(`/conquistas/${id}`, { ativa });
  },

  vincularTurma: async (
    turmaId: string,
    conquistaId: string,
  ): Promise<void> => {
    await api.post<unknown>(`/turmas/${turmaId}/conquistas`, {
      conquistaId: Number(conquistaId),
    });
  },

  /** Lista as conquistas vinculadas a uma aula. */
  listarPorAula: (aulaId: string | number): Promise<AulaConquistaApi[]> =>
    api.get<AulaConquistaApi[]>(
      `/aula-conquistas?aulaId=${Number(aulaId)}`,
    ),

  /** Cria o vínculo entre uma aula e uma conquista. */
  vincularAula: (
    aulaId: string | number,
    conquistaId: string,
  ): Promise<AulaConquistaApi> =>
    api.post<AulaConquistaApi>("/aula-conquistas", {
      aulaId: Number(aulaId),
      conquistaId: Number(conquistaId),
    }),

  /** Remove um vínculo pelo ID do registro em aula_conquista. */
  removerVinculoAula: (vinculoId: number): Promise<void> =>
    api.delete<void>(`/aula-conquistas/${vinculoId}`),
};
