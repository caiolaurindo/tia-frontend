import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/contexts";
import { AulasProvider } from "@/features/aulas";
import { ConquistasProvider } from "@/features/conquistas";
import { TurmasProvider } from "@/features/turmas";

import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TurmasProvider>
        <ConquistasProvider>
          <AulasProvider>
            <StatusBar style="dark" />

            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: colors.background.primary,
                },
              }}
            />
          </AulasProvider>
        </ConquistasProvider>
      </TurmasProvider>
    </AuthProvider>
  );
}
