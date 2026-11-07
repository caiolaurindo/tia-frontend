import { useCallback, useMemo, useState } from "react";
import { useAulasContext } from "../context/aulas-context";
import { WEEK_RANGES } from "../data/mock-aulas";
import { AulasViewMode } from "../types/aulas.types";

export function useAulasSchedule() {
  const { lessons, selectedLessonId, selectLesson } = useAulasContext();

  const [viewMode, setViewMode] = useState<AulasViewMode>("lista");
  const [weekIndex, setWeekIndex] = useState(1); // "28 set - 04 out"
  const [selectedDay, setSelectedDay] = useState(4); // Sexta (02 out)
  const [classFilter, setClassFilter] = useState<string>("todas");

  const currentWeek = WEEK_RANGES[weekIndex] ?? WEEK_RANGES[1];

  const handlePrevWeek = useCallback(() => {
    setWeekIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekIndex((prev) => Math.min(WEEK_RANGES.length - 1, prev + 1));
  }, []);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesClass =
        classFilter === "todas" || lesson.classGroup === classFilter;
      const matchesDay =
        viewMode === "lista" ? lesson.dayOfWeek === 4 : lesson.dayOfWeek === selectedDay;

      return matchesClass && matchesDay;
    });
  }, [lessons, classFilter, viewMode, selectedDay]);

  const highlightedLesson = useMemo(() => {
    return (
      lessons.find((item) => item.id === selectedLessonId) ??
      filteredLessons[0] ??
      lessons[0]
    );
  }, [lessons, selectedLessonId, filteredLessons]);

  return {
    viewMode,
    setViewMode,
    currentWeek,
    canGoPrevWeek: weekIndex > 0,
    canGoNextWeek: weekIndex < WEEK_RANGES.length - 1,
    handlePrevWeek,
    handleNextWeek,
    selectedDay,
    setSelectedDay,
    classFilter,
    setClassFilter,
    filteredLessons,
    highlightedLesson,
    selectLesson,
  };
}
