import { useCallback, useMemo, useState } from "react";
import {
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

  const turmaIds = useMemo(
    () => escolhidas ?? turmas.map((t) => t.id),
    [escolhidas, turmas],
  );

  const alternarTurma = useCallback(
    (id: string) => {
      const base = escolhidas ?? turmas.map((t) => t.id);
      setEscolhidas(
        base.includes(id) ? base.filter((t) => t !== id) : [...base, id],
      );
    },
    [escolhidas, turmas],
  );

  // exige ao menos uma turma, senão a conquista nasceria sem aparecer em nenhuma
  const valido =
    nome.trim().length >= 2 && (turmas.length === 0 || turmaIds.length > 0);

  const reset = useCallback(() => {
    setNome("");
    setCategoria("speaking");
    setNivel("");
    setEscolhidas(null);
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
    alternarTurma,
    valido,
    erro,
    salvando,
    submit,
    reset,
  };
}
