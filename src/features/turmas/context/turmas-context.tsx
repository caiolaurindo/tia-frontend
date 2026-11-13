import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { mockTurmas } from "../data/mock-turmas";
import { Turma, TurmaStatus } from "../types/turmas.types";

export interface NewTurmaInput {
  nome: string;
  serie: string;
  anoLetivo: number;
  faixaEtaria: string;
  turno: string;
  descricao?: string;
}

interface TurmasContextData {
  turmas: Turma[];
  getTurmaById: (id: string) => Turma | undefined;
  createTurma: (input: NewTurmaInput) => void;
  updateTurma: (id: string, input: NewTurmaInput) => void;
  updateTurmaStatus: (id: string, status: TurmaStatus) => void;
}

const TurmasContext = createContext<TurmasContextData>(
  {} as TurmasContextData
);

export function TurmasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [turmas, setTurmas] = useState<Turma[]>(mockTurmas);

  const getTurmaById = useCallback(
    (id: string) => turmas.find((turma) => turma.id === id),
    [turmas]
  );

  const createTurma = useCallback((input: NewTurmaInput) => {
    const novaTurma: Turma = {
      id: `turma-${Date.now()}`,
      ...input,
      status: "ativa",
    };

    setTurmas((current) => [novaTurma, ...current]);
  }, []);

  const updateTurma = useCallback(
    (id: string, input: NewTurmaInput) => {
      setTurmas((current) =>
        current.map((turma) =>
          turma.id === id ? { ...turma, ...input } : turma
        )
      );
    },
    []
  );

  const updateTurmaStatus = useCallback(
    (id: string, status: TurmaStatus) => {
      setTurmas((current) =>
        current.map((turma) =>
          turma.id === id ? { ...turma, status } : turma
        )
      );
    },
    []
  );

  return (
    <TurmasContext.Provider
      value={{
        turmas,
        getTurmaById,
        createTurma,
        updateTurma,
        updateTurmaStatus,
      }}
    >
      {children}
    </TurmasContext.Provider>
  );
}

export function useTurmas() {
  return useContext(TurmasContext);
}

export function useTurmasContext() {
  return useContext(TurmasContext);
}