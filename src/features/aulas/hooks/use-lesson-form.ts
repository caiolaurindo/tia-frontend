import { useCallback, useState } from "react";
import { useTurmasContext } from "@/features/turmas";
import { TagColorVariant } from "@/theme";
import { useAulasContext } from "../context/aulas-context";
import {
  LessonAchievement,
  LessonActivity,
  LessonItem,
} from "../types/aulas.types";

const ACTIVITY_COLORS: TagColorVariant[] = ["purple", "green", "amber", "blue"];

export interface LessonFormErrors {
  turma?: string;
  title?: string;
  content?: string;
  startTime?: string;
}

export function useLessonForm(existingLesson?: LessonItem) {
  const { createLesson, updateLesson } = useAulasContext();
  const { turmas } = useTurmasContext();

  const initialGroupIndex = existingLesson
    ? Math.max(
        0,
        turmas.findIndex(
          (t) =>
            t.id === existingLesson.turmaId ||
            t.nome === existingLesson.classGroup
        )
      )
    : 0;

  const [title, setTitle] = useState(existingLesson?.title ?? "");
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
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
  }, [content, groupIndex, startTime, title, turmas]);

  const saveLesson = useCallback(async (): Promise<LessonItem | null> => {
    if (isSaving || !validate()) return null;

    const chosenGroup = turmas[groupIndex] ?? turmas[0];
    if (!chosenGroup) return null;

    const dateIso = existingLesson?.dateIso ?? new Date().toISOString().slice(0, 10);
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
      dayOfWeek: 4,
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

  return {
    turmas,
    title,
    setTitle: (val: string) => {
      setTitle(val);
      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
    },
    groupIndex,
    setGroupIndex,
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
  };
}
