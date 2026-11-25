import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/contexts";
import { turmaService, TurmaApi } from "@/services";

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
  isLoading: boolean;
  error: string | null;
  getTurmaById: (id: string) => Turma | undefined;
  refreshTurmas: () => Promise<void>;
  createTurma: (input: NewTurmaInput) => Promise<void>;
  updateTurma: (id: string, input: NewTurmaInput) => Promise<void>;
  deleteTurma: (id: string) => Promise<void>;
  updateTurmaStatus: (
    id: string,
    status: TurmaStatus
  ) => Promise<void>;
}

const TurmasContext = createContext<TurmasContextData>(
  {} as TurmasContextData
);

function mapearTurma(turmaApi: TurmaApi): Turma {
  return {
    id: String(turmaApi.id ?? ""),
    nome: turmaApi.nome ?? "",
    serie: turmaApi.serie ?? "",
    anoLetivo: Number(
      turmaApi.anoLetivo ?? new Date().getFullYear()
    ),
    faixaEtaria: turmaApi.faixaEtaria ?? "",
    turno: turmaApi.turno ?? "",
    descricao: turmaApi.descricao ?? "",
    status: turmaApi.arquivada ? "arquivada" : "ativa",
  };
}

export function TurmasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTurmas = useCallback(async () => {
    if (!token) {
      setTurmas([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const resposta = await turmaService.listar();

      setTurmas(resposta.map(mapearTurma));
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : "Não foi possível carregar as turmas.";

      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshTurmas();
  }, [refreshTurmas]);

  const getTurmaById = useCallback(
    (id: string) => turmas.find((turma) => turma.id === id),
    [turmas]
  );

  const createTurma = useCallback(
    async (input: NewTurmaInput) => {
      const resposta = await turmaService.criar({
        nome: input.nome,
        serie: input.serie,
        anoLetivo: input.anoLetivo,
        faixaEtaria: input.faixaEtaria,
        turno: input.turno,
        descricao: input.descricao ?? "",
      });

      const novaTurma = mapearTurma(resposta);

      setTurmas((current) => [novaTurma, ...current]);
    },
    []
  );

  const updateTurma = useCallback(
    async (id: string, input: NewTurmaInput) => {
      const resposta = await turmaService.atualizar(id, {
        nome: input.nome,
        serie: input.serie,
        anoLetivo: input.anoLetivo,
        faixaEtaria: input.faixaEtaria,
        turno: input.turno,
        descricao: input.descricao ?? "",
      });

      const turmaAtualizada = mapearTurma(resposta);

      setTurmas((current) =>
        current.map((turma) =>
          turma.id === id
            ? { ...turma, ...turmaAtualizada }
            : turma
        )
      );
    },
    []
  );

  const deleteTurma = useCallback(async (id: string) => {
    await turmaService.remover(id);

    setTurmas((current) =>
      current.filter((turma) => turma.id !== id)
    );
  }, []);

  const updateTurmaStatus = useCallback(
    async (id: string, status: TurmaStatus) => {
      const resposta = await turmaService.atualizarArquivamento(
        id,
        status === "arquivada"
      );

      const turmaAtualizada = mapearTurma(resposta);

      setTurmas((current) =>
        current.map((turma) =>
          turma.id === id
            ? { ...turma, status: turmaAtualizada.status }
            : turma
        )
      );
    },
    []
  );

  return (
    <TurmasContext.Provider
      value={{
        turmas,
        isLoading,
        error,
        getTurmaById,
        refreshTurmas,
        createTurma,
        updateTurma,
        deleteTurma,
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
