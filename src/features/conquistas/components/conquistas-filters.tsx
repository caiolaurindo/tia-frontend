import React from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Icon } from "@/components/ui";
import { colors, spacing } from "@/theme";
import { CATEGORIA_LABEL, FILTRO_CATEGORIAS } from "../data/conquistas-options";
import { ConquistaCategoria, TurmaFiltro } from "../types/conquistas.types";
import { ConquistaChip } from "./conquista-chip";

export interface ConquistasFiltersProps {
  turmaOptions: { label: string; value: TurmaFiltro }[];
  turma: TurmaFiltro;
  onTurmaChange: (turma: TurmaFiltro) => void;
  busca: string;
  onBuscaChange: (busca: string) => void;
  categoria: ConquistaCategoria | null;
  onCategoriaChange: (categoria: ConquistaCategoria | null) => void;
  mostrarArquivadas: boolean;
  onMostrarArquivadasChange: (mostrar: boolean) => void;
  totalAtivas: number;
  totalArquivadas: number;
}

export function ConquistasFilters({
  turmaOptions,
  turma,
  onTurmaChange,
  busca,
  onBuscaChange,
  categoria,
  onCategoriaChange,
  mostrarArquivadas,
  onMostrarArquivadasChange,
  totalAtivas,
  totalArquivadas,
}: ConquistasFiltersProps) {
  // "Todas as turmas" + 1 turma é redundante: só mostra o seletor com 2+ turmas.
  const mostrarTurmas = turmaOptions.length > 2;

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <Icon name="search" size={18} color={colors.text.placeholder} />
        <TextInput
          value={busca}
          onChangeText={onBuscaChange}
          placeholder="Buscar conquista"
          placeholderTextColor={colors.text.placeholder}
          accessibilityLabel="Buscar conquista"
          returnKeyType="search"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      <View style={styles.group}>
        <View style={styles.row}>
          <ConquistaChip
            label={`Ativas · ${totalAtivas}`}
            selected={!mostrarArquivadas}
            onPress={() => onMostrarArquivadasChange(false)}
          />
          <ConquistaChip
            label={`Arquivadas · ${totalArquivadas}`}
            selected={mostrarArquivadas}
            onPress={() => onMostrarArquivadasChange(true)}
          />
        </View>

        {mostrarTurmas ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
          >
            {turmaOptions.map((option) => (
              <ConquistaChip
                key={option.value}
                label={option.label}
                selected={turma === option.value}
                onPress={() => onTurmaChange(option.value)}
              />
            ))}
          </ScrollView>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          <ConquistaChip
            label="Todas as habilidades"
            selected={categoria === null}
            onPress={() => onCategoriaChange(null)}
          />
          {FILTRO_CATEGORIAS.map((key) => (
            <ConquistaChip
              key={key}
              label={CATEGORIA_LABEL[key]}
              selected={categoria === key}
              onPress={() => onCategoriaChange(categoria === key ? null : key)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.text.primary,
  },
  group: { gap: spacing.sm },
  row: { flexDirection: "row", gap: spacing.sm },
});
