import { useCallback, useEffect, useMemo, useState } from "react";
import { useAulasContext } from "../context/aulas-context";
import { QuickObservationType, StudentLessonRecord } from "../types/aulas.types";

export function useLessonTracking(lessonId?: string) {
  const {
    getLessonById,
    toggleStudentObservation,
    updateStudentDetail,
    finishLesson,
  } = useAulasContext();

  const lesson = getLessonById(lessonId);
  const students = lesson?.students ?? [];

  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(
    lesson?.elapsedMinutes ?? 0
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setElapsedMinutes((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const togglePendingFilter = useCallback(() => {
    setShowOnlyPending((prev) => !prev);
  }, []);

  const handleQuickObservation = useCallback(
    (studentId: string, type: QuickObservationType) => {
      if (!lesson) return;
      toggleStudentObservation(lesson.id, studentId, type);
    },
    [lesson, toggleStudentObservation]
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return students.filter((student) => {
      const hasAnyRegistration =
        student.observations.length > 0 || student.note.trim().length > 0;
      const matchesPending = !showOnlyPending || !hasAnyRegistration;
      const matchesQuery =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.initials.toLowerCase().includes(query);

      return matchesPending && matchesQuery;
    });
  }, [students, searchQuery, showOnlyPending]);

  const registeredInVisibleList = useMemo(() => {
    return students.filter(
      (s) => s.observations.length > 0 || s.note.trim().length > 0
    ).length;
  }, [students]);

  const totalStudentsCount = lesson?.totalStudentsCount ?? 0;
  const registeredCount = Math.min(
    totalStudentsCount,
    (lesson?.preRegisteredCount ?? 0) + registeredInVisibleList
  );

  const selectedStudent: StudentLessonRecord | null = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find((s) => s.studentId === selectedStudentId) ?? null;
  }, [students, selectedStudentId]);

  const saveStudentDetail = useCallback(
    (payload: {
      observations: QuickObservationType[];
      note: string;
      achievedIds: string[];
    }) => {
      if (!lesson || !selectedStudentId) return;
      updateStudentDetail(lesson.id, selectedStudentId, payload);
      setSelectedStudentId(null);
    },
    [lesson, selectedStudentId, updateStudentDetail]
  );

  const completeLesson = useCallback(
    (summaryNote?: string) => {
      if (!lesson) return;
      finishLesson(lesson.id, elapsedMinutes, summaryNote);
    },
    [elapsedMinutes, finishLesson, lesson]
  );

  return {
    lesson,
    isPaused,
    elapsedMinutes,
    searchQuery,
    setSearchQuery,
    showOnlyPending,
    togglePause,
    togglePendingFilter,
    filteredStudents,
    registeredCount,
    totalStudentsCount,
    handleQuickObservation,
    selectedStudent,
    openStudentModal: setSelectedStudentId,
    closeStudentModal: () => setSelectedStudentId(null),
    saveStudentDetail,
    completeLesson,
  };
}
