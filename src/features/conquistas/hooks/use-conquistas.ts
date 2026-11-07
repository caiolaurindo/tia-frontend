import { useMemo, useState } from "react";
import { useConquistasContext } from "../context/conquistas-context";
import { SUGESTOES, TURMA_TODAS } from "../data/conquistas-options";
import { ConquistaCategoria, TurmaFiltro } from "../types/conquistas.types";
import { normalizarTexto } from "../utils/conquistas-progress";

export function useConquistas() {
  const { conquistas, turmas } = useConquistasContext();

  const [turma, setTurma] = useState<TurmaFiltro>(turmas[0]?.id ?? TURMA_TODAS);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<ConquistaCategoria | null>(null);

  const ativas = useMemo(() => conquistas.filter((c) => c.ativa), [conquistas]);

  const visiveis = useMemo(() => {
    const termo = normalizarTexto(busca);
    return ativas.filter(
      (c) =>
        (!categoria || c.categoria === categoria) &&
        normalizarTexto(c.nome).includes(termo),
    );
  }, [ativas, categoria, busca]);

  const sugestoes = useMemo(
    () => SUGESTOES.filter((s) => !ativas.some((a) => a.nome === s.nome)),
    [ativas],
  );

  const turmaOptions = useMemo(
    () => [
      { label: "Todas", value: TURMA_TODAS },
      ...turmas.map((t) => ({ label: t.rotulo, value: t.id })),
    ],
    [turmas],
  );

  const turmaAtual = turmas.find((t) => t.id === turma);

  return {
    turma,
    setTurma,
    turmaNome: turmaAtual?.nome ?? "Todas as turmas",
    turmaOptions,
    busca,
    setBusca,
    categoria,
    setCategoria,
    visiveis,
    sugestoes,
    semConquistas: ativas.length === 0,
    semResultados: ativas.length > 0 && visiveis.length === 0,
  };
}
