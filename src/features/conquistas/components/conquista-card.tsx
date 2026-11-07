import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card, Icon } from "@/components/ui";
import { colors, spacing } from "@/theme";
import { CATEGORIA_LABEL } from "../data/conquistas-options";
import { Conquista, TurmaFiltro } from "../types/conquistas.types";
import { getProgresso, getTotalAlunos } from "../utils/conquistas-progress";
import { ConquistaProgressBar } from "./conquista-progress-bar";

export interface ConquistaCardProps {
  conquista: Conquista;
  turma: TurmaFiltro;
  onPress: (conquista: Conquista) => void;
  onMorePress: (conquista: Conquista) => void;
}

export function ConquistaCard({
  conquista,
  turma,
  onPress,
  onMorePress,
}: ConquistaCardProps) {
  const progresso = getProgresso(conquista, turma);
  const total = getTotalAlunos(progresso);
  const meta = [CATEGORIA_LABEL[conquista.categoria], conquista.nivel]
    .filter(Boolean)
    .join(" · ");

  return (
    <Pressable
      onPress={() => onPress(conquista)}
      accessibilityRole="button"
      accessibilityLabel={`${conquista.nome}. ${progresso.conquistado} de ${total} conquistaram`}
    >
      <Card>
        <View style={styles.top}>
          <View style={styles.iconBox}>
            <Icon name="trophy" size={20} color={colors.brand.primary} />
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{conquista.nome}</Text>
            <Text style={styles.meta}>{meta}</Text>
          </View>

          <View style={styles.score}>
            <Text style={styles.scoreValue}>
              {progresso.conquistado} de {total}
            </Text>
            <Text style={styles.scoreLabel}>conquistaram</Text>
          </View>

          <Pressable
            onPress={() => onMorePress(conquista)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Mais opções de ${conquista.nome}`}
            style={styles.more}
          >
            <Icon
              name="more"
              size={18}
              color={colors.icon.default}
              style={styles.moreIcon}
            />
          </Pressable>
        </View>

        <ConquistaProgressBar progresso={progresso} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.brand.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, minWidth: 0 },
  name: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 19,
    color: colors.text.primary,
  },
  meta: { fontSize: 12, color: colors.text.secondary, marginTop: 3 },
  score: { alignItems: "flex-end" },
  scoreValue: { fontSize: 17, fontWeight: "800", color: colors.text.primary },
  scoreLabel: { fontSize: 11, color: colors.text.secondary },
  moreIcon: { transform: [{ rotate: "90deg" }] },
  more: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -spacing.sm,
  },
});
