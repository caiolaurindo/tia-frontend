import React from "react";
import { Stack } from "expo-router";
import { ConquistasProvider } from "@/features/conquistas";
import { colors } from "@/theme";

export default function ConquistasLayout() {
  return (
    <ConquistasProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      />
    </ConquistasProvider>
  );
}
