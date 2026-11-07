import { TagColorVariant } from "@/theme";

export type LessonStatus = "proxima" | "planejada" | "em_andamento" | "concluida";

export type AulasViewMode = "lista" | "calendario";

export type QuickObservationType =
  | "participacao"
  | "atividade"
  | "dificuldade"
  | "conquista";

export interface LessonActivity {
  id: string;
  label: string;
  color: TagColorVariant;
}

export interface LessonAchievement {
  id: string;
  title: string;
  completed?: boolean;
}

export interface StudentLessonRecord {
  studentId: string;
  name: string;
  initials: string;
  avatarVariant: TagColorVariant;
  observations: QuickObservationType[];
  note: string;
  achievedIds: string[];
  updatedAt?: string;
}

export interface LessonItem {
  id: string;
  title: string;
  classGroup: string;
  grade: string;
  dateLabel: string;
  dayOfWeek: number; // 0 = Seg, 1 = Ter, 2 = Qua, 3 = Qui, 4 = Sex
  startTime: string;
  endTime: string;
  status: LessonStatus;
  content: string;
  activities: LessonActivity[];
  achievements: LessonAchievement[];
  students: StudentLessonRecord[];
  elapsedMinutes: number;
  teacherSummaryNote?: string;
  totalStudentsCount: number;
  preRegisteredCount: number;
}

export interface NewLessonInput {
  title: string;
  classGroup: string;
  grade: string;
  dateLabel: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  content: string;
  activities: LessonActivity[];
  achievements: LessonAchievement[];
}
