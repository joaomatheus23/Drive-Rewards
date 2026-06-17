/**
 * LiveStatsPanel
 * Role: mobile
 * Entry: active session screen bottom panel
 * Exit: live km, time, points and profit with actions
 */
import { StyleSheet, Text, View } from "react-native";
import type { SessionLiveStats } from "@driven-rewards/shared";
import { AppButton } from "../ui/AppButton";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export interface LiveStatsPanelProps {
  stats: SessionLiveStats;
  loading?: boolean;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  isPaused: boolean;
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function LiveStatsPanel({
  stats,
  loading = false,
  onPause,
  onResume,
  onEnd,
  isPaused,
}: LiveStatsPanelProps) {
  return (
    <GlassSurface borderRadius={Radius.sheet} style={styles.panel}>
      <View style={styles.statsRow}>
        <StatItem label="KM" value={stats.distanceKm.toFixed(1)} />
        <StatItem label="TIME" value={`${stats.durationMinutes}m`} />
        <StatItem label="PTS" value={String(stats.pointsEarned)} />
        <StatItem label="PROFIT" value={`$${stats.estimatedProfitCAD.toFixed(2)}`} />
      </View>
      <View style={styles.actions}>
        <View style={styles.actionGhost}>
          <AppButton
            label={isPaused ? "Resume" : "Pause"}
            onPress={isPaused ? onResume : onPause}
            variant="glass"
            haptic="light"
            fullWidth
            loading={loading}
          />
        </View>
        <View style={styles.actionDanger}>
          <AppButton
            label="End session"
            onPress={onEnd}
            variant="danger"
            haptic="medium"
            fullWidth
            loading={loading}
          />
        </View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  panel: {
    minHeight: 200,
    padding: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.title,
    color: Colors.t1,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionGhost: {
    flex: 1,
  },
  actionDanger: {
    flex: 1,
  },
});
