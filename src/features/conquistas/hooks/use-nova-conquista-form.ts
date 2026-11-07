import { useCallback, useState } from "react";
import {
  ConquistaCategoria,
  NovaConquistaInput,
} from "../types/conquistas.types";

export function useNovaConquistaForm(
  onSubmit: (input: NovaConquistaInput) => void,
) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<ConquistaCategoria>("speaking");
  const [nivel, setNivel] = useState("");

  const valido = nome.trim().length >= 2;

  const reset = useCallback(() => {
    setNome("");
    setCategoria("speaking");
    setNivel("");
  }, []);

  const submit = useCallback(() => {
    if (!valido) return;
    onSubmit({
      nome: nome.trim(),
      categoria,
      nivel: nivel.trim() || undefined,
    });
  }, [valido, nome, categoria, nivel, onSubmit]);

  return {
    nome,
    setNome,
    categoria,
    setCategoria,
    nivel,
    setNivel,
    valido,
    submit,
    reset,
  };
}
