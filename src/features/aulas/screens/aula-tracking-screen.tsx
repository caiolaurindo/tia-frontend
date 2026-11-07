import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { Card, Icon, SearchBar } from "@/components/ui";
import { colors, spacing } from "@/theme";
import { LiveLessonBanner } from "../components/live-lesson-banner";
import { StudentObservationModal } from "../components/student-observation-modal";
import { StudentTrackingRow } from "../components/student-tracking-row";
import { TrackingProgressBar } from "../components/tracking-progress-bar";
import { useLessonTracking } from "../hooks/use-lesson-tracking";

export function AulaTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const {
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
    openStudentModal,
    closeStudentModal,
    saveStudentDetail,
    completeLesson,
  } = useLessonTracking(params.id);

  const handleFinishLesson = () => {
    completeLesson();
    router.push({
      pathname: "/aulas/[id]/resumo",
      params: { id: lesson.id },
    });
  };

  return (
    <AppShell
      title="Acompanhamento da aula"
      onBackPress={() => router.back()}
      onLogoPress={() => router.push("/aulas")}
      activeTab="registrar"
    >
      <LiveLessonBanner
        title={lesson.title}
        classGroup={lesson.classGroup}
        elapsedMinutes={elapsedMinutes}
        isPaused={isPaused}
        onTogglePause={togglePause}
        onFinishLesson={handleFinishLesson}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar aluno..."
      />

      <Card style={styles.studentsCard}>
        <View style={styles.legendRow}>
          <Text style={styles.legendHint}>
            Toque nos ícones para registrar ou no aluno para detalhar
          </Text>
        </View>

        {filteredStudents.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {showOnlyPending
                ? "Todos os alunos listados já foram registrados!"
                : "Nenhum aluno encontrado para esta busca."}
            </Text>
            {showOnlyPending ? (
              <Pressable onPress={togglePendingFilter} style={styles.resetBtn}>
                <Icon name="check" size={15} color={colors.brand.primary} />
                <Text style={styles.resetBtnText}>Mostrar todos os alunos</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.studentsList}>
            {filteredStudents.map((student) => (
              <StudentTrackingRow
                key={student.studentId}
                student={student}
                onToggleObservation={handleQuickObservation}
                onPressStudent={openStudentModal}
              />
            ))}
          </View>
        )}
      </Card>

      <TrackingProgressBar
        registeredCount={registeredCount}
        totalCount={totalStudentsCount}
        showOnlyPending={showOnlyPending}
        onTogglePending={togglePendingFilter}
      />

      <StudentObservationModal
        visible={Boolean(selectedStudent)}
        student={selectedStudent}
        lessonAchievements={lesson.achievements}
        onClose={closeStudentModal}
        onSave={saveStudentDetail}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  studentsCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  legendRow: {
    paddingHorizontal: spacing.xs,
    paddingBottom: 2,
  },
  legendHint: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  studentsList: {
    gap: spacing.sm,
  },
  emptyBox: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: "center",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.brand.primary,
  },
});
