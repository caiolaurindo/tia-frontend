import { TagColorVariant } from "@/theme";
import type {
  AlunoApi,
  AlunoConquistaApi,
  SituacaoAlunoApi,
  StatusConquistaApi,
} from "@/services";
import type { Turma } from "@/features/turmas/types/turmas.types";
import {
  AlunoEvent,
  AlunoItem,
  AlunoSkillProgress,
  AlunoStatus,
} from "../types/alunos.types";

const AVATAR_VARIANTS: TagColorVariant[] = [
  "blue",
  "green",
  "amber",
  "purple",
  "rose",
];

export const STATUS_TO_API: Record<AlunoStatus, SituacaoAlunoApi> = {
  no_ritmo: "NO_RITMO",
  destaque: "DESTAQUE",
  atencao: "ATENCAO",
};

const STATUS_FROM_API: Record<SituacaoAlunoApi, AlunoStatus> = {
  NO_RITMO: "no_ritmo",
  DESTAQUE: "destaque",
  ATENCAO: "atencao",
};

export function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function calcularIdade(iso: string): number {
  const [ano, mes, dia] = iso.split("-").map(Number);
  if (!ano || !mes || !dia) return 0;
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const fezAniversario =
    hoje.getMonth() + 1 > mes ||
    (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia);
  if (!fezAniversario) idade -= 1;
  return Math.max(idade, 0);
}

export function isoParaBr(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "";
}

/** "10/03/2015" -> "2015-03-10". Retorna null se inválida ou futura. */
export function brParaIso(texto: string): string | null {
  const m = texto.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const data = new Date(ano, mes - 1, dia);
  const valida =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;
  if (!valida || data.getTime() > Date.now()) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

export function mapearAluno(api: AlunoApi, turmas: Turma[]): AlunoItem {
  const turmaId = String(api.turma?.id ?? "");
  const turma = turmas.find((t) => t.id === turmaId);
  const nascimento = String(api.dataNascimento ?? "").slice(0, 10);

  return {
    id: String(api.id),
    name: api.nome,
    initials: buildInitials(api.nome),
    avatarVariant: AVATAR_VARIANTS[api.id % AVATAR_VARIANTS.length],
    turmaId,
    turmaName: api.turma?.nome ?? turma?.nome ?? "",
    grade: api.turma?.serie ?? turma?.serie ?? "",
    birthDate: nascimento,
    age: calcularIdade(nascimento),
    guardianName: api.responsavel?.trim() || "Não informado",
    status: STATUS_FROM_API[api.situacao] ?? "no_ritmo",
    recordsCount: 0, // depende do módulo de registros
    achievementsCount: 0,
    events: [],
    skills: [],
  };
}

const STATUS_CONQUISTA: Record<
  StatusConquistaApi,
  { label: string; percentage: number }
> = {
  NAO_TRABALHADO: { label: "Não trabalhado", percentage: 0 },
  EM_DESENVOLVIMENTO: { label: "Em desenvolvimento", percentage: 40 },
  EM_DESENVOLVIMENTO_AVANCADO: { label: "Avançando", percentage: 75 },
  CONQUISTADO: { label: "Conquistado", percentage: 100 },
};

function dataCurta(iso?: string | null): string {
  if (!iso) return "";
  const [, mes, dia] = String(iso).slice(0, 10).split("-");
  return dia && mes ? `${dia}/${mes}` : "";
}

export function conquistasParaPerfil(lista: AlunoConquistaApi[]): {
  skills: AlunoSkillProgress[];
  events: AlunoEvent[];
  achievementsCount: number;
} {
  const skills = lista.map((c) => ({
    id: `sk-${c.id}`,
    label: c.conquista?.nome ?? `Conquista ${c.conquistaId}`,
    statusLabel: STATUS_CONQUISTA[c.status].label,
    percentage: STATUS_CONQUISTA[c.status].percentage,
  }));

  const conquistadas = lista.filter((c) => c.status === "CONQUISTADO");

  const events: AlunoEvent[] = conquistadas
    .slice()
    .sort((a, b) =>
      String(b.dataConquista ?? "").localeCompare(String(a.dataConquista ?? ""))
    )
    .map((c) => ({
      id: `ev-${c.id}`,
      type: "conquista",
      title: "Conquista alcançada",
      description: c.conquista?.nome ?? "",
      dateLabel: dataCurta(c.dataConquista),
      dateIso: String(c.dataConquista ?? "").slice(0, 10),
    }));

  return { skills, events, achievementsCount: conquistadas.length };
}