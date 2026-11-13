export const colors = {
  background: {
    primary: "#F5F6FB",
    surface: "#FDFDFD",
    subtle: "#EDEEF7",
    muted: "#EDEEF7",
    infoBanner: "#EDEEF7",
    successRow: "#ECFDF5",
    dangerSoft: "#FFE8E7",
  },
  brand: {
    navy: "#03145E",
    primary: "#2B6FFC",
    primaryPressed: "#1D5AE0",
    primaryLight: "#DBE7FF",
    primarySoft: "#EDEEF7",
    yellow: "#FEC131",
    purple: "#6744E6",
    coral: "#FE6D67",
  },
  text: {
    primary: "#172033",
    navy: "#03145E",
    secondary: "#5B6478",
    placeholder: "#8E96A8",
    inverse: "#FDFDFD",
    link: "#2B6FFC",
    banner: "#03145E",
    danger: "#D93832",
    success: "#15803D",
  },
  border: {
    default: "#DCE0EE",
    subtle: "#EDEEF7",
    focused: "#2B6FFC",
    error: "#FE6D67",
    success: "#A7F3D0",
  },
  icon: {
    default: "#5B6478",
    focused: "#2B6FFC",
    inverse: "#FDFDFD",
  },
  status: {
    error: "#FE6D67",
    success: "#10B981",
    warning: "#FEC131",
  },
  tags: {
    purple: {
      bg: "#EFEBFD",
      text: "#6744E6",
    },
    green: {
      bg: "#DCFCE7",
      text: "#15803D",
    },
    amber: {
      bg: "#FFF4D6",
      text: "#B47A00",
    },
    blue: {
      bg: "#E3ECFF",
      text: "#2B6FFC",
    },
    rose: {
      bg: "#FFE8E7",
      text: "#D93832",
    },
    navy: {
      bg: "#E6E9F5",
      text: "#03145E",
    },
    slate: {
      bg: "#EDEEF7",
      text: "#475569",
    },
  },
} as const;

export type Colors = typeof colors;
export type TagColorVariant = keyof typeof colors.tags;
