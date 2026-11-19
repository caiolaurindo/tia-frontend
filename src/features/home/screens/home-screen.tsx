import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { AvatarInitials, Card, Icon, IconName } from "@/components/ui";
import { useAuth } from "@/contexts";
import { useAlunosContext } from "@/features/alunos";
import { useAulasContext } from "@/features/aulas";
import { useTurmasContext } from "@/features/turmas";
import { colors, radii, spacing } from "@/theme";

interface RecentRecordItem {
  id: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  timeLabel: string;
}

const RECENT_RECORDS: RecentRecordItem[] = [
  {
    id: "rec-1",
    icon: "trophy",
    iconBg: colors.tags.amber.bg,
    iconColor: colors.tags.amber.text,
    title: "Conquista de Marina",
    description: "Usou 'can' e 'can't' com autonomia.",
    timeLabel: "09:42",
  },
  {
    id: "rec-2",
    icon: "hand",
    iconBg: colors.brand.primaryLight,
    iconColor: colors.brand.primary,
    title: "João participou",
    description: "Contribuiu na prática oral em dupla.",
    timeLabel: "09:36",
  },
];

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { turmas } = useTurmasContext();
  const { alunos } = useAlunosContext();
  const { lessons } = useAulasContext();

  const firstName = user?.nome?.trim().split(/\s+/)[0] || "Carolina";
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

        <Pressable
          onPress={() => router.push("/registros/novo")}
          style={({ pressed }) => [
            styles.registerButton,
            pressed && styles.registerButtonPressed,
          ]}
          accessibilityRole="button"
        >
          <Icon name="plus" size={18} color={colors.text.inverse} />
          <Text style={styles.registerButtonText}>Registrar</Text>
        </Pressable>
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

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas aulas</Text>
          <Pressable onPress={() => router.push("/aulas")}>
            <Text style={styles.sectionLink}>Ver agenda</Text>
          </Pressable>
        </View>

        <View style={styles.nextLessonBox}>
          <View style={styles.nextLessonTimeCol}>
            <Text style={styles.nextLessonTime}>
              {nextLesson?.startTime ?? "10:30"}
            </Text>
            <Text style={styles.nextLessonDay}>HOJE</Text>
          </View>

          <View style={styles.nextLessonInfo}>
            <Text style={styles.nextLessonTitle} numberOfLines={2}>
              {nextLesson
                ? `${nextLesson.classGroup} · ${nextLesson.grade}`
                : "English Explorers · 6º A"}
            </Text>
            <Text style={styles.nextLessonMeta} numberOfLines={1}>
              {nextLesson
                ? `${nextLesson.title} · ${nextLesson.totalStudentsCount} alunos`
                : "Daily routines · 22 alunos"}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              if (nextLesson) {
                router.push({
                  pathname: "/aulas/[id]/acompanhamento",
                  params: { id: nextLesson.id },
                });
              } else {
                router.push("/aulas");
              }
            }}
            style={styles.followButton}
          >
            <Text style={styles.followButtonText}>Acompanhar</Text>
          </Pressable>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registros recentes</Text>
          <Pressable onPress={() => router.push("/relatorios" as Href)}>
            <Text style={styles.sectionLink}>Ver relatório</Text>
          </Pressable>
        </View>

        <View style={styles.timeline}>
          {RECENT_RECORDS.map((item, index) => {
            const isLast = index === RECENT_RECORDS.length - 1;
            return (
              <View key={item.id} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineIconCircle,
                      { backgroundColor: item.iconBg },
                    ]}
                  >
                    <Icon name={item.icon} size={16} color={item.iconColor} />
                  </View>
                  {!isLast ? <View style={styles.timelineLine} /> : null}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.timelineTitleRow}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineTime}>{item.timeLabel}</Text>
                  </View>
                  <Text style={styles.timelineDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          })}
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
  registerButton: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
  },
  registerButtonPressed: {
    backgroundColor: colors.brand.primaryPressed,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.inverse,
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
  timeline: {
    gap: spacing.xs,
  },
  timelineRow: {
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 58,
  },
  timelineLeft: {
    alignItems: "center",
    width: 36,
  },
  timelineIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.sm,
    gap: 2,
  },
  timelineTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    color: colors.text.placeholder,
  },
  timelineDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});
