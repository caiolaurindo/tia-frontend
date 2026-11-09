import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AulasProvider } from "@/features/aulas";
import { TurmasProvider } from "@/features/turmas";

import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <AulasProvider>
      <TurmasProvider>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background.primary,
            },
          }}
        />
      </TurmasProvider>
    </AulasProvider>
  );
}