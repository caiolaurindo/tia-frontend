import React from "react";
import { useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { AulasCalendarStrip } from "../components/aulas-calendar-strip";
import { AulasPageHeader } from "../components/aulas-page-header";
import { AulasToolbar } from "../components/aulas-toolbar";
import { NextLessonCard } from "../components/next-lesson-card";
import { TodayScheduleCard } from "../components/today-schedule-card";
import { useAulasContext } from "../context/aulas-context";
import { useAulasSchedule } from "../hooks/use-aulas-schedule";
import { LessonItem } from "../types/aulas.types";

export function AulasListScreen() {
  const router = useRouter();
  const { startLesson } = useAulasContext();
  const {
    viewMode,
    setViewMode,
    currentWeek,
    canGoPrevWeek,
    canGoNextWeek,
    handlePrevWeek,
    handleNextWeek,
    selectedDay,
    setSelectedDay,
    classFilter,
    setClassFilter,
    filteredLessons,
    highlightedLesson,
    selectLesson,
  } = useAulasSchedule();

  const handleOpenNewLesson = () => {
    router.push("/aulas/nova");
  };

  const handleStartTracking = (lesson: LessonItem) => {
    startLesson(lesson.id);
    router.push({
      pathname: "/aulas/[id]/acompanhamento",
      params: { id: lesson.id },
    });
  };

  const handleEditLesson = (lesson: LessonItem) => {
    selectLesson(lesson.id);
    router.push({
      pathname: "/aulas/[id]/editar",
      params: { id: lesson.id },
    });
  };

  const handleViewSummary = (lesson: LessonItem) => {
    selectLesson(lesson.id);
    router.push({
      pathname: "/aulas/[id]/resumo",
      params: { id: lesson.id },
    });
  };

  return (
    <AppShell
      title="Aulas"
      activeTab="registrar"
      onPrimaryActionPress={() => handleStartTracking(highlightedLesson)}
    >
      <AulasPageHeader onNewLessonPress={handleOpenNewLesson} />

      <AulasToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        weekRangeLabel={currentWeek.label}
        canGoPrev={canGoPrevWeek}
        canGoNext={canGoNextWeek}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />

      {viewMode === "calendario" ? (
        <AulasCalendarStrip
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          classFilter={classFilter}
          onSelectClassFilter={setClassFilter}
        />
      ) : null}

      <TodayScheduleCard
        dateTitle={currentWeek.dateTitle}
        lessons={filteredLessons}
        selectedLessonId={highlightedLesson.id}
        onSelectLesson={(lesson) => selectLesson(lesson.id)}
      />

      {highlightedLesson ? (
        <NextLessonCard
          lesson={highlightedLesson}
          onStartTracking={handleStartTracking}
          onEditLesson={handleEditLesson}
          onViewSummary={handleViewSummary}
        />
      ) : null}
    </AppShell>
  );
}
