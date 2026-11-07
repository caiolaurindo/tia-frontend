import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SymbolView, type AndroidSymbol, type SFSymbol } from "expo-symbols";
import { colors } from "@/theme";

export type IconName =
  | "mail"
  | "lock"
  | "eye"
  | "eye-off"
  | "user"
  | "check"
  | "alert"
  | "bell"
  | "plus"
  | "chevron-left"
  | "chevron-right"
  | "arrow-left"
  | "search"
  | "pause"
  | "play"
  | "stop"
  | "hand"
  | "trophy"
  | "calendar"
  | "list"
  | "home"
  | "groups"
  | "chart"
  | "clock"
  | "edit"
  | "close"
  | "sparkles"
  | "more";

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
    ios: "exclamationmark.triangle",
    android: "warning",
    web: "warning",
  },
  bell: {
    ios: "bell",
    android: "notifications",
    web: "notifications",
  },
  plus: {
    ios: "plus",
    android: "add",
    web: "add",
  },
  "chevron-left": {
    ios: "chevron.left",
    android: "chevron_left",
    web: "chevron_left",
  },
  "chevron-right": {
    ios: "chevron.right",
    android: "chevron_right",
    web: "chevron_right",
  },
  "arrow-left": {
    ios: "arrow.left",
    android: "arrow_back",
    web: "arrow_back",
  },
  search: {
    ios: "magnifyingglass",
    android: "search",
    web: "search",
  },
  pause: {
    ios: "pause.fill",
    android: "pause",
    web: "pause",
  },
  play: {
    ios: "play.fill",
    android: "play_arrow",
    web: "play_arrow",
  },
  stop: {
    ios: "stop.circle",
    android: "stop_circle",
    web: "stop_circle",
  },
  hand: {
    ios: "hand.raised",
    android: "pan_tool",
    web: "pan_tool",
  },
  trophy: {
    ios: "trophy",
    android: "emoji_events",
    web: "emoji_events",
  },
  calendar: {
    ios: "calendar",
    android: "calendar_today",
    web: "calendar_today",
  },
  list: {
    ios: "list.bullet",
    android: "format_list_bulleted",
    web: "format_list_bulleted",
  },
  home: {
    ios: "house",
    android: "home",
    web: "home",
  },
  groups: {
    ios: "person.2",
    android: "groups",
    web: "groups",
  },
  chart: {
    ios: "chart.bar",
    android: "bar_chart",
    web: "bar_chart",
  },
  clock: {
    ios: "clock",
    android: "schedule",
    web: "schedule",
  },
  edit: {
    ios: "pencil",
    android: "edit",
    web: "edit",
  },
  close: {
    ios: "xmark",
    android: "close",
    web: "close",
  },
  sparkles: {
    ios: "sparkles",
    android: "auto_awesome",
    web: "auto_awesome",
  },
  more: {
    ios: "ellipsis",
    android: "more_horiz",
    web: "more_horiz",
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
