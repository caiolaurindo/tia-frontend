import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Icon } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";

const TIA_ICON_LOGO = require("../../../public/ID-VISUAL-TIA/Group 6.svg");

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
          style={styles.logoButton}
          accessibilityRole="button"
          accessibilityLabel="TIA Início"
        >
          <Image
            source={TIA_ICON_LOGO}
            style={styles.logoImage}
            contentFit="contain"
          />
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
  logoButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 38,
    height: 38,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
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
    backgroundColor: colors.brand.coral,
  },
});
