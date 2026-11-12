export type TurmaStatus = "ativa" | "arquivada";

export interface Turma {
  id: string;
  nome: string;
  serie: string;
  anoLetivo: number;
  faixaEtaria: string;
  turno: string;
  descricao?: string;
  status: TurmaStatus;
}