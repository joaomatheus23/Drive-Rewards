/**
 * SessionRecentCard
 * Role: driver
 * Entry: sessions dashboard list
 * Exit: navigates to session summary on press
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  IconChevronRight,
  IconRoute,
  IconStar,
} from "@tabler/icons-react-native";
import type { ISession } from "@driven-rewards/shared";
import { AppCard } from "../ui/AppCard";
import { Colors, Spacing, Typography } from "../../theme";
import {
  formatDuration,
  formatSessionDate,
  formatSessionPlatform,
} from "../../utils/sessionFormatters";

export interface SessionRecentCardProps {
  session: ISession;
  onPress: () => void;
}

export function SessionRecentCard({ session, onPress }: SessionRecentCardProps) {
  return (
    <Pressable onPress={onPress}>
      <AppCard variant="glass" padding="md" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.platform}>{formatSessionPlatform(session.platform)}</Text>
            <Text style={styles.date}>{formatSessionDate(session.startedAt)}</Text>
          </View>
          <IconChevronRight size={18} color={Colors.t3} strokeWidth={2} />
        </View>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <IconRoute size={14} color={Colors.purpleLt} strokeWidth={2} />
            <Text style={styles.metricText}>{session.distanceKm.toFixed(1)} km</Text>
          </View>
          <Text style={styles.metricDivider}>·</Text>
          <Text style={styles.metricText}>{formatDuration(session.durationMinutes)}</Text>
          <Text style={styles.metricDivider}>·</Text>
          <View style={styles.metric}>
            <IconStar size={14} color={Colors.amberLt} strokeWidth={2} />
            <Text style={styles.metricText}>+{session.pointsEarned} pts</Text>
          </View>
        </View>

        <Text style={styles.profit}>Net ${session.netProfitCAD.toFixed(2)}</Text>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  platform: {
    ...Typography.title,
  },
  date: {
    ...Typography.caption,
    color: Colors.t3,
  },
  metrics: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    ...Typography.caption,
    color: Colors.t2,
  },
  metricDivider: {
    ...Typography.caption,
    color: Colors.t4,
  },
  profit: {
    ...Typography.title,
    color: Colors.greenLt,
  },
});
