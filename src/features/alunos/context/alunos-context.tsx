import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { TagColorVariant } from "@/theme";
import { INITIAL_ALUNOS } from "../data/mock-alunos";
import { AlunoItem, SaveAlunoInput } from "../types/alunos.types";

interface AlunosContextValue {
  alunos: AlunoItem[];
  getAlunoById: (id?: string) => AlunoItem | undefined;
  createAluno: (input: SaveAlunoInput) => AlunoItem;
  updateAluno: (id: string, input: SaveAlunoInput) => AlunoItem | undefined;
}

const AlunosContext = createContext<AlunosContextValue | null>(null);

const AVATAR_VARIANTS: TagColorVariant[] = [
  "blue",
  "green",
  "amber",
  "purple",
  "rose",
];

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AlunosProvider({ children }: { children: React.ReactNode }) {
  const [alunos, setAlunos] = useState<AlunoItem[]>(INITIAL_ALUNOS);

  const getAlunoById = useCallback(
    (id?: string) => {
      if (!id) return undefined;
      return alunos.find((a) => a.id === id);
    },
    [alunos]
  );

  const createAluno = useCallback((input: SaveAlunoInput): AlunoItem => {
    const newAluno: AlunoItem = {
      id: `aluno-${Date.now()}`,
      name: input.name.trim(),
      initials: buildInitials(input.name),
      avatarVariant:
        AVATAR_VARIANTS[Math.floor(Math.random() * AVATAR_VARIANTS.length)],
      turmaName: input.turmaName.trim(),
      grade: input.grade.trim(),
      age: input.age,
      guardianName: input.guardianName.trim(),
      status: input.status,
      recordsCount: 0,
      achievementsCount: 0,
      events: [],
      skills: [
        {
          id: `sk-${Date.now()}-1`,
          label: "Compreensão oral",
          statusLabel: "Em desenvolvimento",
          percentage: 50,
        },
        {
          id: "sk-default-2",
          label: "Produção oral",
          statusLabel: "Em desenvolvimento",
          percentage: 50,
        },
      ],
    };

    setAlunos((prev) => [newAluno, ...prev]);
    return newAluno;
  }, []);

  const updateAluno = useCallback(
    (id: string, input: SaveAlunoInput): AlunoItem | undefined => {
      let updated: AlunoItem | undefined;
      setAlunos((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          updated = {
            ...item,
            name: input.name.trim(),
            initials: buildInitials(input.name),
            turmaName: input.turmaName.trim(),
            grade: input.grade.trim(),
            age: input.age,
            guardianName: input.guardianName.trim(),
            status: input.status,
          };
          return updated;
        })
      );
      return updated;
    },
    []
  );

  const value = useMemo(
    () => ({
      alunos,
      getAlunoById,
      createAluno,
      updateAluno,
    }),
    [alunos, getAlunoById, createAluno, updateAluno]
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
