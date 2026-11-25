import { useMemo, useState } from "react";
import { useConquistasContext } from "../context/conquistas-context";
import { TURMA_TODAS } from "../data/conquistas-options";
import { ConquistaCategoria, TurmaFiltro } from "../types/conquistas.types";
import { normalizarTexto } from "../utils/conquistas-progress";

export function useConquistas() {
  const { conquistas, turmas } = useConquistasContext();

  const [turma, setTurma] = useState<TurmaFiltro>(TURMA_TODAS);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<ConquistaCategoria | null>(null);
  const [mostrarArquivadas, setMostrarArquivadas] = useState(false);

  const ativas = useMemo(() => conquistas.filter((c) => c.ativa), [conquistas]);
  const arquivadas = useMemo(
    () => conquistas.filter((c) => !c.ativa),
    [conquistas],
  );

  // Lista de partida: ativas ou arquivadas, conforme o filtro de status.
  const lista = mostrarArquivadas ? arquivadas : ativas;

  const visiveis = useMemo(() => {
    const termo = normalizarTexto(busca);
    return lista.filter(
      (c) =>
        // numa turma específica, só as conquistas vinculadas a ela
        (turma === TURMA_TODAS || c.progressoPorTurma[turma] !== undefined) &&
        (!categoria || c.categoria === categoria) &&
        normalizarTexto(c.nome).includes(termo),
    );
  }, [lista, turma, categoria, busca]);

  const turmaOptions = useMemo(
    () => [
      { label: "Todas as turmas", value: TURMA_TODAS },
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
    mostrarArquivadas,
    setMostrarArquivadas,
    visiveis,
    totalAtivas: ativas.length,
    totalArquivadas: arquivadas.length,
    semConquistas: !mostrarArquivadas && ativas.length === 0,
    semArquivadas: mostrarArquivadas && arquivadas.length === 0,
    semResultados: lista.length > 0 && visiveis.length === 0,
  };
}
