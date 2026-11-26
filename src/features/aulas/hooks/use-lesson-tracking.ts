import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { alunoService, ApiError, registroService } from "@/services";
import { TagColorVariant } from "@/theme";
import { useAulasContext } from "../context/aulas-context";
import { QuickObservationType, StudentLessonRecord } from "../types/aulas.types";

const AVATAR_VARIANTS: TagColorVariant[] = [
  "purple",
  "green",
  "amber",
  "blue",
  "rose",
  "navy",
  "slate",
];

type StudentLessonRecordWithApiId = StudentLessonRecord & {
  registroId?: number;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function extrairObservacoesDoRegistro(reg: {
  participacao?: string | null;
  realizouAtividade?: string | null;
  dificuldades?: string | null;
  observacoesLivres?: string | null;
}): { observations: QuickObservationType[]; note: string } {
  const observations: QuickObservationType[] = [];
  if (reg.participacao) observations.push("participacao");
  if (reg.realizouAtividade) observations.push("atividade");
  if (reg.dificuldades) observations.push("dificuldade");

  const livre = reg.observacoesLivres ?? "";
  if (livre.startsWith("Conquista:")) {
    observations.push("conquista");
  }

  return {
    observations,
    note: livre.replace(/^Conquista:\s*/i, ""),
  };
}

function montarPayloadRegistro(params: {
  studentId: string;
  lessonId: string;
  dateIso?: string;
  observations: QuickObservationType[];
  note: string;
}) {
  const temParticipacao = params.observations.includes("participacao");
  const fezAtividade = params.observations.includes("atividade");
  const teveDificuldade = params.observations.includes("dificuldade");
  const teveConquista = params.observations.includes("conquista");

  const notaLimpa = params.note.trim();
  const observacoesLivres = teveConquista
    ? `Conquista: ${notaLimpa || "Demonstrou conquista na aula"}`
    : notaLimpa || null;

  return {
    alunoId: Number(params.studentId),
    aulaId: Number(params.lessonId),
    data: params.dateIso ?? new Date().toISOString().slice(0, 10),
    participacao: temParticipacao ? "Participou da aula" : null,
    realizouAtividade: fezAtividade ? "Realizou a atividade" : null,
    dificuldades: teveDificuldade ? "Apresentou dificuldade" : null,
    observacoesLivres,
  };
}

export function useLessonTracking(lessonId?: string) {
  const { getLessonById, finishLesson } = useAulasContext();

  const lesson = getLessonById(lessonId);

  const [studentsState, setStudentsState] = useState<StudentLessonRecordWithApiId[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSavingObservation, setIsSavingObservation] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(
    lesson?.elapsedMinutes ?? 0
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    let ativo = true;

    async function carregarAlunosERegistros() {
      if (!lesson) {
        if (ativo) setStudentsState([]);
        return;
      }

      setIsLoadingStudents(true);
      try {
        const turmaIdNum = lesson.turmaId ? Number(lesson.turmaId) : undefined;
        const aulaIdNum = Number(lesson.id);

        const [resAlunosFiltrados, resTodosAlunos, resRegistros] =
          await Promise.allSettled([
            turmaIdNum ? alunoService.listar(turmaIdNum) : Promise.resolve([]),
            alunoService.listar(),
            Number.isFinite(aulaIdNum)
              ? registroService.buscarPorAula(aulaIdNum)
              : Promise.resolve([]),
          ]);

        if (!ativo) return;

        const filtrados =
          resAlunosFiltrados.status === "fulfilled" &&
          Array.isArray(resAlunosFiltrados.value)
            ? resAlunosFiltrados.value
            : [];

        const todos =
          resTodosAlunos.status === "fulfilled" &&
          Array.isArray(resTodosAlunos.value)
            ? resTodosAlunos.value
            : [];

        // Usa os alunos filtrados pela turma; se vier vazio, filtra localmente ou exibe os alunos disponíveis
        let listaAlunos = filtrados;
        if (listaAlunos.length === 0 && todos.length > 0) {
          if (turmaIdNum) {
            const daTurmaLocal = todos.filter((a: any) => {
              const tId = Number(a.turmaId ?? a.turma_id);
              return tId === turmaIdNum;
            });
            listaAlunos = daTurmaLocal.length > 0 ? daTurmaLocal : todos;
          } else {
            listaAlunos = todos;
          }
        }

        const registrosAula =
          resRegistros.status === "fulfilled" &&
          Array.isArray(resRegistros.value)
            ? resRegistros.value
            : [];

        const mapaRegistrosPorAluno = new Map<number, (typeof registrosAula)[number]>();
        for (const reg of registrosAula) {
          const aId = Number((reg as any).alunoId ?? (reg as any).aluno_id);
          if (Number.isFinite(aId)) {
            mapaRegistrosPorAluno.set(aId, reg);
          }
        }

        const mapeados: StudentLessonRecordWithApiId[] = listaAlunos.map(
          (aluno, index) => {
            const nome = aluno.nome?.trim() || `Aluno ${aluno.id}`;
            const regExistente = mapaRegistrosPorAluno.get(Number(aluno.id));
            const extraido = regExistente
              ? extrairObservacoesDoRegistro(regExistente)
              : { observations: [], note: "" };

            return {
              studentId: String(aluno.id),
              registroId: regExistente?.id,
              name: nome,
              initials: getInitials(nome),
              avatarVariant: AVATAR_VARIANTS[index % AVATAR_VARIANTS.length],
              observations: extraido.observations,
              note: extraido.note,
              achievedIds: [],
            };
          }
        );

        setStudentsState(mapeados);
      } catch {
        if (ativo) setStudentsState([]);
      } finally {
        if (ativo) setIsLoadingStudents(false);
      }
    }

    void carregarAlunosERegistros();

    return () => {
      ativo = false;
    };
  }, [lesson?.id, lesson?.turmaId]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setElapsedMinutes((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const togglePendingFilter = useCallback(() => {
    setShowOnlyPending((prev) => !prev);
  }, []);

  const persistirRegistroAluno = useCallback(
    async (
      student: StudentLessonRecordWithApiId,
      observations: QuickObservationType[],
      note: string
    ) => {
      if (!lesson) return;

      const payload = montarPayloadRegistro({
        studentId: student.studentId,
        lessonId: lesson.id,
        dateIso: lesson.dateIso,
        observations,
        note,
      });

      if (student.registroId) {
        const atualizado = await registroService.atualizar(
          student.registroId,
          payload
        );
        return atualizado?.id ?? student.registroId;
      }

      const criado = await registroService.criar(payload);
      return criado?.id;
    },
    [lesson]
  );

  const handleQuickObservation = useCallback(
    async (studentId: string, type: QuickObservationType) => {
      if (!lesson || isSavingObservation) return;

      const atual = studentsState.find((s) => s.studentId === studentId);
      if (!atual) return;

      const exists = atual.observations.includes(type);
      const nextObservations = exists
        ? atual.observations.filter((obs) => obs !== type)
        : [...atual.observations, type];

      const nowTime = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setStudentsState((prev) =>
        prev.map((student) =>
          student.studentId === studentId
            ? {
                ...student,
                observations: nextObservations,
                updatedAt: nowTime,
              }
            : student
        )
      );

      setIsSavingObservation(true);
      try {
        const novoRegistroId = await persistirRegistroAluno(
          atual,
          nextObservations,
          atual.note
        );
        if (novoRegistroId) {
          setStudentsState((prev) =>
            prev.map((student) =>
              student.studentId === studentId
                ? { ...student, registroId: novoRegistroId }
                : student
            )
          );
        }
      } catch (error) {
        const mensagem =
          error instanceof ApiError
            ? error.message
            : "Não foi possível salvar a observação no servidor.";
        Alert.alert("Erro ao registrar", mensagem);
      } finally {
        setIsSavingObservation(false);
      }
    },
    [lesson, studentsState, isSavingObservation, persistirRegistroAluno]
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return studentsState.filter((student) => {
      const hasAnyRegistration =
        student.observations.length > 0 || student.note.trim().length > 0;
      const matchesPending = !showOnlyPending || !hasAnyRegistration;
      const matchesQuery =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.initials.toLowerCase().includes(query);

      return matchesPending && matchesQuery;
    });
  }, [studentsState, searchQuery, showOnlyPending]);

  const registeredInVisibleList = useMemo(() => {
    return studentsState.filter(
      (s) => s.observations.length > 0 || s.note.trim().length > 0
    ).length;
  }, [studentsState]);

  const totalStudentsCount = studentsState.length;
  const registeredCount = Math.min(
    totalStudentsCount,
    registeredInVisibleList
  );

  const selectedStudent: StudentLessonRecord | null = useMemo(() => {
    if (!selectedStudentId) return null;
    return studentsState.find((s) => s.studentId === selectedStudentId) ?? null;
  }, [studentsState, selectedStudentId]);

  const saveStudentDetail = useCallback(
    async (payload: {
      observations: QuickObservationType[];
      note: string;
      achievedIds: string[];
    }) => {
      if (!lesson || !selectedStudentId || isSavingObservation) return;

      const atual = studentsState.find((s) => s.studentId === selectedStudentId);
      if (!atual) return;

      const nowTime = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setStudentsState((prev) =>
        prev.map((student) =>
          student.studentId === selectedStudentId
            ? {
                ...student,
                observations: payload.observations,
                note: payload.note,
                achievedIds: payload.achievedIds,
                updatedAt: nowTime,
              }
            : student
        )
      );

      setIsSavingObservation(true);
      try {
        const novoRegistroId = await persistirRegistroAluno(
          atual,
          payload.observations,
          payload.note
        );
        if (novoRegistroId) {
          setStudentsState((prev) =>
            prev.map((student) =>
              student.studentId === selectedStudentId
                ? { ...student, registroId: novoRegistroId }
                : student
            )
          );
        }
        setSelectedStudentId(null);
      } catch (error) {
        const mensagem =
          error instanceof ApiError
            ? error.message
            : "Não foi possível salvar o registro detalhado.";
        Alert.alert("Erro ao salvar", mensagem);
      } finally {
        setIsSavingObservation(false);
      }
    },
    [lesson, selectedStudentId, isSavingObservation, studentsState, persistirRegistroAluno]
  );

  const completeLesson = useCallback(
    (summaryNote?: string) => {
      if (!lesson) return;
      finishLesson(lesson.id, elapsedMinutes, summaryNote);
    },
    [elapsedMinutes, finishLesson, lesson]
  );

  return {
    lesson,
    isLoadingStudents,
    isSavingObservation,
    isPaused,
    elapsedMinutes,
    searchQuery,
    setSearchQuery,
    showOnlyPending,
    togglePause,
    togglePendingFilter,
    filteredStudents,
    registeredCount,
    totalStudentsCount,
    handleQuickObservation,
    selectedStudent,
    openStudentModal: setSelectedStudentId,
    closeStudentModal: () => setSelectedStudentId(null),
    saveStudentDetail,
    completeLesson,
  };
}
