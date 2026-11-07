import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radii, spacing, typography } from "@/theme";

export interface InfoBannerProps {
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function InfoBanner({ message, style }: InfoBannerProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.infoBanner,
    borderRadius: radii.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    ...typography.banner,
    color: colors.text.banner,
    textAlign: "center",
  },
});
