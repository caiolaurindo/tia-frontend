import React, { useCallback, useState } from "react";
import { Alert, AlertButton, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { spacing } from "@/theme";
import { ConquistaCard } from "../components/conquista-card";
import { ConquistasEmptyState } from "../components/conquistas-empty-state";
import { ConquistasFilters } from "../components/conquistas-filters";
import { ConquistasLegend } from "../components/conquistas-legend";
import { ConquistasPageHeader } from "../components/conquistas-page-header";
import { ConquistasSectionHeader } from "../components/conquistas-section-header";
import { ConquistasToast } from "../components/conquistas-toast";
import { NovaConquistaSheet } from "../components/nova-conquista-sheet";
import {
  useConquistasContext,
  VinculoParcialError,
} from "../context/conquistas-context";
import { TURMA_TODAS } from "../data/conquistas-options";
import { useConquistas } from "../hooks/use-conquistas";
import { Conquista, NovaConquistaInput } from "../types/conquistas.types";

interface ToastState {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ConquistasListScreen() {
  const router = useRouter();
  const {
    adicionarConquista,
    editarConquista,
    arquivarConquista,
    restaurarConquista,
  } = useConquistasContext();
  const {
    turma,
    setTurma,
    turmaNome,
    turmaOptions,
    busca,
    setBusca,
    categoria,
    setCategoria,
    mostrarArquivadas,
    setMostrarArquivadas,
    visiveis,
    totalAtivas,
    totalArquivadas,
    semConquistas,
    semArquivadas,
    semResultados,
  } = useConquistas();

  const [sheetAberto, setSheetAberto] = useState(false);
  // null = formulário de nova conquista; preenchida = edição dessa conquista
  const [conquistaEmEdicao, setConquistaEmEdicao] = useState<Conquista | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const abrirNova = () => {
    setConquistaEmEdicao(null);
    setSheetAberto(true);
  };

  const abrirEdicao = (conquista: Conquista) => {
    setConquistaEmEdicao(conquista);
    setSheetAberto(true);
  };

  const handleSalvar = async (input: NovaConquistaInput) => {
    try {
      if (conquistaEmEdicao) {
        await editarConquista(conquistaEmEdicao.id, input);
        setToast({ message: "Conquista atualizada" });
      } else {
        await adicionarConquista(input);
        setToast({ message: "Conquista salva" });
      }
    } catch (e) {
      // erro comum (ex.: nome duplicado): o formulário mostra a mensagem
      if (!(e instanceof VinculoParcialError)) throw e;
      setToast({ message: e.message });
    }
    setSheetAberto(false);
  };

  const handleArquivar = async (conquista: Conquista) => {
    try {
      await arquivarConquista(conquista.id);
      setToast({
        message: "Conquista arquivada",
        actionLabel: "Desfazer",
        onAction: () => restaurarConquista(conquista.id),
      });
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : String(e) });
    }
  };

  const handleRestaurar = async (conquista: Conquista) => {
    try {
      await restaurarConquista(conquista.id);
      setToast({ message: "Conquista restaurada" });
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : String(e) });
    }
  };

  const handleMais = (conquista: Conquista) => {
    const botoes: AlertButton[] = conquista.ativa
      ? [
          { text: "Editar conquista", onPress: () => abrirEdicao(conquista) },
          {
            text: "Arquivar conquista",
            style: "destructive",
            onPress: () => handleArquivar(conquista),
          },
        ]
      : [
          {
            text: "Restaurar conquista",
            onPress: () => handleRestaurar(conquista),
          },
        ];

    Alert.alert(conquista.nome, undefined, [
      ...botoes,
      { text: "Cancelar", style: "cancel" },
    ]);
};

  const handleAbrir = (conquista: Conquista) => {
    // TODO: quando a tela de Registro (outro módulo) estiver pronta, navegar
    // para ela passando a conquista e a turma selecionada
    // (turma "todas" → escolher turma; turma específica → alunos da turma).
    setToast({
      message:
        turma === TURMA_TODAS
          ? `Abre as turmas de “${conquista.nome}”`
          : `Abre os alunos da ${turmaNome}`,
    });
  };

  const tituloSecao = mostrarArquivadas
    ? "Conquistas arquivadas"
    : turma === TURMA_TODAS
      ? "Todas as conquistas"
      : `Conquistas · ${turmaNome}`;

  return (
    <AppShell
      title="Conquistas"
      activeTab="conquistas"
      onBackPress={() => router.back()}
    >
      <ConquistasPageHeader onNewPress={abrirNova} />

      <ConquistasFilters
        turmaOptions={turmaOptions}
        turma={turma}
        onTurmaChange={setTurma}
        busca={busca}
        onBuscaChange={setBusca}
        categoria={categoria}
        onCategoriaChange={setCategoria}
        mostrarArquivadas={mostrarArquivadas}
        onMostrarArquivadasChange={setMostrarArquivadas}
        totalAtivas={totalAtivas}
        totalArquivadas={totalArquivadas}
      />

      {toast ? (
        <ConquistasToast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onDismiss={dismissToast}
        />
      ) : null}

      {semConquistas ? (
        <ConquistasEmptyState variant="sem-conquistas" />
      ) : semArquivadas ? (
        <ConquistasEmptyState variant="sem-arquivadas" />
      ) : semResultados ? (
        <ConquistasEmptyState variant="sem-resultados" />
      ) : (
        <View style={styles.section}>
          <ConquistasSectionHeader title={tituloSecao} count={visiveis.length} />
          <ConquistasLegend />
          <View style={styles.list}>
            {visiveis.map((conquista) => (
              <ConquistaCard
                key={conquista.id}
                conquista={conquista}
                turma={turma}
                onPress={handleAbrir}
                onMorePress={handleMais}
              />
            ))}
          </View>
        </View>
      )}

      <NovaConquistaSheet
        visible={sheetAberto}
        onClose={() => setSheetAberto(false)}
        onSave={handleSalvar}
        conquista={conquistaEmEdicao}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  list: { gap: spacing.md },
});
