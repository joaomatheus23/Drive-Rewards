/**
 * LevelPill
 * Role: driver
 * Entry: profile, home header, session summary
 * Exit: display-only badge
 */
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { DriverLevel } from "@driven-rewards/shared";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export interface LevelPillProps {
  level: DriverLevel;
  compact?: boolean;
}

interface LevelConfig {
  label: string;
  colors: [string, string];
  textStyle: keyof typeof styles;
}

const LEVEL_CONFIG: Record<DriverLevel, LevelConfig> = {
  bronze: {
    label: "Bronze",
    colors: ["#78350F", "#92400E"],
    textStyle: "textBronze",
  },
  silver: {
    label: "Silver",
    colors: ["#374151", "#6B7280"],
    textStyle: "textSilver",
  },
  gold: {
    label: "Gold",
    colors: ["#854D0E", "#CA8A04"],
    textStyle: "textGold",
  },
  platinum: {
    label: "Platinum",
    colors: ["#4C1D95", "#7C3AED"],
    textStyle: "textPlatinum",
  },
};

export function LevelPill({ level, compact = false }: LevelPillProps) {
  const config = LEVEL_CONFIG[level];

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, compact && styles.gradientCompact]}
      >
        <Text style={[styles.text, styles[config.textStyle], compact && styles.textCompact]}>
          {config.label}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
  },
  wrapCompact: {
    alignSelf: "auto",
  },
  gradient: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  gradientCompact: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    ...Typography.label,
    letterSpacing: 0.6,
  },
  textCompact: {
    fontSize: 10,
  },
  textBronze: {
    color: Colors.amberLt,
  },
  textSilver: {
    color: Colors.t1,
  },
  textGold: {
    color: Colors.amberLt,
  },
  textPlatinum: {
    color: Colors.purpleLt,
  },
});
