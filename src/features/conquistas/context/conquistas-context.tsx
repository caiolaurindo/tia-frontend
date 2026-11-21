import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/contexts";
// Import direto do arquivo para não reabrir o ciclo entre contextos.
import { useTurmasContext } from "@/features/turmas/context/turmas-context";
import { conquistaService, ProgressoConquistaApi } from "@/services";
import {
  Conquista,
  NovaConquistaInput,
  ProgressoTurma,
  Turma,
} from "../types/conquistas.types";

export class VinculoParcialError extends Error {}

interface ConquistasContextValue {
  conquistas: Conquista[];
  turmas: Turma[];
  isLoading: boolean;
  error: string | null;
  recarregar: () => Promise<void>;
  /** Sem turmaIds, vincula a todas as turmas ativas. */
  adicionarConquista: (input: NovaConquistaInput) => Promise<Conquista>;
  arquivarConquista: (id: string) => Promise<void>;
  restaurarConquista: (id: string) => Promise<void>;
}

const ConquistasContext = createContext<ConquistasContextValue | null>(null);

function mensagemDeErro(e: unknown, padrao: string) {
  return e instanceof Error ? e.message : padrao;
}

/** Junta as conquistas com as linhas de progresso (chave = id da turma). */
function montarConquistas(
  lista: Conquista[],
  progresso: ProgressoConquistaApi[],
): Conquista[] {
  const porConquista = new Map<string, Record<string, ProgressoTurma>>();

  for (const p of progresso) {
    const chave = String(p.conquistaId);
    const atual = porConquista.get(chave) ?? {};
    atual[String(p.turmaId)] = {
      conquistado: p.conquistado,
      emDesenvolvimento: p.emDesenvolvimento,
      naoTrabalhado: p.naoTrabalhado,
    };
    porConquista.set(chave, atual);
  }

  return lista
    .map((c) => ({ ...c, progressoPorTurma: porConquista.get(c.id) ?? {} }))
    .sort((a, b) => Number(b.id) - Number(a.id)); // mais novas primeiro
}

export function ConquistasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const { turmas: turmasDoApp } = useTurmasContext();

  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Turmas reais (módulo de turmas) no formato que a tela de conquistas usa.
  // totalAlunos não é mais necessário: o backend já calcula "não trabalhado".
  const turmas = useMemo<Turma[]>(
    () =>
      turmasDoApp
        .filter((t) => t.status === "ativa")
        .map((t) => ({ id: t.id, nome: t.nome, rotulo: t.nome, totalAlunos: 0 })),
    [turmasDoApp],
  );

  const recarregar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [lista, progresso] = await Promise.all([
        conquistaService.listar(),
        conquistaService.progresso(),
      ]);
      setConquistas(montarConquistas(lista, progresso));
    } catch (e) {
      setError(mensagemDeErro(e, "Não foi possível carregar as conquistas."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // O provider fica acima do login no _layout: só busca com token.
  useEffect(() => {
    if (isAuthenticated) {
      // Carga inicial ao logar; o setState de loading dentro do recarregar é intencional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void recarregar();
    } else {
      setConquistas([]);
      setError(null);
    }
  }, [isAuthenticated, recarregar]);

  const adicionarConquista = useCallback(
    async (input: NovaConquistaInput) => {
      const { turmaIds, ...dados } = input;
      const criada = await conquistaService.criar(dados);

      const alvo = turmaIds ?? turmas.map((t) => t.id);
      const resultados = await Promise.allSettled(
        alvo.map((turmaId) => conquistaService.vincularTurma(turmaId, criada.id)),
      );
      const falhas = alvo.filter((_, i) => resultados[i].status === "rejected");

      // Traz o progresso real (inclui "não trabalhado" calculado no backend).
      await recarregar();

      if (falhas.length > 0) {
        const nomes = falhas
          .map((id) => turmas.find((t) => t.id === id)?.nome ?? id)
          .join(", ");
        throw new VinculoParcialError(
          `Conquista salva, mas não foi possível vincular a: ${nomes}.`,
        );
      }

      return criada;
    },
    [turmas, recarregar],
  );

  const definirAtiva = useCallback(async (id: string, ativa: boolean) => {
    await conquistaService.definirAtiva(id, ativa);
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
      isLoading,
      error,
      recarregar,
      adicionarConquista,
      arquivarConquista,
      restaurarConquista,
    }),
    [
      conquistas,
      turmas,
      isLoading,
      error,
      recarregar,
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
