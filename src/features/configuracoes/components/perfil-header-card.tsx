import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AvatarInitials, Badge, Card, Icon } from "@/components/ui";
import { colors, radii, spacing } from "@/theme";

export interface PerfilHeaderCardProps {
  nome: string;
  email: string;
  escola?: string;
  onEditPress: () => void;
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PerfilHeaderCard({
  nome,
  email,
  escola,
  onEditPress,
}: PerfilHeaderCardProps) {
  const initials = buildInitials(nome || "Professor");

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <AvatarInitials
          initials={initials}
          variant="purple"
          size={60}
          style={styles.avatar}
        />

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {nome || "Professor(a)"}
            </Text>
          </View>

          <Text style={styles.email} numberOfLines={1}>
            {email || "email@instituicao.com"}
          </Text>

          <View style={styles.badgeRow}>
            <Badge label="Docente de Inglês" variant="blue" />
            <Badge label="Conta Ativa" variant="green" />
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.institutionRow}>
        <View style={styles.institutionCol}>
          <Text style={styles.institutionLabel}>INSTITUIÇÃO / ESCOLA</Text>
          <Text style={styles.institutionValue}>
            {escola || "Não informada (toque para adicionar)"}
          </Text>
        </View>

        <Pressable
          onPress={onEditPress}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.editButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
        >
          <Icon name="edit" size={16} color={colors.brand.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    backgroundColor: colors.background.surface,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    borderWidth: 2,
    borderColor: colors.brand.primaryLight,
  },
  infoCol: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  email: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  badgeRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },
  institutionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  institutionCol: {
    flex: 1,
    gap: 2,
  },
  institutionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.placeholder,
    letterSpacing: 0.5,
  },
  institutionValue: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.primary,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.md,
    backgroundColor: colors.brand.primaryLight,
  },
  editButtonPressed: {
    opacity: 0.75,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.brand.primary,
  },
});
