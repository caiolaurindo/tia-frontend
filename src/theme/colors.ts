export const colors = {
  background: {
    primary: "#F8FAFC",
    surface: "#FFFFFF",
    muted: "#EEF2F6",
    infoBanner: "#EBF2FF",
  },
  brand: {
    primary: "#2B6BF3",
    primaryPressed: "#1D58D6",
    primaryLight: "#DBEAFE",
  },
  text: {
    primary: "#0F172A",
    secondary: "#64748B",
    placeholder: "#94A3B8",
    inverse: "#FFFFFF",
    link: "#2B6BF3",
    banner: "#2563EB",
  },
  border: {
    default: "#E2E8F0",
    focused: "#2B6BF3",
    error: "#EF4444",
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
} as const;

export type Colors = typeof colors;
