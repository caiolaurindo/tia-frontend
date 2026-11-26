import { useCallback, useEffect, useMemo, useState } from "react";
import {
  alunoConquistaService,
  turmaConquistaService,
  AlunoConquistaApi,
  ConquistaDaTurmaApi,
  StatusConquistaApi,
} from "@/services";
import { AlunoConquistaItem } from "../types/alunos.types";
import { conquistasParaPerfil } from "../utils/aluno-mappers";

export function useAlunoConquistas(alunoId?: string, turmaId?: string) {
  const [registros, setRegistros] = useState<AlunoConquistaApi[]>([]);
  const [daTurma, setDaTurma] = useState<ConquistaDaTurmaApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!alunoId) return;
    try {
      setIsLoading(true);
      setError(null);
      const [regs, turma] = await Promise.all([
        alunoConquistaService.listarPorAluno(alunoId),
        turmaId
          ? turmaConquistaService.listarPorTurma(turmaId)
          : Promise.resolve([] as ConquistaDaTurmaApi[]),
      ]);
      setRegistros(regs);
      setDaTurma(turma);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível carregar as conquistas."
      );
    } finally {
      setIsLoading(false);
    }
  }, [alunoId, turmaId]);

  useEffect(() => {
    // Carga inicial; o setState de loading dentro do carregar é intencional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  // Uma linha por conquista da turma, com o registro do aluno quando existir.
  const itens = useMemo<AlunoConquistaItem[]>(() => {
    const porConquista = new Map(registros.map((r) => [r.conquistaId, r]));
    return daTurma.map((vinculo) => {
      const registro = porConquista.get(vinculo.conquistaId);
      return {
        conquistaId: vinculo.conquistaId,
        nome: vinculo.conquista?.nome ?? `Conquista ${vinculo.conquistaId}`,
        registroId: registro?.id,
        status: registro?.status ?? "NAO_TRABALHADO",
      };
    });
  }, [registros, daTurma]);

  const salvarStatus = useCallback(
    async (item: AlunoConquistaItem, status: StatusConquistaApi) => {
      if (!alunoId || status === item.status) return;

      const salvo = item.registroId
        ? await alunoConquistaService.atualizarStatus(item.registroId, status)
        : await alunoConquistaService.atribuir({
            alunoId: Number(alunoId),
            conquistaId: item.conquistaId,
            status,
          });

      // O POST/PUT não devolve a conquista aninhada; reaproveita o nome já conhecido.
      const completo: AlunoConquistaApi = {
        ...salvo,
        conquista: { id: item.conquistaId, nome: item.nome },
      };
      setRegistros((atual) => {
        const semEste = atual.filter((r) => r.conquistaId !== item.conquistaId);
        return [...semEste, completo];
      });
    },
    [alunoId]
  );

  const resumo = useMemo(() => conquistasParaPerfil(registros), [registros]);

  return { ...resumo, itens, salvarStatus, isLoading, error };
}