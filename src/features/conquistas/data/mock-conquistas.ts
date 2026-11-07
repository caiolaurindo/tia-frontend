import { Conquista } from "../types/conquistas.types";

const p = (
  conquistado: number,
  emDesenvolvimento: number,
  naoTrabalhado: number,
) => ({ conquistado, emDesenvolvimento, naoTrabalhado });

export const MOCK_CONQUISTAS: Conquista[] = [
  {
    id: "c1",
    nome: "Introduzir-se em inglês",
    categoria: "speaking",
    nivel: "A1",
    ativa: true,
    progressoPorTurma: { "3A": p(10, 2, 0), "3B": p(7, 3, 0) },
  },
  {
    id: "c2",
    nome: "Compreender comandos da sala",
    categoria: "listening",
    nivel: "A1",
    ativa: true,
    progressoPorTurma: { "3A": p(9, 3, 0), "3B": p(8, 2, 0) },
  },
  {
    id: "c3",
    nome: "Falar sobre rotina diária",
    categoria: "speaking",
    nivel: "A1",
    ativa: true,
    progressoPorTurma: { "3A": p(4, 5, 3), "3B": p(6, 3, 1) },
  },
  {
    id: "c4",
    nome: "Usar can / can’t",
    categoria: "grammar",
    nivel: "A1",
    ativa: true,
    progressoPorTurma: { "3A": p(2, 5, 5), "3B": p(3, 4, 3) },
  },
  {
    id: "c5",
    nome: "Reconhecer cores",
    categoria: "vocabulary",
    ativa: true,
    progressoPorTurma: { "3A": p(11, 1, 0), "3B": p(9, 1, 0) },
  },
];
