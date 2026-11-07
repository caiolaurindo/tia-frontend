import { TURMA_TODAS } from "../data/conquistas-options";
import {
  Conquista,
  ProgressoTurma,
  Turma,
  TurmaFiltro,
} from "../types/conquistas.types";

const VAZIO: ProgressoTurma = {
  conquistado: 0,
  emDesenvolvimento: 0,
  naoTrabalhado: 0,
};

export function getProgresso(
  conquista: Conquista,
  turma: TurmaFiltro,
): ProgressoTurma {
  if (turma !== TURMA_TODAS) {
    return conquista.progressoPorTurma[turma] ?? VAZIO;
  }

  return Object.values(conquista.progressoPorTurma).reduce(
    (soma, atual) => ({
      conquistado: soma.conquistado + atual.conquistado,
      emDesenvolvimento: soma.emDesenvolvimento + atual.emDesenvolvimento,
      naoTrabalhado: soma.naoTrabalhado + atual.naoTrabalhado,
    }),
    VAZIO,
  );
}

export function getTotalAlunos(progresso: ProgressoTurma): number {
  return (
    progresso.conquistado +
    progresso.emDesenvolvimento +
    progresso.naoTrabalhado
  );
}

/** Conquista recém-criada: ninguém trabalhou ainda. */
export function criarProgressoInicial(
  turmas: Turma[],
): Record<string, ProgressoTurma> {
  return Object.fromEntries(
    turmas.map((t) => [
      t.id,
      { conquistado: 0, emDesenvolvimento: 0, naoTrabalhado: t.totalAlunos },
    ]),
  );
}

/** Ignora maiúsculas e acentos na busca. */
export function normalizarTexto(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
