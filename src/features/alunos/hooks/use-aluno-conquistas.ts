import { useEffect, useMemo, useState } from "react";
import { alunoConquistaService, AlunoConquistaApi } from "@/services";
import { conquistasParaPerfil } from "../utils/aluno-mappers";

export function useAlunoConquistas(alunoId?: string) {
  const [lista, setLista] = useState<AlunoConquistaApi[]>([]);

  useEffect(() => {
    if (!alunoId) return;
    let ativo = true;
    alunoConquistaService
      .listarPorAluno(alunoId)
      .then((resposta) => {
        if (ativo) setLista(resposta);
      })
      .catch(() => {
        if (ativo) setLista([]);
      });
    return () => {
      ativo = false;
    };
  }, [alunoId]);

  return useMemo(() => conquistasParaPerfil(lista), [lista]);
}