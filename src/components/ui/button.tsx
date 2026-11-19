import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, radii, shadows, typography } from "@/theme";
import { Icon, IconName } from "./icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  leftIcon?: IconName;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  variant = "primary",
  leftIcon,
  isLoading = false,
  disabled,
  style,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const iconColor =
    variant === "primary"
      ? colors.text.inverse
      : variant === "danger"
      ? colors.text.danger
      : colors.brand.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: isLoading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "danger" && styles.danger,
        pressed && !isDisabled && variant === "primary" && styles.primaryPressed,
        pressed && !isDisabled && variant === "danger" && styles.dangerPressed,
        pressed && !isDisabled && variant !== "primary" && variant !== "danger" && styles.otherPressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === "primary"
              ? colors.text.inverse
              : variant === "danger"
              ? colors.text.danger
              : colors.brand.primary
          }
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? (
            <Icon name={leftIcon} size={18} color={iconColor} style={styles.leftIcon} />
          ) : null}
          <Text
            style={[
              styles.text,
              variant === "primary" && styles.primaryText,
              variant === "secondary" && styles.secondaryText,
              variant === "ghost" && styles.secondaryText,
              variant === "danger" && styles.dangerText,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radii.xl,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
  primary: {
    backgroundColor: colors.brand.primary,
    ...shadows.button,
  },
  primaryPressed: {
    backgroundColor: colors.brand.primaryPressed,
  },
  secondary: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: colors.background.dangerSoft,
    borderWidth: 1,
    borderColor: colors.border.error,
  },
  dangerPressed: {
    backgroundColor: "#FBD6D3",
  },
  otherPressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    ...typography.button,
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  dangerText: {
    color: colors.text.danger,
    fontWeight: "700",
  },
});
