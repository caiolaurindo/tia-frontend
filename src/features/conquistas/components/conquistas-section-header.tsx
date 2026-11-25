import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export interface ConquistasSectionHeaderProps {
  title: string;
  count: number;
}

export function ConquistasSectionHeader({
  title,
  count,
}: ConquistasSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.count}>
        {count} {count === 1 ? "conquista" : "conquistas"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  count: { fontSize: 13, color: colors.text.secondary },
});
