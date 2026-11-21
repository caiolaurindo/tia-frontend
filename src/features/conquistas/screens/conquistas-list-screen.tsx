import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AppShell } from "@/components/layout";
import { spacing } from "@/theme";
import { ConquistaCard } from "../components/conquista-card";
import { ConquistasEmptyState } from "../components/conquistas-empty-state";
import { ConquistasFilters } from "../components/conquistas-filters";
import { ConquistasLegend } from "../components/conquistas-legend";
import { ConquistasPageHeader } from "../components/conquistas-page-header";
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
  const { adicionarConquista, arquivarConquista, restaurarConquista } =
    useConquistasContext();
  const {
    turma,
    setTurma,
    turmaNome,
    turmaOptions,
    busca,
    setBusca,
    categoria,
    setCategoria,
    visiveis,
    sugestoes,
    semConquistas,
    semResultados,
  } = useConquistas();

  const [sheetAberto, setSheetAberto] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const handleSalvar = async (input: NovaConquistaInput) => {
    try {
      await adicionarConquista(input);
      setToast({ message: "Conquista salva" });
    } catch (e) {
      // erro comum (ex.: nome duplicado): o formulário mostra a mensagem
      if (!(e instanceof VinculoParcialError)) throw e;
      setToast({ message: e.message });
    }
    setSheetAberto(false);
  };

  const handleSugestao = async (input: NovaConquistaInput) => {
    try {
      await adicionarConquista(input);
      setToast({ message: "Conquista salva" });
    } catch (e) {
      setToast({
        message: e instanceof Error ? e.message : "Não foi possível salvar",
      });
    }
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

  const handleMais = (conquista: Conquista) => {
    Alert.alert(conquista.nome, undefined, [
      {
        text: "Arquivar conquista",
        style: "destructive",
        onPress: () => handleArquivar(conquista),
      },
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

  return (
    <AppShell
      title="Conquistas"
      activeTab="conquistas"
      onBackPress={() => router.back()}
    >
      <ConquistasPageHeader onNewPress={() => setSheetAberto(true)} />

      <ConquistasFilters
        turmaOptions={turmaOptions}
        turma={turma}
        onTurmaChange={setTurma}
        busca={busca}
        onBuscaChange={setBusca}
        categoria={categoria}
        onCategoriaChange={setCategoria}
      />

      <ConquistasLegend />

      {toast ? (
        <ConquistasToast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onDismiss={dismissToast}
        />
      ) : null}

      {semConquistas ? (
        <ConquistasEmptyState
          variant="sem-conquistas"
          sugestoes={sugestoes}
          onSugestaoPress={handleSugestao}
        />
      ) : semResultados ? (
        <ConquistasEmptyState variant="sem-resultados" />
      ) : (
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
      )}

      <NovaConquistaSheet
        visible={sheetAberto}
        onClose={() => setSheetAberto(false)}
        onSave={handleSalvar}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
});
