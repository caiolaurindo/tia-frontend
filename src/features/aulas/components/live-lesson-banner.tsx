import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/ui";
import { colors, radii, shadows, spacing } from "@/theme";

export interface LiveLessonBannerProps {
  title: string;
  classGroup: string;
  elapsedMinutes: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onFinishLesson: () => void;
}

export function LiveLessonBanner({
  title,
  classGroup,
  elapsedMinutes,
  isPaused,
  onTogglePause,
  onFinishLesson,
}: LiveLessonBannerProps) {
  const shortTitle = title.split("&")[0].trim();

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View
          style={[
            styles.liveDot,
            isPaused ? styles.pausedDot : styles.activeDot,
          ]}
        />
        <Text style={styles.statusText}>
          {isPaused ? "AULA PAUSADA" : "AULA EM ANDAMENTO"} · {elapsedMinutes}{" "}
          min
        </Text>
      </View>

      <Text style={styles.titleText}>
        {shortTitle} · {classGroup}
      </Text>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={onTogglePause}
          style={({ pressed }) => [
            styles.pauseButton,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={isPaused ? "Retomar aula" : "Pausar aula"}
        >
          <Icon
            name={isPaused ? "play" : "pause"}
            size={15}
            color={colors.text.primary}
          />
          <Text style={styles.pauseButtonText}>
            {isPaused ? "Retomar" : "Pausar"}
          </Text>
        </Pressable>

        <Pressable
          onPress={onFinishLesson}
          style={({ pressed }) => [
            styles.finishButton,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Encerrar aula"
        >
          <Text style={styles.finishButtonText}>Encerrar aula</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand.navy,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadows.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
  activeDot: {
    backgroundColor: colors.brand.yellow,
  },
  pausedDot: {
    backgroundColor: colors.brand.coral,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.85)",
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    color: colors.text.inverse,
    marginBottom: spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pauseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.lg,
    gap: 6,
  },
  pauseButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary,
  },
  finishButton: {
    backgroundColor: colors.background.dangerSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.lg,
  },
  finishButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.danger,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
