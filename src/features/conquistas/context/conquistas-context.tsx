import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { TURMAS } from "../data/conquistas-options";
import { MOCK_CONQUISTAS } from "../data/mock-conquistas";
import {
  Conquista,
  NovaConquistaInput,
  Turma,
} from "../types/conquistas.types";
import { criarProgressoInicial } from "../utils/conquistas-progress";

interface ConquistasContextValue {
  conquistas: Conquista[];
  turmas: Turma[];
  adicionarConquista: (input: NovaConquistaInput) => Conquista;
  arquivarConquista: (id: string) => void;
  restaurarConquista: (id: string) => void;
}

const ConquistasContext = createContext<ConquistasContextValue | null>(null);

export function ConquistasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: trocar mocks por chamadas em src/services quando o backend estiver pronto.
  const [conquistas, setConquistas] = useState<Conquista[]>(MOCK_CONQUISTAS);
  const turmas = TURMAS;

  const adicionarConquista = useCallback(
    (input: NovaConquistaInput) => {
      const nova: Conquista = {
        id: `c-${Date.now()}`,
        nome: input.nome,
        categoria: input.categoria,
        nivel: input.nivel || undefined,
        ativa: true,
        progressoPorTurma: criarProgressoInicial(turmas),
      };
      setConquistas((lista) => [nova, ...lista]);
      return nova;
    },
    [turmas],
  );

  const definirAtiva = useCallback((id: string, ativa: boolean) => {
    setConquistas((lista) =>
      lista.map((c) => (c.id === id ? { ...c, ativa } : c)),
    );
  }, []);

  const arquivarConquista = useCallback(
    (id: string) => definirAtiva(id, false),
    [definirAtiva],
  );
  const restaurarConquista = useCallback(
    (id: string) => definirAtiva(id, true),
    [definirAtiva],
  );

  const value = useMemo(
    () => ({
      conquistas,
      turmas,
      adicionarConquista,
      arquivarConquista,
      restaurarConquista,
    }),
    [
      conquistas,
      turmas,
      adicionarConquista,
      arquivarConquista,
      restaurarConquista,
    ],
  );

  return (
    <ConquistasContext.Provider value={value}>
      {children}
    </ConquistasContext.Provider>
  );
}

export function useConquistasContext() {
  const ctx = useContext(ConquistasContext);
  if (!ctx) {
    throw new Error(
      "useConquistasContext deve ser usado dentro de ConquistasProvider",
    );
  }
  return ctx;
}
