import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/contexts";
import { alunoService, AlunoApi } from "@/services";
import { useTurmasContext } from "@/features/turmas/context/turmas-context";
import { AlunoItem, SaveAlunoInput } from "../types/alunos.types";
import { mapearAluno, STATUS_TO_API } from "../utils/aluno-mappers";

interface AlunosContextValue {
  alunos: AlunoItem[];
  isLoading: boolean;
  error: string | null;
  getAlunoById: (id?: string) => AlunoItem | undefined;
  refreshAlunos: () => Promise<void>;
  createAluno: (input: SaveAlunoInput) => Promise<AlunoItem>;
  updateAluno: (id: string, input: SaveAlunoInput) => Promise<AlunoItem>;
  deleteAluno: (id: string) => Promise<void>;
}

const AlunosContext = createContext<AlunosContextValue | null>(null);

function toPayload(input: SaveAlunoInput) {
  const responsavel = input.guardianName.trim();
  return {
    nome: input.name.trim(),
    dataNascimento: input.birthDate,
    turmaId: Number(input.turmaId),
    situacao: STATUS_TO_API[input.status],
    ...(responsavel && responsavel !== "Não informado" ? { responsavel } : {}),
  };
}

export function AlunosProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const { turmas } = useTurmasContext();

  const [alunosApi, setAlunosApi] = useState<AlunoApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapeia aqui para o nome/série da turma aparecerem assim que as turmas carregarem.
  const alunos = useMemo(
    () => alunosApi.map((a) => mapearAluno(a, turmas)),
    [alunosApi, turmas]
  );

  const refreshAlunos = useCallback(async () => {
    if (!token) {
      setAlunosApi([]);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setAlunosApi(await alunoService.listar());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível carregar os alunos."
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
  // Carga inicial ao logar; o setState de loading dentro do refresh é intencional.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void refreshAlunos();
}, [refreshAlunos]);

  const getAlunoById = useCallback(
    (id?: string) => (id ? alunos.find((a) => a.id === id) : undefined),
    [alunos]
  );

  const createAluno = useCallback(
    async (input: SaveAlunoInput) => {
      const criado = await alunoService.criar(toPayload(input));
      setAlunosApi((atual) => [criado, ...atual]);
      return mapearAluno(criado, turmas);
    },
    [turmas]
  );

  const updateAluno = useCallback(
    async (id: string, input: SaveAlunoInput) => {
      const atualizado = await alunoService.atualizar(id, toPayload(input));
      setAlunosApi((atual) =>
        atual.map((a) => (String(a.id) === id ? atualizado : a))
      );
      return mapearAluno(atualizado, turmas);
    },
    [turmas]
  );

  const deleteAluno = useCallback(async (id: string) => {
    await alunoService.remover(id);
    setAlunosApi((atual) => atual.filter((a) => String(a.id) !== id));
  }, []);

  const value = useMemo(
    () => ({
      alunos,
      isLoading,
      error,
      getAlunoById,
      refreshAlunos,
      createAluno,
      updateAluno,
      deleteAluno,
    }),
    [
      alunos,
      isLoading,
      error,
      getAlunoById,
      refreshAlunos,
      createAluno,
      updateAluno,
      deleteAluno,
    ]
  );

  return (
    <AlunosContext.Provider value={value}>{children}</AlunosContext.Provider>
  );
}

export function useAlunosContext() {
  const ctx = useContext(AlunosContext);
  if (!ctx) {
    throw new Error(
      "useAlunosContext deve ser usado dentro de um AlunosProvider"
    );
  }
  return ctx;
}