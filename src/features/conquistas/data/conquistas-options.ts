import {
  ConquistaCategoria,
  NovaConquistaInput,
  Turma,
} from "../types/conquistas.types";

export const TURMA_TODAS = "todas";

export const CATEGORIA_LABEL: Record<ConquistaCategoria, string> = {
  speaking: "Speaking",
  listening: "Listening",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  reading: "Reading",
  writing: "Writing",
};

/** Habilidades disponíveis ao criar uma conquista. */
export const CATEGORIAS = Object.keys(CATEGORIA_LABEL) as ConquistaCategoria[];

/** Habilidades que aparecem como filtro na lista. */
export const FILTRO_CATEGORIAS: ConquistaCategoria[] = [
  "speaking",
  "listening",
  "grammar",
  "vocabulary",
];

// TODO: virá do backend (módulo de turmas).
export const TURMAS: Turma[] = [
  { id: "3A", nome: "Turma 3A · Manhã", rotulo: "3A", totalAlunos: 12 },
  { id: "3B", nome: "Turma 3B · Tarde", rotulo: "3B", totalAlunos: 10 },
];

export const SUGESTOES: NovaConquistaInput[] = [
  { nome: "Reconhecer cores", categoria: "vocabulary", nivel: "A1" },
  { nome: "Falar sobre rotina diária", categoria: "speaking", nivel: "A1" },
  { nome: "Compreender comandos da sala", categoria: "listening", nivel: "A1" },
];
