import type { RegistroApi } from "@/services";
import { AlunoEvent, AlunoEventType } from "../types/alunos.types";

// O backend devolve a aula junto do registro, mas o tipo RegistroApi não a declara.
type RegistroComAula = RegistroApi & {
  aula?: { nome?: string; assunto?: string | null } | null;
};

const PREFIXO_CONQUISTA = "Conquista:";

function dataCurta(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return dia && mes ? `${dia}/${mes}` : "";
}

export function registrosParaEventos(registros: RegistroApi[]): AlunoEvent[] {
  const eventos: AlunoEvent[] = [];

  for (const registro of registros as RegistroComAula[]) {
    const dateIso = String(registro.data ?? "").slice(0, 10);
    const dateLabel = dataCurta(dateIso);
    const aula = registro.aula?.nome ? ` (Aula: ${registro.aula.nome})` : "";

    const adicionar = (
      campo: string,
      type: AlunoEventType,
      title: string,
      texto?: string | null
    ) => {
      const limpo = texto?.trim();
      if (!limpo) return;
      eventos.push({
        id: `rg-${registro.id}-${campo}`,
        type,
        title,
        description: `${limpo}${aula}`,
        dateLabel,
        dateIso,
      });
    };

    adicionar("participacao", "participacao", "Participou", registro.participacao);
    adicionar("atividade", "atividade", "Realizou atividade", registro.realizouAtividade);
    adicionar("comandos", "participacao", "Respondeu a comandos", registro.seguiuComandos);
    adicionar("dificuldade", "dificuldade", "Dificuldade observada", registro.dificuldades);

    const livre = registro.observacoesLivres?.trim();
    if (livre?.startsWith(PREFIXO_CONQUISTA)) {
      adicionar(
        "conquista",
        "conquista",
        "Conquista registrada",
        livre.slice(PREFIXO_CONQUISTA.length)
      );
    } else {
      adicionar("observacao", "observacao", "Observação", livre);
    }
  }

  return eventos;
}