/**
 * PointsHomeCard
 * Role: driver
 * Entry: driver home
 * Exit: display points and level progress
 */
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { DriverLevel } from "@driven-rewards/shared";
import { POINTS } from "@driven-rewards/utils";
import { LevelPill } from "../ui/LevelPill";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export interface PointsHomeCardProps {
  points: number;
  level: DriverLevel;
  todayPoints?: number;
}

function levelProgress(points: number, level: DriverLevel): {
  progress: number;
  label: string;
} {
  if (level === "bronze") {
    return {
      progress: Math.min(1, points / POINTS.LEVELS.silver),
      label: `Silver ${points}/${POINTS.LEVELS.silver}`,
    };
  }
  if (level === "silver") {
    const current = points - POINTS.LEVELS.silver;
    const range = POINTS.LEVELS.gold - POINTS.LEVELS.silver;
    return {
      progress: Math.min(1, Math.max(0, current / range)),
      label: `Gold ${current}/${range}`,
    };
  }
  if (level === "gold") {
    const current = points - POINTS.LEVELS.gold;
    const range = POINTS.LEVELS.platinum - POINTS.LEVELS.gold;
    return {
      progress: Math.min(1, Math.max(0, current / range)),
      label: `Platinum ${current}/${range}`,
    };
  }
  return { progress: 1, label: "Maximum level" };
}

export function PointsHomeCard({
  points,
  level,
  todayPoints = 0,
}: PointsHomeCardProps) {
  const { progress, label: progressLabel } = levelProgress(points, level);

  return (
    <GlassSurface
      borderRadius={Radius.cardLg}
      borderColor="rgba(124,58,237,0.35)"
      overlayColor="rgba(124,58,237,0.06)"
      style={styles.wrap}
    >
      <LinearGradient
        colors={["rgba(124,58,237,0.25)", "rgba(124,58,237,0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glow}
      />
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.label}>YOUR POINTS</Text>
          <LevelPill level={level} compact />
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{points.toLocaleString("en-CA")}</Text>
          {todayPoints > 0 ? (
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>+{todayPoints} Today</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{progressLabel}</Text>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  inner: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.purpleLt,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: Spacing.lg,
  },
  value: {
    ...Typography.display,
    fontSize: 40,
  },
  todayBadge: {
    marginLeft: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: "rgba(124,58,237,0.20)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  todayText: {
    ...Typography.caption,
    color: Colors.purpleLt,
  },
  progressTrack: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.purple,
  },
  progressLabel: {
    ...Typography.caption,
    textAlign: "right",
  },
});
