import { useCallback, useState } from "react";
import { TagColorVariant } from "@/theme";
import { useAulasContext } from "../context/aulas-context";
import {
  CLASS_GROUPS,
  SUGGESTED_ACHIEVEMENTS,
} from "../data/mock-aulas";
import {
  LessonAchievement,
  LessonActivity,
  LessonItem,
} from "../types/aulas.types";

const ACTIVITY_COLORS: TagColorVariant[] = ["purple", "green", "amber", "blue"];

export interface LessonFormErrors {
  title?: string;
  content?: string;
  startTime?: string;
}

export function useLessonForm(existingLesson?: LessonItem) {
  const { createLesson, updateLesson } = useAulasContext();

  const initialGroupIndex = existingLesson
    ? Math.max(
        0,
        CLASS_GROUPS.findIndex(
          (g) => g.classGroup === existingLesson.classGroup
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
    existingLesson?.activities ?? [
      { id: "act-init-1", label: "Warm-up oral", color: "purple" },
      { id: "act-init-2", label: "Prática em duplas", color: "green" },
    ]
  );
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>(
    existingLesson?.achievements.map((a) => a.title) ?? [
      SUGGESTED_ACHIEVEMENTS[0],
    ]
  );
  const [errors, setErrors] = useState<LessonFormErrors>({});

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
  }, [content, startTime, title]);

  const saveLesson = useCallback((): LessonItem | null => {
    if (!validate()) return null;

    const chosenGroup = CLASS_GROUPS[groupIndex] ?? CLASS_GROUPS[0];
    const formattedAchievements: LessonAchievement[] = selectedAchievements.map(
      (achTitle, idx) => ({
        id: `ach-form-${idx}`,
        title: achTitle,
        completed: true,
      })
    );

    const payload = {
      title: title.trim(),
      classGroup: chosenGroup.classGroup,
      grade: chosenGroup.grade,
      dateLabel: "Hoje · sexta, 02 de outubro",
      dayOfWeek: 4,
      startTime: startTime.trim(),
      endTime: endTime.trim() || "11:00",
      content: content.trim(),
      activities,
      achievements: formattedAchievements,
    };

    if (existingLesson) {
      updateLesson(existingLesson.id, payload);
      return { ...existingLesson, ...payload };
    }

    return createLesson(payload);
  }, [
    activities,
    content,
    createLesson,
    endTime,
    existingLesson,
    groupIndex,
    selectedAchievements,
    startTime,
    title,
    updateLesson,
    validate,
  ]);

  return {
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
    saveLesson,
  };
}
