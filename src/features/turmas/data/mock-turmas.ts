import { Turma } from "../types/turmas.types";

export const mockTurmas: Turma[] = [
  {
    id: "turma-1",
    nome: "Turma A",
    serie: "5º ano",
    anoLetivo: 2026,
    faixaEtaria: "10 a 11 anos",
    turno: "Manhã",
    descricao: "Turma de inglês do nível básico.",
    status: "ativa",
  },
  {
    id: "turma-2",
    nome: "Turma B",
    serie: "4º ano",
    anoLetivo: 2026,
    faixaEtaria: "9 a 10 anos",
    turno: "Tarde",
    descricao: "Turma de inglês do nível iniciante.",
    status: "ativa",
  },
  {
    id: "turma-3",
    nome: "Turma C",
    serie: "6º ano",
    anoLetivo: 2026,
    faixaEtaria: "11 a 12 anos",
    turno: "Manhã",
    descricao: "Turma de inglês em andamento.",
    status: "arquivada",
  },
];