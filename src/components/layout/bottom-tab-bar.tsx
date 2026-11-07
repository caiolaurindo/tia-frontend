import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon, IconName } from "@/components/ui";
import { colors, radii, shadows, spacing } from "@/theme";

export type BottomTabKey =
  | "inicio"
  | "turmas"
  | "registrar"
  | "alunos"
  | "conquistas";

export interface BottomTabBarProps {
  activeTab?: BottomTabKey;
  onTabPress?: (tab: BottomTabKey) => void;
  onPrimaryActionPress?: () => void;
}

interface TabItemConfig {
  key: BottomTabKey;
  label: string;
  icon: IconName;
  isPrimary?: boolean;
}

const TABS: TabItemConfig[] = [
  { key: "inicio", label: "Início", icon: "home" },
  { key: "turmas", label: "Turmas", icon: "groups" },
  { key: "registrar", label: "Registrar", icon: "plus", isPrimary: true },
  { key: "alunos", label: "Alunos", icon: "user" },
  { key: "conquistas", label: "Conquistas", icon: "trophy" },
];

export function BottomTabBar({
  activeTab = "registrar",
  onTabPress,
  onPrimaryActionPress,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((item) => {
        const isSelected = activeTab === item.key;

        if (item.isPrimary) {
          return (
            <Pressable
              key={item.key}
              onPress={() => {
                if (onPrimaryActionPress) {
                  onPrimaryActionPress();
                } else {
                  onTabPress?.(item.key);
                }
              }}
              style={styles.centerButtonWrapper}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.centerCircle}>
                <Icon name="plus" size={22} color={colors.text.inverse} />
              </View>
              <Text style={styles.centerLabel}>{item.label}</Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={item.key}
            onPress={() => onTabPress?.(item.key)}
            style={styles.tabItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
          >
            <Icon
              name={item.icon}
              size={20}
              color={isSelected ? colors.brand.primary : colors.text.placeholder}
            />
            <Text
              style={[
                styles.tabLabel,
                isSelected && styles.activeTabLabel,
              ]}
            >
              {item.label}
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
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.text.placeholder,
  },
  activeTabLabel: {
    color: colors.brand.primary,
    fontWeight: "600",
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -18,
    gap: 3,
  },
  centerCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.brand.primary,
  },
});
