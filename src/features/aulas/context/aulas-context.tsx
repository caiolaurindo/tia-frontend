import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { INITIAL_LESSONS } from "../data/mock-aulas";
import {
  LessonItem,
  NewLessonInput,
  QuickObservationType,
} from "../types/aulas.types";

interface AulasContextValue {
  lessons: LessonItem[];
  selectedLessonId: string;
  selectLesson: (lessonId: string) => void;
  getLessonById: (lessonId?: string) => LessonItem;
  createLesson: (input: NewLessonInput) => LessonItem;
  updateLesson: (lessonId: string, input: NewLessonInput) => void;
  startLesson: (lessonId: string) => void;
  finishLesson: (
    lessonId: string,
    elapsedMinutes: number,
    summaryNote?: string
  ) => void;
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

export function AulasProvider({ children }: { children: React.ReactNode }) {
  const [lessons, setLessons] = useState<LessonItem[]>(INITIAL_LESSONS);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    INITIAL_LESSONS[0].id
  );

  const selectLesson = useCallback((lessonId: string) => {
    setSelectedLessonId(lessonId);
  }, []);

  const getLessonById = useCallback(
    (lessonId?: string): LessonItem => {
      const targetId = lessonId || selectedLessonId;
      return (
        lessons.find((item) => item.id === targetId) ??
        lessons[0]
      );
    },
    [lessons, selectedLessonId]
  );

  const createLesson = useCallback(
    (input: NewLessonInput): LessonItem => {
      const baseStudents = INITIAL_LESSONS[0].students.map((st) => ({
        ...st,
        observations: [],
        note: "",
        achievedIds: [],
      }));

      const newLesson: LessonItem = {
        id: `aula-${Date.now()}`,
        title: input.title,
        classGroup: input.classGroup,
        grade: input.grade,
        dateLabel: input.dateLabel,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
        status: "planejada",
        content: input.content,
        activities: input.activities,
        achievements: input.achievements,
        students: baseStudents,
        elapsedMinutes: 0,
        totalStudentsCount: 22,
        preRegisteredCount: 0,
      };

      setLessons((prev) => [newLesson, ...prev]);
      setSelectedLessonId(newLesson.id);
      return newLesson;
    },
    []
  );

  const updateLesson = useCallback(
    (lessonId: string, input: NewLessonInput) => {
      setLessons((prev) =>
        prev.map((item) =>
          item.id === lessonId
            ? {
                ...item,
                title: input.title,
                classGroup: input.classGroup,
                grade: input.grade,
                dateLabel: input.dateLabel,
                dayOfWeek: input.dayOfWeek,
                startTime: input.startTime,
                endTime: input.endTime,
                content: input.content,
                activities: input.activities,
                achievements: input.achievements,
              }
            : item
        )
      );
    },
    []
  );

  const startLesson = useCallback((lessonId: string) => {
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
    (lessonId: string, elapsedMinutes: number, summaryNote?: string) => {
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
    (lessonId: string, studentId: string, type: QuickObservationType) => {
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
      selectLesson,
      getLessonById,
      createLesson,
      updateLesson,
      startLesson,
      finishLesson,
      toggleStudentObservation,
      updateStudentDetail,
    }),
    [
      lessons,
      selectedLessonId,
      selectLesson,
      getLessonById,
      createLesson,
      updateLesson,
      startLesson,
      finishLesson,
      toggleStudentObservation,
      updateStudentDetail,
    ]
  );

  return (
    <AulasContext.Provider value={value}>{children}</AulasContext.Provider>
  );
}

export function useAulasContext() {
  const ctx = useContext(AulasContext);
  if (!ctx) {
    throw new Error("useAulasContext deve ser usado dentro de um AulasProvider");
  }
  return ctx;
}
