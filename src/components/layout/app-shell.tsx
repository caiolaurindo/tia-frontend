import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme";
import { AppHeader } from "./app-header";
import { BottomTabBar, BottomTabKey } from "./bottom-tab-bar";

export interface AppShellProps {
  title: string;
  children: React.ReactNode;
  onBackPress?: () => void;
  onLogoPress?: () => void;
  activeTab?: BottomTabKey;
  onTabPress?: (tab: BottomTabKey) => void;
  onPrimaryActionPress?: () => void;
  showBottomBar?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function AppShell({
  title,
  children,
  onBackPress,
  onLogoPress,
  activeTab = "registrar",
  onTabPress,
  onPrimaryActionPress,
  showBottomBar = true,
  contentContainerStyle,
}: AppShellProps) {
  const router = useRouter();

  const handleTabPress = (tab: BottomTabKey) => {
    if (onTabPress) {
      onTabPress(tab);
      return;
    }

    if (tab === activeTab) return;

    // As demais abas entram aqui conforme as telas forem sendo criadas.
    if (tab === "conquistas") {
      router.push("/conquistas");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.frame}>
        <AppHeader
          title={title}
          onBackPress={onBackPress}
          onLogoPress={onLogoPress}
        />

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>

        {showBottomBar ? (
          <BottomTabBar
            activeTab={activeTab}
            onTabPress={handleTabPress}
            onPrimaryActionPress={onPrimaryActionPress}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
});
