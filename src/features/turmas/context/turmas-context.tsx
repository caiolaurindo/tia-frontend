import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { mockTurmas } from "../data/mock-turmas";
import { Turma, TurmaStatus } from "../types/turmas.types";

interface NewTurmaInput {
  nome: string;
  etapa: string;
  turno: string;
  quantidadeAlunos: number;
}

interface TurmasContextValue {
  turmas: Turma[];
  getTurmaById: (turmaId: string) => Turma | undefined;
  createTurma: (input: NewTurmaInput) => Turma;
  updateTurma: (turmaId: string, input: NewTurmaInput) => void;
  updateTurmaStatus: (turmaId: string, status: TurmaStatus) => void;
}

const TurmasContext = createContext<TurmasContextValue | null>(null);

export function TurmasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [turmas, setTurmas] = useState<Turma[]>(mockTurmas);

  const getTurmaById = useCallback(
    (turmaId: string) => {
      return turmas.find((turma) => turma.id === turmaId);
    },
    [turmas]
  );

  const createTurma = useCallback((input: NewTurmaInput): Turma => {
    const newTurma: Turma = {
      id: `turma-${Date.now()}`,
      nome: input.nome,
      turno: input.turno,
      quantidadeAlunos: input.quantidadeAlunos,
      status: "ativa",
    };

    setTurmas((prev) => [newTurma, ...prev]);

    return newTurma;
  }, []);

  const updateTurma = useCallback(
    (turmaId: string, input: NewTurmaInput) => {
      setTurmas((prev) =>
        prev.map((turma) =>
          turma.id === turmaId
            ? {
                ...turma,
                nome: input.nome,
                turno: input.turno,
                quantidadeAlunos: input.quantidadeAlunos,
              }
            : turma
        )
      );
    },
    []
  );

  const updateTurmaStatus = useCallback(
    (turmaId: string, status: TurmaStatus) => {
      setTurmas((prev) =>
        prev.map((turma) =>
          turma.id === turmaId ? { ...turma, status } : turma
        )
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      turmas,
      getTurmaById,
      createTurma,
      updateTurma,
      updateTurmaStatus,
    }),
    [
      turmas,
      getTurmaById,
      createTurma,
      updateTurma,
      updateTurmaStatus,
    ]
  );

  return (
    <TurmasContext.Provider value={value}>
      {children}
    </TurmasContext.Provider>
  );
}

export function useTurmasContext() {
  const context = useContext(TurmasContext);

  if (!context) {
    throw new Error(
      "useTurmasContext deve ser usado dentro de um TurmasProvider"
    );
  }

  return context;
}