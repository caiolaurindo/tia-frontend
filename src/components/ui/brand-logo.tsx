import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { colors, spacing, typography } from "@/theme";

const TIA_ICON_LOGO = require("../../../public/ID-VISUAL-TIA/Group 6.svg");

export interface BrandLogoProps {
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export function BrandLogo({ style, size = 48 }: BrandLogoProps) {
  return (
    <View style={[styles.container, style]} accessibilityRole="header">
      <Image
        source={TIA_ICON_LOGO}
        style={{ width: size, height: size }}
        contentFit="contain"
        accessibilityLabel="Logo da TIA"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>TIA</Text>
        <Text style={styles.subtitle}>Teaching Intelligent Assistant</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  textContainer: {
    justifyContent: "center",
  },
  title: {
    ...typography.brandTitle,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.brandSubtitle,
    color: colors.text.secondary,
    marginTop: 1,
  },
});
