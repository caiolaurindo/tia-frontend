import React from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Icon, SegmentedControl } from "@/components/ui";
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
}

export function ConquistasFilters({
  turmaOptions,
  turma,
  onTurmaChange,
  busca,
  onBuscaChange,
  categoria,
  onCategoriaChange,
}: ConquistasFiltersProps) {
  return (
    <View style={styles.container}>
      <SegmentedControl
        options={turmaOptions}
        value={turma}
        onChange={onTurmaChange}
      />

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <ConquistaChip
          label="Todas"
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
  chips: { gap: spacing.sm },
});
