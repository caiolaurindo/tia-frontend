import { Turma } from "../types/turmas.types";

export const mockTurmas: Turma[] = [
  {
    id: "1",
    nome: "Turma 1º Ano A",
    etapa: "Ensino Fundamental",
    turno: "Manhã",
    quantidadeAlunos: 25,
    status: "ativa",
  },
  {
    id: "2",
    nome: "Turma 2º Ano B",
    etapa: "Ensino Fundamental",
    turno: "Tarde",
    quantidadeAlunos: 22,
    status: "ativa",
  },
  {
    id: "3",
    nome: "Turma 3º Ano A",
    etapa: "Ensino Fundamental",
    turno: "Manhã",
    quantidadeAlunos: 28,
    status: "arquivada",
  },
];