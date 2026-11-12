export type CategoriaRegistro = 
  | 'participou' 
  | 'realizou_atividade' 
  | 'respondeu_comandos' 
  | 'dificuldade' 
  | 'conquista' 
  | 'observacao_livre';

export type DetalheRapido = 'Espontaneamente' | 'Com apoio' | 'Em dupla' | 'Grupo todo';

export interface NovoRegistroDTO {
  alunoId: string;
  aulaId: string;
  categoria: CategoriaRegistro;
  detalhes: DetalheRapido[];
  observacao?: string;
  tipo: 'manual' | 'audio';
  audioUri?: string;
}