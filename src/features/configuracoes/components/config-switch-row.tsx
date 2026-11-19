import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Icon, IconName } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";

export interface ConfigSwitchRowProps {
  icon?: IconName;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  showDivider?: boolean;
}

export function ConfigSwitchRow({
  icon,
  iconBg = colors.brand.primaryLight,
  iconColor = colors.brand.primary,
  title,
  description,
  value,
  onValueChange,
  showDivider = true,
}: ConfigSwitchRowProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {icon ? (
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            <Icon name={icon} size={18} color={iconColor} />
          </View>
        ) : null}

        <View style={styles.textCol}>
          <Text style={styles.title}>{title}</Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>

        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: colors.border.default,
            true: colors.brand.primary,
          }}
          thumbColor={colors.background.surface}
        />
      </View>

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
  description: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },
});
