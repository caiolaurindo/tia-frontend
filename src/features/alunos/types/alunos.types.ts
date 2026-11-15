import { TagColorVariant } from "@/theme";

export type AlunoStatus = "no_ritmo" | "destaque" | "atencao";

export type AlunoFilterKey = "todos" | "destaques" | "atencao";

export type AlunoProfileTab = "visao_geral" | "historico" | "evolucao";

export type AlunoEventType = "conquista" | "participacao" | "atividade";

export interface AlunoEvent {
  id: string;
  type: AlunoEventType;
  title: string;
  description: string;
  dateLabel: string;
}

export interface AlunoSkillProgress {
  id: string;
  label: string;
  statusLabel: string;
  percentage: number;
}

export interface AlunoItem {
  id: string;
  name: string;
  initials: string;
  avatarVariant: TagColorVariant;
  turmaName: string;
  grade: string;
  age: number;
  guardianName: string;
  status: AlunoStatus;
  recordsCount: number;
  achievementsCount: number;
  events: AlunoEvent[];
  skills: AlunoSkillProgress[];
}

export interface SaveAlunoInput {
  name: string;
  turmaName: string;
  grade: string;
  age: number;
  guardianName: string;
  status: AlunoStatus;
}
