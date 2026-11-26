
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/contexts";
import { useTurmasContext } from "@/features/turmas/context/turmas-context";
import { AulaApi, aulaService } from "@/services";
import { conquistaService } from "@/services/conquista.service";

import {
  LessonItem,
  NewLessonInput,
  QuickObservationType,
} from "../types/aulas.types";

interface AulasContextValue {
  lessons: LessonItem[];
  selectedLessonId: string;
  isLoading: boolean;
  error: string | null;
  refreshLessons: () => Promise<void>;
  selectLesson: (lessonId: string) => void;
  getLessonById: (lessonId?: string) => LessonItem | undefined;
  createLesson: (input: NewLessonInput) => Promise<LessonItem>;
  updateLesson: (lessonId: string, input: NewLessonInput) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
  startLesson: (lessonId: string) => Promise<void>;
  finishLesson: (
    lessonId: string,
    elapsedMinutes: number,
    summaryNote?: string
  ) => Promise<void>;
  toggleStudentObservation: (
    lessonId: string,
    studentId: string,
    type: QuickObservationType
  ) => void;
  updateStudentDetail: (
    lessonId: string,
    studentId: string,
    payload: {
      observations: QuickObservationType[];
      note: string;
      achievedIds: string[];
    }
  ) => void;
}

const AulasContext = createContext<AulasContextValue | null>(null);

function getDayOfWeekFromIso(dateIso: string): number {
  const [y, m, d] = dateIso.split("-").map(Number);

  if (!y || !m || !d) return 0;

  const jsDay = new Date(y, m - 1, d, 12, 0, 0).getDay();

  return jsDay === 0 ? 4 : Math.min(4, jsDay - 1);
}

function normalizarHorario(horario?: string | null): string {
  return horario ? horario.slice(0, 5) : "";
}

function mapearAtividades(
  atividades?: AulaApi["atividades"]
): LessonItem["activities"] {
  return (atividades ?? []).map((atividade) => ({
    ...atividade,
    color: atividade.color as LessonItem["activities"][number]["color"],
  }));
}

function mapearAula(aulaApi: AulaApi): LessonItem {
  const dateIso = aulaApi.data
    ? String(aulaApi.data).slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const turmaId =
    aulaApi.turma?.id !== undefined
      ? String(aulaApi.turma.id)
      : aulaApi.turmaId !== undefined
        ? String(aulaApi.turmaId)
        : undefined;

  return {
    id: String(aulaApi.id ?? ""),
    turmaId,
    dateIso,
    title: aulaApi.nome ?? "",
    classGroup: aulaApi.turma?.nome ?? "",
    grade: aulaApi.turma?.serie ?? "",
    dateLabel: dateIso.split("-").reverse().join("/"),
    dayOfWeek: getDayOfWeekFromIso(dateIso),
    startTime: normalizarHorario(aulaApi.horarioInicio) || "10:00",
    endTime: normalizarHorario(aulaApi.horarioFim) || "11:00",
    status: aulaApi.status ?? "planejada",
    content: aulaApi.assunto ?? "",
    activities: mapearAtividades(aulaApi.atividades),
    achievements: [],
    students: [],
    elapsedMinutes: 0,
    totalStudentsCount: 0,
    preRegisteredCount: 0,
  };
}

export function AulasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const { turmas } = useTurmasContext();

  const [rawLessons, setLessons] = useState<LessonItem[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lessons = useMemo(
    () =>
      rawLessons.map((lesson) => {
        const turma = lesson.turmaId
          ? turmas.find((t) => t.id === lesson.turmaId)
          : undefined;

        return turma
          ? {
              ...lesson,
              classGroup: lesson.classGroup || turma.nome,
              grade: lesson.grade || turma.serie,
            }
          : lesson;
      }),
    [rawLessons, turmas]
  );

  // Carrega as aulas e suas conquistas vinculadas.
  const refreshLessons = useCallback(async () => {
    if (!token) {
      setLessons([]);
      setSelectedLessonId("");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const resposta = await aulaService.listar();

      const mapeadas = await Promise.all(
        resposta.map(async (aulaApi) => {
          const aula = mapearAula(aulaApi);

          const vinculos = await conquistaService.listarPorAula(
            aulaApi.id
          );

          return {
            ...aula,
            achievements: vinculos.map((vinculo) => ({
              id: String(vinculo.conquista.id),
              title: vinculo.conquista.nome,
              completed: true,
              linkId: String(vinculo.id),
            })),
          };
        })
      );

      setLessons(mapeadas);

      setSelectedLessonId((prev) =>
        prev && mapeadas.some((item) => item.id === prev)
          ? prev
          : (mapeadas[0]?.id ?? "")
      );
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : "Não foi possível carregar as aulas.";

      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshLessons();
  }, [refreshLessons]);

  const selectLesson = useCallback((lessonId: string) => {
    setSelectedLessonId(lessonId);
  }, []);

  const getLessonById = useCallback(
    (lessonId?: string): LessonItem | undefined => {
      const targetId = lessonId ?? selectedLessonId;

      if (!targetId) return undefined;

      return lessons.find((item) => item.id === targetId);
    },
    [lessons, selectedLessonId]
  );

  // Cria a aula e salva seus vínculos com as conquistas.
  const createLesson = useCallback(
    async (input: NewLessonInput): Promise<LessonItem> => {
      const resposta = await aulaService.criar({
        nome: input.title,
        assunto: input.content,
        data: input.dateIso ?? new Date().toISOString().slice(0, 10),
        turmaId: Number(input.turmaId),
        horarioInicio: input.startTime || null,
        horarioFim: input.endTime || null,
        status: "planejada",
        atividades: input.activities,
      });

      const vinculos = await Promise.all(
        input.achievements.map((achievement) =>
          conquistaService.vincularAula(resposta.id, achievement.id)
        )
      );

      const newLesson: LessonItem = {
        ...mapearAula(resposta),
        turmaId: input.turmaId,
        classGroup: input.classGroup,
        grade: input.grade,
        startTime:
          normalizarHorario(resposta.horarioInicio) || input.startTime,
        endTime:
          normalizarHorario(resposta.horarioFim) || input.endTime,
        status: resposta.status ?? "planejada",
        activities: resposta.atividades
          ? mapearAtividades(resposta.atividades)
          : input.activities,
        achievements: input.achievements.map((achievement, index) => ({
          ...achievement,
          linkId: String(vinculos[index].id),
        })),
      };

      setLessons((prev) => [newLesson, ...prev]);
      setSelectedLessonId(newLesson.id);

      return newLesson;
    },
    []
  );

  // Atualiza a aula e sincroniza as conquistas adicionadas ou removidas.
  const updateLesson = useCallback(
    async (lessonId: string, input: NewLessonInput) => {
      const resposta = await aulaService.atualizar(lessonId, {
        nome: input.title,
        assunto: input.content,
        data: input.dateIso ?? new Date().toISOString().slice(0, 10),
        turmaId: Number(input.turmaId),
        horarioInicio: input.startTime || null,
        horarioFim: input.endTime || null,
        atividades: input.activities,
      });

      // Busca os vínculos atuais diretamente no backend.
      const vinculosAtuais =
        await conquistaService.listarPorAula(lessonId);

      const conquistasDesejadas = input.achievements;

      // Identifica os vínculos que devem ser mantidos.
      const vinculosParaManter = vinculosAtuais.filter((vinculo) =>
        conquistasDesejadas.some(
          (achievement) =>
            Number(achievement.id) === Number(vinculo.conquista.id)
        )
      );

      // Identifica as conquistas que precisam ser adicionadas.
      const conquistasParaAdicionar = conquistasDesejadas.filter(
        (achievement) =>
          !vinculosAtuais.some(
            (vinculo) =>
              Number(vinculo.conquista.id) === Number(achievement.id)
          )
      );

      // Identifica os vínculos que precisam ser removidos.
      const vinculosParaRemover = vinculosAtuais.filter(
        (vinculo) =>
          !conquistasDesejadas.some(
            (achievement) =>
              Number(achievement.id) === Number(vinculo.conquista.id)
          )
      );

      const [novosVinculos] = await Promise.all([
        Promise.all(
          conquistasParaAdicionar.map((achievement) =>
            conquistaService.vincularAula(lessonId, achievement.id)
          )
        ),
        Promise.all(
          vinculosParaRemover.map((vinculo) =>
            conquistaService.removerVinculoAula(vinculo.id)
          )
        ),
      ]);

      // Reconstrói a lista com os IDs dos vínculos persistidos.
      const linkIdPorConquista = new Map<number, string>();

      vinculosParaManter.forEach((vinculo) => {
        linkIdPorConquista.set(
          Number(vinculo.conquista.id),
          String(vinculo.id)
        );
      });

      novosVinculos.forEach((vinculo) => {
        linkIdPorConquista.set(
          Number(vinculo.conquista.id),
          String(vinculo.id)
        );
      });

      const achievementsAtualizadas = conquistasDesejadas.map(
        (achievement) => ({
          ...achievement,
          linkId: linkIdPorConquista.get(Number(achievement.id)),
        })
      );

      const atualizada = mapearAula(resposta);

      setLessons((prev) =>
        prev.map((item) =>
          item.id === lessonId
            ? {
                ...item,
                ...atualizada,
                turmaId: input.turmaId,
                classGroup: input.classGroup,
                grade: input.grade,
                startTime:
                  normalizarHorario(resposta.horarioInicio) ||
                  input.startTime,
                endTime:
                  normalizarHorario(resposta.horarioFim) ||
                  input.endTime,
                activities: resposta.atividades
                  ? mapearAtividades(resposta.atividades)
                  : input.activities,
                achievements: achievementsAtualizadas,
              }
            : item
        )
      );
    },
    []
  );

  const deleteLesson = useCallback(async (lessonId: string) => {
    await aulaService.remover(lessonId);

    setLessons((prev) => {
      const restantes = prev.filter((item) => item.id !== lessonId);

      setSelectedLessonId((current) =>
        current === lessonId ? (restantes[0]?.id ?? "") : current
      );

      return restantes;
    });
  }, []);

  const startLesson = useCallback(async (lessonId: string) => {
    await aulaService.atualizar(lessonId, {
      status: "em_andamento",
    });

    setSelectedLessonId(lessonId);

    setLessons((prev) =>
      prev.map((item) =>
        item.id === lessonId && item.status !== "concluida"
          ? { ...item, status: "em_andamento" }
          : item
      )
    );
  }, []);

  const finishLesson = useCallback(
    async (
      lessonId: string,
      elapsedMinutes: number,
      summaryNote?: string
    ) => {
      await aulaService.atualizar(lessonId, {
        status: "concluida",
      });

      setLessons((prev) =>
        prev.map((item) =>
          item.id === lessonId
            ? {
                ...item,
                status: "concluida",
                elapsedMinutes,
                teacherSummaryNote:
                  summaryNote ?? item.teacherSummaryNote,
              }
            : item
        )
      );
    },
    []
  );

  const toggleStudentObservation = useCallback(
    (
      lessonId: string,
      studentId: string,
      type: QuickObservationType
    ) => {
      const nowTime = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setLessons((prev) =>
        prev.map((lesson) => {
          if (lesson.id !== lessonId) return lesson;

          return {
            ...lesson,
            students: lesson.students.map((student) => {
              if (student.studentId !== studentId) return student;

              const exists = student.observations.includes(type);

              const nextObservations = exists
                ? student.observations.filter((obs) => obs !== type)
                : [...student.observations, type];

              return {
                ...student,
                observations: nextObservations,
                updatedAt: nowTime,
              };
            }),
          };
        })
      );
    },
    []
  );

  const updateStudentDetail = useCallback(
    (
      lessonId: string,
      studentId: string,
      payload: {
        observations: QuickObservationType[];
        note: string;
        achievedIds: string[];
      }
    ) => {
      const nowTime = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setLessons((prev) =>
        prev.map((lesson) => {
          if (lesson.id !== lessonId) return lesson;

          return {
            ...lesson,
            students: lesson.students.map((student) =>
              student.studentId === studentId
                ? {
                    ...student,
                    observations: payload.observations,
                    note: payload.note,
                    achievedIds: payload.achievedIds,
                    updatedAt: nowTime,
                  }
                : student
            ),
          };
        })
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      lessons,
      selectedLessonId,
      isLoading,
      error,
      refreshLessons,
      selectLesson,
      getLessonById,
      createLesson,
      updateLesson,
      deleteLesson,
      startLesson,
      finishLesson,
      toggleStudentObservation,
      updateStudentDetail,
    }),
    [
      lessons,
      selectedLessonId,
      isLoading,
      error,
      refreshLessons,
      selectLesson,
      getLessonById,
      createLesson,
      updateLesson,
      deleteLesson,
      startLesson,
      finishLesson,
      toggleStudentObservation,
      updateStudentDetail,
    ]
  );

  return (
    <AulasContext.Provider value={value}>
      {children}
    </AulasContext.Provider>
  );
}

export function useAulasContext() {
  const ctx = useContext(AulasContext);

  if (!ctx) {
    throw new Error(
      "useAulasContext deve ser usado dentro de um AulasProvider"
    );
  }

  return ctx;
}
