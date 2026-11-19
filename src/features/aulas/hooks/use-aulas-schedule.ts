import { useCallback, useMemo, useState } from "react";
import { useAulasContext } from "../context/aulas-context";
import { AulasViewMode } from "../types/aulas.types";

const WEEK_RANGES = [
  { id: "w1", label: "Semana anterior", dateTitle: "Aulas planejadas" },
  { id: "w2", label: "Semana atual", dateTitle: "Aulas planejadas" },
  { id: "w3", label: "Próxima semana", dateTitle: "Aulas planejadas" },
];

export function useAulasSchedule() {
  const { lessons, selectedLessonId, selectLesson, isLoading, error, refreshLessons } = useAulasContext();

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
        viewMode === "lista" ? true : lesson.dayOfWeek === selectedDay;

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
    isLoading,
    error,
    refreshLessons,
  };
}
