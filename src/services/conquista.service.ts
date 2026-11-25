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

/** Uma linha de GET /conquistas/progresso (conquista x turma vinculada). */
export interface ProgressoConquistaApi {
  conquistaId: number;
  turmaId: number;
  conquistado: number;
  emDesenvolvimento: number;
  naoTrabalhado: number;
}

/** Campos editáveis de uma conquista (o body do backend é strict). */
export type AtualizarConquistaInput = Partial<
  Omit<NovaConquistaInput, "turmaIds">
>;

/** Converte para o tipo da tela. O progresso por turma é montado no contexto. */
function toConquista(c: ConquistaApi): Conquista {
  return {
    id: String(c.id),
    nome: c.nome,
    categoria: c.categoria,
    nivel: c.nivel || undefined, // "" (nível apagado) vira sem nível
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

  // O body do backend é strict: não pode levar turmaIds.
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

  /** Usa a rota do módulo de turmas, que já valida se a turma é do professor. */
  vincularTurma: async (turmaId: string, conquistaId: string): Promise<void> => {
    await api.post<unknown>(`/turmas/${turmaId}/conquistas`, {
      conquistaId: Number(conquistaId),
    });
  },
};
