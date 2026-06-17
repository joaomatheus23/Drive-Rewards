/**
 * AppBadge
 * Role: shared
 * Entry: status labels, coupon tags, notification counts
 * Exit: display-only pill badge
 */
import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export type AppBadgeTone = "default" | "purple" | "green" | "amber" | "red";

export interface AppBadgeProps {
  label: string;
  tone?: AppBadgeTone;
  compact?: boolean;
}

export function AppBadge({ label, tone = "default", compact = false }: AppBadgeProps) {
  return (
    <View style={[styles.base, styles[`tone_${tone}`], compact && styles.compact]}>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  compact: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  label: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  labelCompact: {
    fontSize: 9,
  },
  tone_default: {
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tone_purple: {
    backgroundColor: "rgba(124,58,237,0.20)",
    borderWidth: 1,
    borderColor: "rgba(196,132,252,0.35)",
  },
  tone_green: {
    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.30)",
  },
  tone_amber: {
    backgroundColor: "rgba(234,179,8,0.15)",
    borderWidth: 1,
    borderColor: "rgba(253,224,71,0.30)",
  },
  tone_red: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
  },
});
