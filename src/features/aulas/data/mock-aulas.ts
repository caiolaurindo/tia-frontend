import { LessonItem, StudentLessonRecord } from "../types/aulas.types";

export const CLASS_GROUPS = [
  { id: "5a", classGroup: "English Explorers", grade: "5º A" },
  { id: "7b", classGroup: "Teen Voices", grade: "7º B" },
  { id: "3c", classGroup: "Kids Starters", grade: "3º C" },
] as const;

export const SUGGESTED_ACHIEVEMENTS = [
  "Fala sobre a rotina diária",
  "Usa advérbios de frequência corretamente",
  "Compreende perguntas no Present Simple",
  "Participa de diálogos curtos em duplas",
  "Reconhece vocabulário da unidade sem apoio visual",
];

export const WEEK_RANGES = [
  { id: "w1", label: "21 set - 27 set", dateTitle: "Sexta, 25 de setembro" },
  { id: "w2", label: "28 set - 04 out", dateTitle: "Hoje · sexta, 02 de outubro" },
  { id: "w3", label: "05 out - 11 out", dateTitle: "Sexta, 09 de outubro" },
];

export const WEEK_DAYS = [
  { index: 0, short: "Seg", dayNumber: "28" },
  { index: 1, short: "Ter", dayNumber: "29" },
  { index: 2, short: "Qua", dayNumber: "30" },
  { index: 3, short: "Qui", dayNumber: "01" },
  { index: 4, short: "Sex", dayNumber: "02" },
];

const DEFAULT_STUDENTS_5A: StudentLessonRecord[] = [
  {
    studentId: "st-1",
    name: "João Silva",
    initials: "JS",
    avatarVariant: "blue",
    observations: [],
    note: "",
    achievedIds: [],
  },
  {
    studentId: "st-2",
    name: "Marina Oliveira",
    initials: "MO",
    avatarVariant: "green",
    observations: ["participacao", "atividade", "conquista"],
    note: "Excelente pronúncia durante o warm-up oral e ajudou o colega na entrevista.",
    achievedIds: ["ach-1", "ach-2"],
    updatedAt: "10:24",
  },
  {
    studentId: "st-3",
    name: "Lucas Costa",
    initials: "LC",
    avatarVariant: "amber",
    observations: [],
    note: "",
    achievedIds: [],
  },
  {
    studentId: "st-4",
    name: "Ana Souza",
    initials: "AS",
    avatarVariant: "purple",
    observations: [],
    note: "",
    achievedIds: [],
  },
  {
    studentId: "st-5",
    name: "Gabriel Rocha",
    initials: "GR",
    avatarVariant: "blue",
    observations: [],
    note: "",
    achievedIds: [],
  },
  {
    studentId: "st-6",
    name: "Beatriz Santos",
    initials: "BS",
    avatarVariant: "green",
    observations: ["participacao", "atividade"],
    note: "Respondeu com segurança usando always e usually.",
    achievedIds: ["ach-1"],
    updatedAt: "10:18",
  },
  {
    studentId: "st-7",
    name: "Pedro Almeida",
    initials: "PA",
    avatarVariant: "amber",
    observations: ["atividade", "dificuldade"],
    note: "Teve dúvida na ordem de 'never' na frase afirmativa.",
    achievedIds: [],
    updatedAt: "10:29",
  },
];

export const INITIAL_LESSONS: LessonItem[] = [
  {
    id: "aula-1",
    title: "Daily routines & frequency",
    classGroup: "English Explorers",
    grade: "5º A",
    dateLabel: "Hoje · sexta, 02 de outubro",
    dayOfWeek: 4,
    startTime: "10:00",
    endTime: "11:00",
    status: "proxima",
    content: "Adverbs of frequency, daily routine vocabulary, present simple.",
    activities: [
      { id: "act-1", label: "Warm-up oral", color: "purple" },
      { id: "act-2", label: "Entrevista em duplas", color: "green" },
      { id: "act-3", label: "Exit ticket", color: "amber" },
    ],
    achievements: [
      { id: "ach-1", title: "Fala sobre a rotina diária", completed: true },
      {
        id: "ach-2",
        title: "Usa advérbios de frequência corretamente",
        completed: true,
      },
    ],
    students: DEFAULT_STUDENTS_5A,
    elapsedMinutes: 32,
    totalStudentsCount: 22,
    preRegisteredCount: 15,
  },
  {
    id: "aula-2",
    title: "Past experiences",
    classGroup: "Teen Voices",
    grade: "7º B",
    dateLabel: "Hoje · sexta, 02 de outubro",
    dayOfWeek: 4,
    startTime: "14:00",
    endTime: "15:00",
    status: "planejada",
    content: "Simple Past regular and irregular verbs, storytelling connectors.",
    activities: [
      { id: "act-4", label: "Memory game", color: "blue" },
      { id: "act-5", label: "Story timeline", color: "purple" },
      { id: "act-6", label: "Listening quiz", color: "green" },
    ],
    achievements: [
      { id: "ach-3", title: "Relata acontecimentos no passado", completed: true },
      { id: "ach-4", title: "Formula perguntas com Did", completed: false },
    ],
    students: DEFAULT_STUDENTS_5A.map((st, idx) => ({
      ...st,
      observations: idx === 0 ? ["participacao"] : [],
      note: "",
    })),
    elapsedMinutes: 0,
    totalStudentsCount: 20,
    preRegisteredCount: 0,
  },
  {
    id: "aula-3",
    title: "Animals and habitats",
    classGroup: "Kids Starters",
    grade: "3º C",
    dateLabel: "Hoje · sexta, 02 de outubro",
    dayOfWeek: 4,
    startTime: "15:30",
    endTime: "16:20",
    status: "planejada",
    content: "Wild animals, habitats (forest, ocean, desert) and can / can't.",
    activities: [
      { id: "act-7", label: "Flashcards", color: "amber" },
      { id: "act-8", label: " Guess the animal", color: "green" },
    ],
    achievements: [
      { id: "ach-5", title: "Identifica animais e seus habitats", completed: true },
    ],
    students: DEFAULT_STUDENTS_5A.map((st) => ({
      ...st,
      observations: [],
      note: "",
    })),
    elapsedMinutes: 0,
    totalStudentsCount: 18,
    preRegisteredCount: 0,
  },
  {
    id: "aula-4",
    title: "Food & healthy habits",
    classGroup: "English Explorers",
    grade: "5º A",
    dateLabel: "Quarta, 30 de setembro",
    dayOfWeek: 2,
    startTime: "10:00",
    endTime: "11:00",
    status: "concluida",
    content: "Countable and uncountable nouns, some / any, healthy meals.",
    activities: [
      { id: "act-9", label: "Role-play restaurante", color: "green" },
      { id: "act-10", label: "Bingo de vocabulário", color: "purple" },
    ],
    achievements: [
      { id: "ach-6", title: "Expressa preferências alimentares", completed: true },
    ],
    students: DEFAULT_STUDENTS_5A,
    elapsedMinutes: 50,
    teacherSummaryNote:
      "A turma se engajou muito no role-play de restaurante. Revisar uso de 'any' em perguntas na próxima semana.",
    totalStudentsCount: 22,
    preRegisteredCount: 19,
  },
];
