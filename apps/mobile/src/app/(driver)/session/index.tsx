/**
 * SessionIndexScreen
 * Role: driver
 * Entry: tab bar Session
 * Exit: active session screen after start
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
  IconClock,
  IconCoin,
  IconMapPin,
  IconPlus,
  IconRoute,
  IconStar,
} from "@tabler/icons-react-native";
import type { ISession, SessionSummaryPeriod } from "@driven-rewards/shared";
import {
  AppButton,
  AppEmptyState,
  AppSkeleton,
  HomeIndicator,
  SafeScreen,
  SessionRecentCard,
  SessionStartSheet,
  StatCard,
} from "../../../components";
import { useSession } from "../../../hooks/useSession";
import {
  fetchSessionsList,
  fetchTodaySessionSummary,
} from "../../../services/session.service";
import { useSessionStore } from "../../../store/sessionStore";
import { Colors, Spacing, Typography } from "../../../theme";
import { formatDuration } from "../../../utils/sessionFormatters";

export default function SessionIndexScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const { loading, hydrateActiveSession, startSession } = useSession();
  const setCompletedSession = useSessionStore((s) => s.setCompletedSession);

  const [todaySummary, setTodaySummary] = useState<SessionSummaryPeriod | null>(null);
  const [recentSessions, setRecentSessions] = useState<ISession[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const [summary, sessions] = await Promise.all([
        fetchTodaySessionSummary(),
        fetchSessionsList({ limit: 5, status: "completed" }),
      ]);
      setTodaySummary(summary);
      setRecentSessions(sessions.items);
    } catch {
      setTodaySummary(null);
      setRecentSessions([]);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrateActiveSession().then((session) => {
      if (session && (session.status === "active" || session.status === "paused")) {
        router.replace("/(driver)/session/active");
      }
    });
    void loadDashboard();
  }, [hydrateActiveSession, loadDashboard]);

  const openSheet = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const handleStart = useCallback(
    async (platform: Parameters<typeof startSession>[0], grossEarnings?: number) => {
      try {
        await startSession(platform, grossEarnings);
        sheetRef.current?.close();
        router.push("/(driver)/session/active");
      } catch (error) {
        Alert.alert(
          "Could not start session",
          error instanceof Error ? error.message : "Try again",
        );
      }
    },
    [startSession],
  );

  const handleSessionPress = useCallback(
    (session: ISession) => {
      setCompletedSession(session);
      router.push(`/(driver)/session/summary?sessionId=${session._id}`);
    },
    [setCompletedSession],
  );

  return (
    <SafeScreen showHomeIndicator={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sessions</Text>
          <Text style={styles.subtitle}>
            Track km, costs, profit and points in real time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {dashboardLoading ? (
            <View style={styles.statsGrid}>
              <AppSkeleton variant="card" style={styles.statSkeleton} />
              <AppSkeleton variant="card" style={styles.statSkeleton} />
              <AppSkeleton variant="card" style={styles.statSkeleton} />
              <AppSkeleton variant="card" style={styles.statSkeleton} />
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statCell}>
                <StatCard
                  label="Distance"
                  value={`${(todaySummary?.totalKm ?? 0).toFixed(1)} km`}
                  icon={<IconRoute size={16} color={Colors.purpleLt} strokeWidth={2} />}
                  accent="purple"
                />
              </View>
              <View style={styles.statCell}>
                <StatCard
                  label="Time"
                  value={formatDuration(todaySummary?.totalMinutes ?? 0)}
                  icon={<IconClock size={16} color={Colors.t2} strokeWidth={2} />}
                />
              </View>
              <View style={styles.statCell}>
                <StatCard
                  label="Points"
                  value={`+${todaySummary?.totalPoints ?? 0}`}
                  icon={<IconStar size={16} color={Colors.amberLt} strokeWidth={2} />}
                  accent="amber"
                />
              </View>
              <View style={styles.statCell}>
                <StatCard
                  label="Net profit"
                  value={`$${(todaySummary?.totalNetProfitCAD ?? 0).toFixed(2)}`}
                  icon={<IconCoin size={16} color={Colors.greenLt} strokeWidth={2} />}
                  accent="green"
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent sessions</Text>
            {recentSessions.length > 0 ? (
              <Text style={styles.sessionCount}>
                {todaySummary?.sessionCount ?? recentSessions.length} today
              </Text>
            ) : null}
          </View>

          {dashboardLoading ? (
            <View style={styles.list}>
              <AppSkeleton variant="card" style={styles.listSkeleton} />
              <AppSkeleton variant="card" style={styles.listSkeleton} />
            </View>
          ) : recentSessions.length > 0 ? (
            <View style={styles.list}>
              {recentSessions.map((session) => (
                <SessionRecentCard
                  key={session._id}
                  session={session}
                  onPress={() => handleSessionPress(session)}
                />
              ))}
            </View>
          ) : (
            <AppEmptyState
              icon={<IconMapPin size={40} color={Colors.t3} strokeWidth={1.5} />}
              title="No sessions yet"
              description="Start your first session to see km, profit and points here."
              actionLabel="Start first session"
              onAction={openSheet}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          label="New session"
          onPress={openSheet}
          variant="glassPrimary"
          haptic="medium"
          fullWidth
          size="lg"
          loading={loading}
          icon={<IconPlus size={20} color={Colors.t1} strokeWidth={2.5} />}
        />
      </View>

      <SessionStartSheet ref={sheetRef} loading={loading} onStart={handleStart} />
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 140,
    gap: Spacing.xxl,
  },
  header: {
    gap: Spacing.sm,
  },
  title: {
    ...Typography.heading1,
  },
  subtitle: {
    ...Typography.body,
    lineHeight: 22,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    ...Typography.title,
  },
  sessionCount: {
    ...Typography.caption,
    color: Colors.t3,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  statCell: {
    width: "47%",
  },
  statSkeleton: {
    width: "47%",
    height: 96,
  },
  list: {
    gap: Spacing.md,
  },
  listSkeleton: {
    height: 108,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 88,
    paddingHorizontal: Spacing.xl,
  },
});
