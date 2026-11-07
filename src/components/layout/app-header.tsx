import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";

export interface AppHeaderProps {
  title: string;
  onBackPress?: () => void;
  onLogoPress?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotifications?: boolean;
}

export function AppHeader({
  title,
  onBackPress,
  onLogoPress,
  onNotificationPress,
  hasUnreadNotifications = false,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {onBackPress ? (
          <Pressable
            onPress={onBackPress}
            hitSlop={8}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Icon name="arrow-left" size={20} color={colors.text.primary} />
          </Pressable>
        ) : null}

        <Pressable
          onPress={onLogoPress}
          disabled={!onLogoPress}
          style={styles.logoBadge}
          accessibilityRole="button"
          accessibilityLabel="TIA Início"
        >
          <Text style={styles.logoLetter}>T</Text>
        </Pressable>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <Pressable
        onPress={onNotificationPress}
        hitSlop={8}
        style={styles.notificationButton}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
      >
        <Icon name="bell" size={18} color={colors.icon.default} />
        {hasUnreadNotifications ? <View style={styles.unreadDot} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 40,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: radii.full,
    backgroundColor: colors.background.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: radii.lg,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: "800",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    paddingHorizontal: spacing.sm,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.background.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: radii.full,
    backgroundColor: colors.status.error,
  },
});
