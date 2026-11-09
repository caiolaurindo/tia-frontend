export type TurmaStatus = "ativa" | "arquivada";

export interface Turma {
  id: string;
  nome: string;
  etapa: string;
  turno: string;
  quantidadeAlunos: number;
  status: TurmaStatus;
}