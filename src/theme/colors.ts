export const colors = {
  background: {
    primary: "#F8FAFC",
    surface: "#FFFFFF",
    subtle: "#F1F5F9",
    muted: "#EEF2F6",
    infoBanner: "#EBF2FF",
    successRow: "#ECFDF5",
    dangerSoft: "#FFE4E6",
  },
  brand: {
    primary: "#2B6BF3",
    primaryPressed: "#1D58D6",
    primaryLight: "#DBEAFE",
    primarySoft: "#EBF2FF",
  },
  text: {
    primary: "#0F172A",
    secondary: "#64748B",
    placeholder: "#94A3B8",
    inverse: "#FFFFFF",
    link: "#2B6BF3",
    banner: "#2563EB",
    danger: "#E11D48",
    success: "#15803D",
  },
  border: {
    default: "#E2E8F0",
    subtle: "#F1F5F9",
    focused: "#2B6BF3",
    error: "#EF4444",
    success: "#A7F3D0",
  },
  icon: {
    default: "#64748B",
    focused: "#2B6BF3",
    inverse: "#FFFFFF",
  },
  status: {
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
  tags: {
    purple: {
      bg: "#EDE9FE",
      text: "#6D28D9",
    },
    green: {
      bg: "#DCFCE7",
      text: "#15803D",
    },
    amber: {
      bg: "#FEF3C7",
      text: "#B45309",
    },
    blue: {
      bg: "#DBEAFE",
      text: "#1D4ED8",
    },
    rose: {
      bg: "#FFE4E6",
      text: "#BE123C",
    },
    slate: {
      bg: "#F1F5F9",
      text: "#475569",
    },
  },
} as const;

export type Colors = typeof colors;
export type TagColorVariant = keyof typeof colors.tags;
