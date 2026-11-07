export type ConquistaCategoria =
  | "speaking"
  | "listening"
  | "grammar"
  | "vocabulary"
  | "reading"
  | "writing";

/** "todas" ou o id de uma turma. */
export type TurmaFiltro = string;

export interface Turma {
  id: string;
  nome: string; // "Turma 3A · Manhã"
  rotulo: string; // "3A" (usado no seletor)
  totalAlunos: number;
}

/** Quantos alunos de uma turma estão em cada situação para uma conquista. */
export interface ProgressoTurma {
  conquistado: number;
  emDesenvolvimento: number;
  naoTrabalhado: number;
}

export interface Conquista {
  id: string;
  nome: string; // "Introduzir-se em inglês"
  categoria: ConquistaCategoria;
  nivel?: string; // "A1", opcional
  ativa: boolean; // false = arquivada
  progressoPorTurma: Record<string, ProgressoTurma>;
}

export interface NovaConquistaInput {
  nome: string;
  categoria: ConquistaCategoria;
  nivel?: string;
}
