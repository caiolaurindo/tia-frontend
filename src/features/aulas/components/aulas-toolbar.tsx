import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";
import { AulasViewMode } from "../types/aulas.types";

export interface AulasToolbarProps {
  viewMode: AulasViewMode;
  onViewModeChange: (mode: AulasViewMode) => void;
  weekRangeLabel: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function AulasToolbar({
  viewMode,
  onViewModeChange,
  weekRangeLabel,
  canGoPrev,
  canGoNext,
  onPrevWeek,
  onNextWeek,
}: AulasToolbarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.modeGroup}>
        <Pressable
          onPress={() => onViewModeChange("lista")}
          style={[
            styles.modeButton,
            viewMode === "lista" && styles.modeButtonActive,
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: viewMode === "lista" }}
        >
          <Text
            style={[
              styles.modeText,
              viewMode === "lista" && styles.modeTextActive,
            ]}
          >
            Lista
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onViewModeChange("calendario")}
          style={[
            styles.modeButton,
            viewMode === "calendario" && styles.modeButtonActive,
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: viewMode === "calendario" }}
        >
          <Text
            style={[
              styles.modeText,
              viewMode === "calendario" && styles.modeTextActive,
            ]}
          >
            Calendário
          </Text>
        </Pressable>
      </View>

      <View style={styles.dateSelector}>
        <Pressable
          onPress={onPrevWeek}
          disabled={!canGoPrev}
          style={[styles.arrowBtn, !canGoPrev && styles.arrowBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Semana anterior"
        >
          <Icon name="chevron-left" size={16} color={colors.text.primary} />
        </Pressable>

        <Text style={styles.dateRangeText}>{weekRangeLabel}</Text>

        <Pressable
          onPress={onNextWeek}
          disabled={!canGoNext}
          style={[styles.arrowBtn, !canGoNext && styles.arrowBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Próxima semana"
        >
          <Icon name="chevron-right" size={16} color={colors.text.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  modeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  modeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radii.lg,
  },
  modeButtonActive: {
    backgroundColor: colors.brand.primarySoft,
  },
  modeText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  modeTextActive: {
    fontWeight: "700",
    color: colors.brand.primary,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowBtnDisabled: {
    opacity: 0.4,
  },
  dateRangeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary,
  },
});
