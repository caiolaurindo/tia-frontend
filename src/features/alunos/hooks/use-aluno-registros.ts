import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { registroService, RegistroApi } from "@/services";
import { registrosParaEventos } from "../utils/registro-mappers";

export function useAlunoRegistros(alunoId?: string) {
  const [registros, setRegistros] = useState<RegistroApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!alunoId) return;
    try {
      setIsLoading(true);
      setError(null);
      setRegistros(await registroService.buscarPorAluno(Number(alunoId)));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível carregar os registros."
      );
    } finally {
      setIsLoading(false);
    }
  }, [alunoId]);

    useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar])
  );

  const events = useMemo(() => registrosParaEventos(registros), [registros]);

  return { events, recordsCount: registros.length, isLoading, error };
}