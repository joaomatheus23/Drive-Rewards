/**
 * SessionSummaryScreen
 * Role: driver
 * Entry: session end confirmation
 * Exit: driver home
 */
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { IconCircleCheck } from "@tabler/icons-react-native";
import {
  AppButton,
  AppCard,
  HomeIndicator,
  SafeScreen,
} from "../../../components";
import { RouteMap } from "../../../components/session";
import { fetchSessionById } from "../../../services/session.service";
import { useSessionStore } from "../../../store/sessionStore";
import { Colors, Spacing, SpringConfig, Typography } from "../../../theme";

export default function SessionSummaryScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const completedSession = useSessionStore((s) => s.completedSession);
  const setCompletedSession = useSessionStore((s) => s.setCompletedSession);

  const heroScale = useSharedValue(0.6);
  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
    opacity: heroScale.value,
  }));

  useEffect(() => {
    heroScale.value = withSpring(1, SpringConfig);
  }, [heroScale]);

  useEffect(() => {
    if (!completedSession && sessionId) {
      void fetchSessionById(sessionId).then(setCompletedSession);
    }
  }, [completedSession, sessionId, setCompletedSession]);

  const session = completedSession;

  if (!session) {
    return (
      <SafeScreen showHomeIndicator={false}>
        <View style={styles.loading} />
        <HomeIndicator />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen showHomeIndicator={false}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.hero, heroStyle]}>
          <IconCircleCheck size={56} color={Colors.greenLt} strokeWidth={1.8} />
          <Text style={styles.heroTitle}>Session complete</Text>
        </Animated.View>

        <View style={styles.mapWrap}>
          <RouteMap points={session.gpsPoints} interactive={false} showPulse={false} />
        </View>

        <View style={styles.grid}>
          <AppCard variant="glass" style={styles.gridItem}>
            <Text style={styles.statLabel}>KM</Text>
            <Text style={styles.statValue}>{session.distanceKm.toFixed(1)}</Text>
          </AppCard>
          <AppCard variant="glass" style={styles.gridItem}>
            <Text style={styles.statLabel}>TIME</Text>
            <Text style={styles.statValue}>{session.durationMinutes}m</Text>
          </AppCard>
          <AppCard variant="glass" style={styles.gridItem}>
            <Text style={styles.statLabel}>POINTS</Text>
            <Text style={styles.statValue}>{session.pointsEarned}</Text>
          </AppCard>
          <AppCard variant="glass" style={styles.gridItem}>
            <Text style={styles.statLabel}>NET PROFIT</Text>
            <Text style={styles.statValue}>${session.netProfitCAD.toFixed(2)}</Text>
          </AppCard>
        </View>

        <AppCard variant="outline" padding="lg" style={styles.breakdown}>
          <Text style={styles.breakdownTitle}>Cost breakdown</Text>
          <Text style={styles.breakdownLine}>Fuel: ${session.fuelCostCAD.toFixed(2)}</Text>
          <Text style={styles.breakdownLine}>
            Depreciation: ${session.depreciationCostCAD.toFixed(2)}
          </Text>
          <Text style={styles.breakdownTotal}>
            Total cost: ${(session.fuelCostCAD + session.depreciationCostCAD).toFixed(2)}
          </Text>
        </AppCard>

        <AppButton
          label="Back to home"
          onPress={() => router.replace("/(driver)")}
          variant="glassPrimary"
          haptic="medium"
          fullWidth
          size="lg"
        />
      </ScrollView>
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
    gap: Spacing.lg,
  },
  loading: {
    flex: 1,
  },
  hero: {
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    ...Typography.heading1,
  },
  mapWrap: {
    height: 180,
    borderRadius: 22,
    overflow: "hidden",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridItem: {
    width: "47%",
    alignItems: "center",
  },
  statLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.heading2,
  },
  breakdown: {
    gap: Spacing.sm,
  },
  breakdownTitle: {
    ...Typography.title,
    marginBottom: Spacing.sm,
  },
  breakdownLine: {
    ...Typography.body,
    color: Colors.t2,
  },
  breakdownTotal: {
    ...Typography.title,
    color: Colors.purpleLt,
    marginTop: Spacing.sm,
  },
});
