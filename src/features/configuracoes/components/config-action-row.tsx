import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon, IconName } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";

export interface ConfigActionRowProps {
  icon?: IconName;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  valueLabel?: string;
  onPress: () => void;
  showDivider?: boolean;
  destructive?: boolean;
}

export function ConfigActionRow({
  icon,
  iconBg = colors.background.subtle,
  iconColor = colors.icon.default,
  title,
  subtitle,
  valueLabel,
  onPress,
  showDivider = true,
  destructive = false,
}: ConfigActionRowProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.containerPressed,
        ]}
        accessibilityRole="button"
      >
        {icon ? (
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: destructive
                  ? colors.background.dangerSoft
                  : iconBg,
              },
            ]}
          >
            <Icon
              name={icon}
              size={18}
              color={destructive ? colors.text.danger : iconColor}
            />
          </View>
        ) : null}

        <View style={styles.textCol}>
          <Text
            style={[
              styles.title,
              destructive && { color: colors.text.danger },
            ]}
          >
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {valueLabel ? (
          <Text style={styles.valueLabel}>{valueLabel}</Text>
        ) : null}

        <Icon
          name="chevron-right"
          size={16}
          color={destructive ? colors.text.danger : colors.text.placeholder}
        />
      </Pressable>

      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  containerPressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  valueLabel: {
    fontSize: 13,
    color: colors.text.placeholder,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },
});
