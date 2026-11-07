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

  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(
    lesson.elapsedMinutes || 32
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
      toggleStudentObservation(lesson.id, studentId, type);
    },
    [lesson.id, toggleStudentObservation]
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return lesson.students.filter((student) => {
      const hasAnyRegistration =
        student.observations.length > 0 || student.note.trim().length > 0;
      const matchesPending = !showOnlyPending || !hasAnyRegistration;
      const matchesQuery =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.initials.toLowerCase().includes(query);

      return matchesPending && matchesQuery;
    });
  }, [lesson.students, searchQuery, showOnlyPending]);

  const registeredInVisibleList = useMemo(() => {
    return lesson.students.filter(
      (s) => s.observations.length > 0 || s.note.trim().length > 0
    ).length;
  }, [lesson.students]);

  const registeredCount = Math.min(
    lesson.totalStudentsCount,
    lesson.preRegisteredCount + registeredInVisibleList
  );

  const selectedStudent: StudentLessonRecord | null = useMemo(() => {
    if (!selectedStudentId) return null;
    return (
      lesson.students.find((s) => s.studentId === selectedStudentId) ?? null
    );
  }, [lesson.students, selectedStudentId]);

  const saveStudentDetail = useCallback(
    (payload: {
      observations: QuickObservationType[];
      note: string;
      achievedIds: string[];
    }) => {
      if (!selectedStudentId) return;
      updateStudentDetail(lesson.id, selectedStudentId, payload);
      setSelectedStudentId(null);
    },
    [lesson.id, selectedStudentId, updateStudentDetail]
  );

  const completeLesson = useCallback(
    (summaryNote?: string) => {
      finishLesson(lesson.id, elapsedMinutes, summaryNote);
    },
    [elapsedMinutes, finishLesson, lesson.id]
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
    totalStudentsCount: lesson.totalStudentsCount,
    handleQuickObservation,
    selectedStudent,
    openStudentModal: setSelectedStudentId,
    closeStudentModal: () => setSelectedStudentId(null),
    saveStudentDetail,
    completeLesson,
  };
}
