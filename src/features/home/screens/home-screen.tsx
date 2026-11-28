import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { AvatarInitials, Card, Icon } from "@/components/ui";
import { useAuth } from "@/contexts";
import { useAlunosContext } from "@/features/alunos";
import { useAulasContext } from "@/features/aulas";
import { useConquistasContext } from "@/features/conquistas";
import { useTurmasContext } from "@/features/turmas";
import { colors, radii, spacing } from "@/theme";
export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { turmas } = useTurmasContext();
  const { alunos } = useAlunosContext();
  const { lessons } = useAulasContext();
  const { conquistas } = useConquistasContext();

  const firstName = user?.nome?.trim().split(/\s+/)[0] || "Professor";
  const nextLesson = lessons[0];

  return (
    <AppShell title="Dashboard" activeTab="inicio">
      <View style={styles.greetingBlock}>
        <View style={styles.greetingHeaderRow}>
          <View style={styles.greetingTextCol}>
            <Text style={styles.greetingTitle}>Olá, {firstName}! 👋</Text>
            <Text style={styles.greetingSubtitle}>
              Aqui está o que está acontecendo com suas turmas hoje.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/configuracoes" as Href)}
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.avatarButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Ver perfil e configurações"
          >
            <AvatarInitials
              initials={
                user?.nome
                  ? user.nome.slice(0, 2).toUpperCase()
                  : firstName.slice(0, 2).toUpperCase()
              }
              variant="purple"
              size={42}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <Pressable
          onPress={() => router.push("/turmas")}
          style={styles.kpiPressable}
        >
          <Card style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>TURMAS</Text>
              <View
                style={[
                  styles.kpiIconBox,
                  { backgroundColor: colors.brand.primaryLight },
                ]}
              >
                <Icon name="groups" size={16} color={colors.brand.primary} />
              </View>
            </View>
            <Text style={styles.kpiValue}>{turmas.length}</Text>
          </Card>
        </Pressable>

        <Pressable
          onPress={() => router.push("/alunos" as Href)}
          style={styles.kpiPressable}
        >
          <Card style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>ALUNOS</Text>
              <View
                style={[
                  styles.kpiIconBox,
                  { backgroundColor: colors.brand.primaryLight },
                ]}
              >
                <Icon name="user" size={16} color={colors.brand.primary} />
              </View>
            </View>
            <Text style={styles.kpiValue}>{alunos.length}</Text>
          </Card>
        </Pressable>
      </View>

      <View style={styles.kpiRow}>
        <Pressable
          onPress={() => router.push("/aulas")}
          style={styles.kpiPressable}
        >
          <Card style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>AULAS</Text>
              <View
                style={[
                  styles.kpiIconBox,
                  { backgroundColor: colors.tags.amber.bg },
                ]}
              >
                <Icon name="calendar" size={16} color={colors.tags.amber.text} />
              </View>
            </View>
            <Text style={styles.kpiValue}>{lessons.length}</Text>
          </Card>
        </Pressable>

        <Pressable
          onPress={() => router.push("/conquistas" as Href)}
          style={styles.kpiPressable}
        >
          <Card style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>CONQUISTAS</Text>
              <View
                style={[
                  styles.kpiIconBox,
                  { backgroundColor: colors.tags.amber.bg },
                ]}
              >
                <Icon name="trophy" size={16} color={colors.tags.amber.text} />
              </View>
            </View>
            <Text style={styles.kpiValue}>{conquistas.length}</Text>
          </Card>
        </Pressable>
      </View>

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas aulas</Text>
          <Pressable onPress={() => router.push("/aulas")}>
            <Text style={styles.sectionLink}>Ver agenda</Text>
          </Pressable>
        </View>

        {nextLesson ? (
          <View style={styles.nextLessonBox}>
            <View style={styles.nextLessonTimeCol}>
              <Text style={styles.nextLessonTime}>
                {nextLesson.startTime}
              </Text>
              <Text style={styles.nextLessonDay}>HOJE</Text>
            </View>

            <View style={styles.nextLessonInfo}>
              <Text style={styles.nextLessonTitle} numberOfLines={2}>
                {nextLesson.classGroup} · {nextLesson.grade}
              </Text>
              <Text style={styles.nextLessonMeta} numberOfLines={1}>
                {nextLesson.title} · {nextLesson.totalStudentsCount} alunos
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/aulas/[id]/acompanhamento",
                  params: { id: nextLesson.id },
                })
              }
              style={styles.followButton}
            >
              <Text style={styles.followButtonText}>Acompanhar</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyStateBox}>
            <Icon name="calendar" size={24} color={colors.text.placeholder} />
            <Text style={styles.emptyStateText}>
              Nenhuma aula programada para hoje.
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registros recentes</Text>
          <Pressable onPress={() => router.push("/relatorios" as Href)}>
            <Text style={styles.sectionLink}>Ver relatório</Text>
          </Pressable>
        </View>

        <View style={styles.emptyStateBox}>
          <Icon name="list" size={24} color={colors.text.placeholder} />
          <Text style={styles.emptyStateText}>
            Nenhum registro recente encontrado.
          </Text>
        </View>
      </Card>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  greetingBlock: {
    gap: spacing.xs,
  },
  greetingHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  greetingTextCol: {
    flex: 1,
    gap: 2,
  },
  avatarButton: {
    padding: 2,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.brand.primaryLight,
  },
  avatarButtonPressed: {
    opacity: 0.75,
  },
  greetingTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  kpiRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  kpiPressable: {
    flex: 1,
  },
  kpiCard: {
    gap: spacing.sm,
  },
  kpiHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: colors.text.secondary,
  },
  kpiIconBox: {
    width: 30,
    height: 30,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text.primary,
  },
  sectionCard: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text.primary,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.brand.primary,
  },
  nextLessonBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.brand.primarySoft,
  },
  nextLessonTimeCol: {
    alignItems: "flex-start",
    minWidth: 48,
  },
  nextLessonTime: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.brand.primary,
  },
  nextLessonDay: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.brand.primary,
    letterSpacing: 0.5,
  },
  nextLessonInfo: {
    flex: 1,
    gap: 2,
  },
  nextLessonTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  nextLessonMeta: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  followButton: {
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.inverse,
  },
  emptyStateBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.text.placeholder,
    textAlign: "center",
  },
});
