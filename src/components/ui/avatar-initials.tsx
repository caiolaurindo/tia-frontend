import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radii, TagColorVariant } from "@/theme";

export interface AvatarInitialsProps {
  initials: string;
  variant?: TagColorVariant;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function AvatarInitials({
  initials,
  variant = "blue",
  size = 36,
  style,
}: AvatarInitialsProps) {
  const palette = colors.tags[variant];

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: radii.full,
          backgroundColor: palette.bg,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { color: palette.text }]}>
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
