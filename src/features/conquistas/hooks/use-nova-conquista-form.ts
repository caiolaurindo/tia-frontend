import { useCallback, useMemo, useState } from "react";
import {
  Conquista,
  ConquistaCategoria,
  NovaConquistaInput,
  Turma,
} from "../types/conquistas.types";

export function useNovaConquistaForm(
  onSubmit: (input: NovaConquistaInput) => void | Promise<void>,
  turmas: Turma[],
) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<ConquistaCategoria>("speaking");
  const [nivel, setNivel] = useState("");
  // null = ninguém mexeu ainda: vale "todas as turmas" (as turmas chegam da API depois)
  const [escolhidas, setEscolhidas] = useState<string[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  // Edição: turmas que a conquista já tem (ficam marcadas e não podem ser desmarcadas aqui)
  const [modoEdicao, setModoEdicao] = useState(false);
  const [vinculadas, setVinculadas] = useState<string[]>([]);

  const turmaIds = useMemo(
    () => escolhidas ?? turmas.map((t) => t.id),
    [escolhidas, turmas],
  );

  const alternarTurma = useCallback(
    (id: string) => {
      if (vinculadas.includes(id)) return;
      const base = escolhidas ?? turmas.map((t) => t.id);
      setEscolhidas(
        base.includes(id) ? base.filter((t) => t !== id) : [...base, id],
      );
    },
    [escolhidas, turmas, vinculadas],
  );

  // Ao criar, exige ao menos uma turma (senão a conquista não apareceria em nenhuma).
  // Ao editar, dá para salvar sem mexer nas turmas.
  const valido =
    nome.trim().length >= 2 &&
    (modoEdicao || turmas.length === 0 || turmaIds.length > 0);

  const reset = useCallback(() => {
    setNome("");
    setCategoria("speaking");
    setNivel("");
    setEscolhidas(null);
    setErro(null);
    setSalvando(false);
    setModoEdicao(false);
    setVinculadas([]);
  }, []);

  const preencher = useCallback((conquista: Conquista) => {
    const ids = Object.keys(conquista.progressoPorTurma);
    setNome(conquista.nome);
    setCategoria(conquista.categoria);
    setNivel(conquista.nivel ?? "");
    setEscolhidas(ids);
    setVinculadas(ids);
    setModoEdicao(true);
    setErro(null);
    setSalvando(false);
  }, []);

  // Se o salvamento falhar (ex.: nome duplicado), o erro aparece dentro do
  // formulário: o toast da tela fica escondido atrás do modal aberto.
  const submit = useCallback(async () => {
    if (!valido || salvando) return;
    setErro(null);
    setSalvando(true);
    try {
      await onSubmit({
        nome: nome.trim(),
        categoria,
        nivel: nivel.trim() || undefined,
        turmaIds,
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }, [valido, salvando, nome, categoria, nivel, turmaIds, onSubmit]);

  return {
    nome,
    setNome,
    categoria,
    setCategoria,
    nivel,
    setNivel,
    turmaIds,
    vinculadas,
    modoEdicao,
    alternarTurma,
    valido,
    erro,
    salvando,
    submit,
    reset,
    preencher,
  };
}
