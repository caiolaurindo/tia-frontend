import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, radii, shadows, spacing, typography } from "@/theme";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, style]} accessibilityRole="tablist">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={[styles.tab, isSelected && styles.activeTab]}
          >
            <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.background.muted,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: colors.brand.navy,
    ...shadows.sm,
  },
  tabText: {
    ...typography.tab,
    color: colors.text.secondary,
  },
  activeTabText: {
    ...typography.tabActive,
    color: colors.text.inverse,
  },
});
