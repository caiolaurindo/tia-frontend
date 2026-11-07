import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AulasProvider } from "@/features/aulas";
import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <AulasProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      />
    </AulasProvider>
  );
}
