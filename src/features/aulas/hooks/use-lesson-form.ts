import { useCallback, useEffect, useState } from "react";
import { useTurmasContext } from "@/features/turmas/context/turmas-context";
import { TagColorVariant } from "@/theme";
import { useAulasContext } from "../context/aulas-context";
import {
  LessonAchievement,
  LessonActivity,
  LessonItem,
} from "../types/aulas.types";

const ACTIVITY_COLORS: TagColorVariant[] = ["purple", "green", "amber", "blue"];

function formatDateBr(dateIso?: string): string {
  if (dateIso && /^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
    const [y, m, d] = dateIso.split("-");
    return `${d}/${m}/${y}`;
  }
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${now.getFullYear()}`;
}

function parseDateToIso(value: string): string | null {
  const trimmed = value.trim();
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (br) {
    const d = Number(br[1]);
    const m = Number(br[2]);
    const y = Number(br[3]);
    const dt = new Date(y, m - 1, d, 12, 0, 0);
    if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
      return `${br[3]}-${br[2]}-${br[1]}`;
    }
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

function getDayOfWeekFromIso(dateIso: string): number {
  const [y, m, d] = dateIso.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const jsDay = new Date(y, m - 1, d, 12, 0, 0).getDay();
  return jsDay === 0 ? 4 : Math.min(4, jsDay - 1);
}

export interface LessonFormErrors {
  turma?: string;
  date?: string;
  title?: string;
  content?: string;
  startTime?: string;
}

export function useLessonForm(
  existingLesson?: LessonItem,
  initialTurmaId?: string
) {
  const { createLesson, updateLesson, deleteLesson } = useAulasContext();
  const { turmas } = useTurmasContext();

  const resolveTurmaIndex = useCallback(() => {
    const targetTurmaId = existingLesson?.turmaId ?? initialTurmaId;
    if (targetTurmaId) {
      const byId = turmas.findIndex((t) => t.id === targetTurmaId);
      if (byId >= 0) return byId;
    }
    if (existingLesson?.classGroup) {
      const byName = turmas.findIndex((t) => t.nome === existingLesson.classGroup);
      if (byName >= 0) return byName;
    }
    return 0;
  }, [existingLesson, initialTurmaId, turmas]);

  const [title, setTitle] = useState(existingLesson?.title ?? "");
  const [groupIndex, setGroupIndex] = useState(resolveTurmaIndex);
  const [dateInput, setDateInput] = useState(
    formatDateBr(existingLesson?.dateIso)
  );
  const [startTime, setStartTime] = useState(
    existingLesson?.startTime ?? "10:00"
  );
  const [endTime, setEndTime] = useState(existingLesson?.endTime ?? "11:00");
  const [content, setContent] = useState(existingLesson?.content ?? "");
  const [newActivityText, setNewActivityText] = useState("");
  const [activities, setActivities] = useState<LessonActivity[]>(
    existingLesson?.activities ?? []
  );
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>(
    existingLesson?.achievements.map((a) => a.title) ?? []
  );
  const [errors, setErrors] = useState<LessonFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (turmas.length === 0) return;
    const nextIdx = resolveTurmaIndex();
    setGroupIndex((prev) =>
      prev >= turmas.length || Boolean(initialTurmaId) || Boolean(existingLesson)
        ? nextIdx
        : prev
    );
  }, [existingLesson, initialTurmaId, resolveTurmaIndex, turmas.length]);

  const addActivity = useCallback(() => {
    const trimmed = newActivityText.trim();
    if (!trimmed) return;

    const nextColor =
      ACTIVITY_COLORS[activities.length % ACTIVITY_COLORS.length];

    setActivities((prev) => [
      ...prev,
      {
        id: `act-${Date.now()}`,
        label: trimmed,
        color: nextColor,
      },
    ]);
    setNewActivityText("");
  }, [activities.length, newActivityText]);

  const removeActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleAchievement = useCallback((titleText: string) => {
    setSelectedAchievements((prev) =>
      prev.includes(titleText)
        ? prev.filter((item) => item !== titleText)
        : [...prev, titleText]
    );
  }, []);

  const validate = useCallback((): boolean => {
    const nextErrors: LessonFormErrors = {};

    if (!turmas[groupIndex] && !turmas[0]) {
      nextErrors.turma = "Cadastre e selecione uma turma para a aula.";
    }
    if (!parseDateToIso(dateInput)) {
      nextErrors.date = "Informe uma data válida (DD/MM/AAAA).";
    }
    if (!title.trim()) {
      nextErrors.title = "Informe o tema ou título da aula.";
    }
    if (!content.trim()) {
      nextErrors.content = "Descreva o conteúdo que será trabalhado.";
    }
    if (!startTime.trim()) {
      nextErrors.startTime = "Informe o horário.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [content, dateInput, groupIndex, startTime, title, turmas]);

  const saveLesson = useCallback(async (): Promise<LessonItem | null> => {
    if (isSaving || !validate()) return null;

    const chosenGroup = turmas[groupIndex] ?? turmas[0];
    const dateIso = parseDateToIso(dateInput);
    if (!chosenGroup || !dateIso) return null;

    const formattedAchievements: LessonAchievement[] = selectedAchievements.map(
      (achTitle, idx) => ({
        id: `ach-form-${idx}`,
        title: achTitle,
        completed: true,
      })
    );

    const payload = {
      turmaId: chosenGroup.id,
      dateIso,
      title: title.trim(),
      classGroup: chosenGroup.nome,
      grade: chosenGroup.serie,
      dateLabel: dateIso.split("-").reverse().join("/"),
      dayOfWeek: getDayOfWeekFromIso(dateIso),
      startTime: startTime.trim(),
      endTime: endTime.trim() || "11:00",
      content: content.trim(),
      activities,
      achievements: formattedAchievements,
    };

    try {
      setIsSaving(true);
      if (existingLesson) {
        await updateLesson(existingLesson.id, payload);
        return { ...existingLesson, ...payload };
      }

      return await createLesson(payload);
    } finally {
      setIsSaving(false);
    }
  }, [
    activities,
    content,
    createLesson,
    dateInput,
    endTime,
    existingLesson,
    groupIndex,
    isSaving,
    selectedAchievements,
    startTime,
    title,
    turmas,
    updateLesson,
    validate,
  ]);

  const removeLesson = useCallback(async (): Promise<boolean> => {
    if (!existingLesson || isSaving) return false;
    try {
      setIsSaving(true);
      await deleteLesson(existingLesson.id);
      return true;
    } finally {
      setIsSaving(false);
    }
  }, [deleteLesson, existingLesson, isSaving]);

  return {
    turmas,
    title,
    setTitle: (val: string) => {
      setTitle(val);
      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
    },
    groupIndex,
    setGroupIndex: (idx: number) => {
      setGroupIndex(idx);
      if (errors.turma) setErrors((prev) => ({ ...prev, turma: undefined }));
    },
    dateInput,
    setDateInput: (val: string) => {
      setDateInput(val);
      if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
    },
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    content,
    setContent: (val: string) => {
      setContent(val);
      if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
    },
    newActivityText,
    setNewActivityText,
    activities,
    addActivity,
    removeActivity,
    selectedAchievements,
    toggleAchievement,
    errors,
    isSaving,
    saveLesson,
    removeLesson,
  };
}
