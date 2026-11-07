import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SymbolView, type AndroidSymbol, type SFSymbol } from "expo-symbols";
import { colors } from "@/theme";

export type IconName = "mail" | "lock" | "eye" | "eye-off" | "user" | "check" | "alert";

interface SymbolMapping {
  ios: SFSymbol;
  android: AndroidSymbol;
  web: AndroidSymbol;
}

const ICON_MAP: Record<IconName, SymbolMapping> = {
  mail: {
    ios: "envelope",
    android: "mail",
    web: "mail",
  },
  lock: {
    ios: "lock",
    android: "lock",
    web: "lock",
  },
  eye: {
    ios: "eye",
    android: "visibility",
    web: "visibility",
  },
  "eye-off": {
    ios: "eye.slash",
    android: "visibility_off",
    web: "visibility_off",
  },
  user: {
    ios: "person",
    android: "person",
    web: "person",
  },
  check: {
    ios: "checkmark.circle",
    android: "check_circle",
    web: "check_circle",
  },
  alert: {
    ios: "exclamationmark.circle",
    android: "error",
    web: "error",
  },
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Icon({
  name,
  size = 20,
  color = colors.icon.default,
  style,
}: IconProps) {
  const mapping = ICON_MAP[name];

  return (
    <SymbolView
      name={mapping}
      size={size}
      tintColor={color}
      style={style}
    />
  );
}
