import { Platform, ViewStyle } from "react-native";

export const shadows: Record<string, ViewStyle> = {
  sm: Platform.select({
    ios: {
      shadowColor: "#03145E",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: "#03145E",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
  }) as ViewStyle,
  button: Platform.select({
    ios: {
      shadowColor: "#2B6FFC",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
    default: {
      shadowColor: "#2B6FFC",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
    },
  }) as ViewStyle,
};
