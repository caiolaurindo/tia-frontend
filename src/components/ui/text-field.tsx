import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { colors, radii, spacing, typography } from "@/theme";
import { Icon, IconName } from "./icon";

export interface TextFieldProps extends Omit<TextInputProps, "style"> {
  label: string;
  leftIcon?: IconName;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
  isPassword?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  leftIcon,
  rightActionLabel,
  onRightActionPress,
  isPassword = false,
  error,
  containerStyle,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const secureTextEntry = isPassword && !isPasswordVisible;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {rightActionLabel ? (
          <Pressable
            onPress={onRightActionPress}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text style={styles.rightActionText}>{rightActionLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          Boolean(error) && styles.inputContainerError,
        ]}
      >
        {leftIcon ? (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? colors.icon.focused : colors.icon.default}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? "Ocultar senha" : "Mostrar senha"
            }
            style={styles.rightIconButton}
          >
            <Icon
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={colors.icon.default}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
  },
  rightActionText: {
    ...typography.linkSmall,
    color: colors.text.link,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.xl,
    height: 54,
    paddingHorizontal: spacing.lg,
  },
  inputContainerFocused: {
    borderColor: colors.border.focused,
  },
  inputContainerError: {
    borderColor: colors.border.error,
  },
  leftIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.input,
    color: colors.text.primary,
    height: "100%",
    paddingVertical: 0,
  },
  rightIconButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.status.error,
    marginTop: spacing.xs,
  },
});
