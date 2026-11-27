import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Href, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "@/contexts";
import { AlunosProvider } from "@/features/alunos";
import { AulasProvider } from "@/features/aulas";
import { ConquistasProvider } from "@/features/conquistas";
import { TurmasProvider } from "@/features/turmas";

import { colors } from "@/theme";

/**
 * Bloqueia o acesso às telas internas sem login:
 * - sem sessão → volta para a tela de login ("/");
 * - com sessão na tela de login/cadastro → vai para a home.
 */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRestoringSession } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Rotas públicas: "/" (index → login) e o grupo (auth) (login/cadastro).
  const firstSegment = segments[0] as string | undefined;
  const isPublicRoute = !firstSegment || firstSegment === "(auth)";

  useEffect(() => {
    if (isRestoringSession) return;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/");
    } else if (isAuthenticated && isPublicRoute) {
      router.replace("/home" as Href);
    }
  }, [isAuthenticated, isPublicRoute, isRestoringSession, router]);

  // Evita mostrar telas protegidas (ou a tela de login) enquanto a sessão
  // salva ainda está sendo verificada ou o redirecionamento não aconteceu.
  const shouldHold =
    isRestoringSession ||
    (!isAuthenticated && !isPublicRoute) ||
    (isAuthenticated && isPublicRoute);

  return (
    <>
      {children}
      {shouldHold ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
        </View>
      ) : null}
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TurmasProvider>
        <AlunosProvider>
          <ConquistasProvider>
            <AulasProvider>
              <StatusBar style="dark" />

              <AuthGate>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: colors.background.primary,
                    },
                  }}
                />
              </AuthGate>
            </AulasProvider>
          </ConquistasProvider>
        </AlunosProvider>
      </TurmasProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.primary,
  },
});
