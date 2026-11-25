import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";

import { AppShell } from "@/components/layout";
import { Badge, Button, Card } from "@/components/ui";
import { useAulasContext } from "@/features/aulas/context/aulas-context";
import { colors, radii, spacing } from "@/theme";
import { useAlunosContext } from "@/features/alunos/context/alunos-context";

import { useTurmasContext } from "../context/turmas-context";

export function TurmaDetailsScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    getTurmaById,
    deleteTurma,
    updateTurmaStatus,
  } = useTurmasContext();

  const { lessons, selectLesson } = useAulasContext();
  const { alunos } = useAlunosContext();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const turma = getTurmaById(id);

  if (!turma) {
    return (
      <AppShell title="Turma" activeTab="turmas">
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Turma não encontrada</Text>

          <Text style={styles.subtitle}>
            Não foi possível localizar os dados desta turma.
          </Text>

          <Button
            title="Voltar para turmas"
            onPress={() => router.replace("/turmas")}
          />
        </View>
      </AppShell>
    );
  }

  const isAtiva = turma.status === "ativa";

  const aulasDaTurma = lessons.filter(
    (lesson) =>
      lesson.turmaId === turma.id || lesson.classGroup === turma.nome
  );

  const alunosDaTurma = alunos.filter(
    (aluno) => aluno.turmaId === String(turma.id)
  );

  async function handleToggleStatus() {
    if (!turma || isUpdatingStatus) return;

    try {
      setIsUpdatingStatus(true);

      await updateTurmaStatus(
        turma.id,
        isAtiva ? "arquivada" : "ativa"
      );

      if (Platform.OS !== "web") {
        Alert.alert(
          "Sucesso",
          isAtiva
            ? "Turma arquivada com sucesso!"
            : "Turma reativada com sucesso!"
        );
      }
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : "Não foi possível atualizar o status da turma.";

      Alert.alert("Erro", mensagem);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function confirmDelete() {
    if (!turma || isDeleting) return;

    const executarExclusao = async () => {
      try {
        setIsDeleting(true);
        await deleteTurma(turma.id);
        router.replace("/turmas");
      } catch (erro) {
        const mensagem =
          erro instanceof Error
            ? erro.message
            : "Não foi possível excluir a turma.";

        Alert.alert("Erro ao excluir", mensagem);
      } finally {
        setIsDeleting(false);
      }
    };

    if (Platform.OS === "web") {
      const confirmar = window.confirm(
        `Deseja realmente excluir a turma "${turma.nome}"?`
      );

      if (confirmar) {
        await executarExclusao();
      }

      return;
    }

    Alert.alert(
      "Excluir turma",
      `Deseja realmente excluir a turma "${turma.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void executarExclusao(),
        },
      ]
    );
  }

  return (
    <AppShell
      title="Detalhes da turma"
      onBackPress={() => router.back()}
      activeTab="turmas"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{turma.nome}</Text>

        <Text style={styles.subtitle}>
          Confira as informações desta turma.
        </Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={styles.sectionTitle}>Informações gerais</Text>

          <Badge
            label={isAtiva ? "Ativa" : "Arquivada"}
            variant={isAtiva ? "green" : "slate"}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome da turma</Text>
          <Text style={styles.infoValue}>{turma.nome}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Série</Text>
          <Text style={styles.infoValue}>{turma.serie}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Ano letivo</Text>
          <Text style={styles.infoValue}>{turma.anoLetivo}</Text>
        </View>

        {turma.faixaEtaria ? (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Faixa etária</Text>
            <Text style={styles.infoValue}>{turma.faixaEtaria}</Text>
          </View>
        ) : null}

        {turma.turno ? (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Turno</Text>
            <Text style={styles.infoValue}>{turma.turno}</Text>
          </View>
        ) : null}

        {turma.descricao ? (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Descrição</Text>
            <Text style={styles.infoValue}>{turma.descricao}</Text>
          </View>
        ) : null}
      </Card>

      <Card style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={styles.sectionTitle}>
            Aulas da turma ({aulasDaTurma.length})
          </Text>

          <Pressable onPress={() => router.push("/aulas")}>
            <Text style={styles.linkText}>Ver agenda</Text>
          </Pressable>
        </View>

        {aulasDaTurma.length === 0 ? (
          <Text style={styles.infoLabel}>
            Nenhuma aula cadastrada para esta turma ainda.
          </Text>
        ) : (
          <View style={styles.aulasList}>
            {aulasDaTurma.map((aula) => (
              <Pressable
                key={aula.id}
                onPress={() => {
                  selectLesson(aula.id);
                  router.push({
                    pathname: "/aulas/[id]/editar",
                    params: { id: aula.id },
                  });
                }}
                style={styles.aulaRow}
              >
                <View style={styles.aulaInfo}>
                  <Text style={styles.aulaTitle} numberOfLines={1}>
                    {aula.title}
                  </Text>

                  <Text style={styles.infoLabel} numberOfLines={1}>
                    {aula.dateLabel} · {aula.startTime}
                  </Text>
                </View>

                <Badge label="Editar" variant="blue" />
              </Pressable>
            ))}
          </View>
        )}

        <Button
          title="+ Nova aula para esta turma"
          onPress={() =>
            router.push({
              pathname: "/aulas/nova",
              params: { turmaId: turma.id },
            })
          }
        />
      </Card>
      
            <Card style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={styles.sectionTitle}>
            Alunos da turma ({alunosDaTurma.length})
          </Text>

          <Pressable onPress={() => router.push("/alunos")}>
            <Text style={styles.linkText}>Ver todos</Text>
          </Pressable>
        </View>

        {alunosDaTurma.length === 0 ? (
          <Text style={styles.infoLabel}>
            Nenhum aluno cadastrado nesta turma ainda.
          </Text>
        ) : (
          <View style={styles.alunosList}>
            {alunosDaTurma.map((aluno) => (
              <Pressable
                key={aluno.id}
                onPress={() => router.push(`/alunos/${aluno.id}` as Href)}
                style={styles.alunoRow}
              >
                <View style={styles.alunoInfo}>
                  <Text style={styles.alunoName}>{aluno.name}</Text>
                  <Text style={styles.infoLabel}>
                    {aluno.age} anos · {aluno.grade}
                  </Text>
                </View>

                <Badge
                  label={
                    aluno.status === "destaque"
                      ? "Destaque"
                      : aluno.status === "atencao"
                        ? "Atenção"
                        : "No ritmo"
                  }
                  variant={
                    aluno.status === "destaque"
                      ? "green"
                      : aluno.status === "atencao"
                        ? "amber"
                        : "blue"
                  }
                />
              </Pressable>
            ))}
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <Button
          title={
            isUpdatingStatus
              ? "Atualizando..."
              : isAtiva
                ? "Arquivar turma"
                : "Reativar turma"
          }
          variant="secondary"
          disabled={isUpdatingStatus}
          onPress={() => void handleToggleStatus()}
        />

        <Button
          title="Editar turma"
          variant="secondary"
          onPress={() =>
            router.push(`/turmas/editar/${turma.id}` as Href)
          }
        />

        <Button
          title="Ver relatório semanal"
          variant="secondary"
          onPress={() =>
            router.push(`/relatorios?turmaId=${turma.id}` as Href)
          }
        />

        <Button
          title={isDeleting ? "Excluindo..." : "Excluir turma"}
          variant="ghost"
          onPress={() => void confirmDelete()}
          disabled={isDeleting}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.secondary,
  },

  card: {
    gap: spacing.lg,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },

  infoItem: {
    gap: spacing.xs,
  },

  infoLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
  },

  actions: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },

  emptyContainer: {
    gap: spacing.md,
  },

  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.brand.primary,
  },

  aulasList: {
    gap: spacing.sm,
  },

  aulaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.background.primary,
  },

  aulaInfo: {
    flex: 1,
    gap: 2,
  },

  aulaTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
    alunosList: {
    gap: spacing.sm,
  },

  alunoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.background.primary,
  },

  alunoInfo: {
    flex: 1,
    gap: 2,
  },

  alunoName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
});
