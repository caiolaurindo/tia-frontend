import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarInitials, Badge, Icon } from "@/components/ui";
import { useAlunosContext } from "@/features/alunos";
import type { AlunoItem } from "@/features/alunos/types/alunos.types";
import { alunoConquistaService, StatusConquistaApi } from "@/services";
import { colors, radii, spacing, TagColorVariant } from "@/theme";
import { useConquistasContext } from "../context/conquistas-context";
import { CATEGORIA_LABEL, TURMA_TODAS } from "../data/conquistas-options";
import { Conquista, TurmaFiltro } from "../types/conquistas.types";

const STATUS_BADGE: Record<
  StatusConquistaApi,
  { label: string; variant: TagColorVariant; order: number }
> = {
  CONQUISTADO: { label: "Conquistado", variant: "green", order: 0 },
  EM_DESENVOLVIMENTO_AVANCADO: { label: "Avançando", variant: "blue", order: 1 },
  EM_DESENVOLVIMENTO: {
    label: "Em desenvolvimento",
    variant: "amber",
    order: 2,
  },
  NAO_TRABALHADO: { label: "Não trabalhado", variant: "slate", order: 3 },
};

export interface ConquistaAlunosSheetProps {
  conquista: Conquista | null;
  turma: TurmaFiltro;
  turmaNome: string;
  onClose: () => void;
  onSelectAluno?: (aluno: AlunoItem) => void;
}

export function ConquistaAlunosSheet({
  conquista,
  turma,
  turmaNome,
  onClose,
  onSelectAluno,
}: ConquistaAlunosSheetProps) {
  const insets = useSafeAreaInsets();
  const { alunos } = useAlunosContext();
  const { turmas } = useConquistasContext();

  const [statusPorAluno, setStatusPorAluno] = useState<
    Record<string, StatusConquistaApi>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const alunosDaConquista = useMemo(() => {
    if (!conquista) return [];
    return alunos.filter((aluno) => {
      if (turma !== TURMA_TODAS) {
        return aluno.turmaId === turma;
      }
      return conquista.progressoPorTurma[aluno.turmaId] !== undefined;
    });
  }, [alunos, conquista, turma]);

  useEffect(() => {
    if (!conquista) {
      setStatusPorAluno({});
      return;
    }

    let cancelled = false;
    const conquistaIdNum = Number(conquista.id);

    async function carregarStatus() {
      if (alunosDaConquista.length === 0) {
        setStatusPorAluno({});
        return;
      }

      setIsLoading(true);
      try {
        const resultados = await Promise.allSettled(
          alunosDaConquista.map(async (aluno) => {
            const registros = await alunoConquistaService.listarPorAluno(
              aluno.id,
            );
            const match = registros.find(
              (r) => r.conquistaId === conquistaIdNum,
            );
            return [
              aluno.id,
              match?.status ?? ("NAO_TRABALHADO" as StatusConquistaApi),
            ] as const;
          }),
        );

        if (cancelled) return;

        const mapa: Record<string, StatusConquistaApi> = {};
        for (const res of resultados) {
          if (res.status === "fulfilled") {
            const [alunoId, status] = res.value;
            mapa[alunoId] = status;
          }
        }
        setStatusPorAluno(mapa);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void carregarStatus();

    return () => {
      cancelled = true;
    };
  }, [conquista, alunosDaConquista]);

  const alunosOrdenados = useMemo(() => {
    return [...alunosDaConquista].sort((a, b) => {
      const statusA = statusPorAluno[a.id] ?? "NAO_TRABALHADO";
      const statusB = statusPorAluno[b.id] ?? "NAO_TRABALHADO";
      const diff = STATUS_BADGE[statusA].order - STATUS_BADGE[statusB].order;
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name, "pt-BR");
    });
  }, [alunosDaConquista, statusPorAluno]);

  const turmasAnexadasLabel = useMemo(() => {
    if (!conquista) return "";
    if (turma !== TURMA_TODAS) return turmaNome;
    const idsAnexados = Object.keys(conquista.progressoPorTurma);
    return idsAnexados
      .map((id) => turmas.find((t) => t.id === id)?.nome)
      .filter(Boolean)
      .join(", ");
  }, [conquista, turma, turmaNome, turmas]);

  const subtitulo = conquista
    ? [
        CATEGORIA_LABEL[conquista.categoria],
        conquista.nivel,
        turmasAnexadasLabel,
        `${alunosDaConquista.length} ${alunosDaConquista.length === 1 ? "aluno" : "alunos"}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <Modal
      visible={conquista !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Fechar"
        />

        <View
          style={[styles.sheet, { paddingBottom: spacing.lg + insets.bottom }]}
          accessibilityViewIsModal
        >
          <View style={styles.grab} />

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title} accessibilityRole="header">
                {conquista?.nome ?? ""}
              </Text>
              <Text style={styles.subtitle}>{subtitulo}</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Fechar lista de alunos"
            >
              <Icon name="close" size={20} color={colors.icon.default} />
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="small" color={colors.brand.primary} />
              <Text style={styles.helperText}>Carregando alunos...</Text>
            </View>
          ) : alunosOrdenados.length === 0 ? (
            <View style={styles.centerBox}>
              <Icon name="groups" size={28} color={colors.text.placeholder} />
              <Text style={styles.helperText}>
                Nenhum aluno encontrado para esta conquista.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {alunosOrdenados.map((aluno) => {
                const status = statusPorAluno[aluno.id] ?? "NAO_TRABALHADO";
                const badge = STATUS_BADGE[status];

                return (
                  <Pressable
                    key={aluno.id}
                    onPress={() => onSelectAluno?.(aluno)}
                    style={({ pressed }) => [
                      styles.alunoRow,
                      pressed && styles.alunoRowPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`${aluno.name}, ${badge.label}`}
                  >
                    <AvatarInitials
                      initials={aluno.initials}
                      variant={aluno.avatarVariant}
                      size={40}
                    />
                    <View style={styles.alunoInfo}>
                      <Text style={styles.alunoName} numberOfLines={1}>
                        {aluno.name}
                      </Text>
                      <Text style={styles.alunoMeta} numberOfLines={1}>
                        {[aluno.turmaName, aluno.grade]
                          .filter(Boolean)
                          .join(" · ")}
                      </Text>
                    </View>
                    <Badge label={badge.label} variant={badge.variant} />
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(3, 20, 94, 0.35)",
  },
  sheet: {
    backgroundColor: colors.background.surface,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    maxHeight: "80%",
  },
  grab: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.default,
    alignSelf: "center",
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  listScroll: {
    flexGrow: 0,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  alunoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radii.xl,
    backgroundColor: colors.background.primary,
  },
  alunoRowPressed: {
    opacity: 0.75,
  },
  alunoInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  alunoName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
  },
  alunoMeta: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  helperText: {
    fontSize: 14,
    color: colors.text.placeholder,
    textAlign: "center",
  },
});
