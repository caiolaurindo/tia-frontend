export type TurmaStatus = "ativa" | "arquivada";

export interface Turma {
  id: string;
  nome: string;
  turno: string;
  quantidadeAlunos: number;
  status: TurmaStatus;
}
