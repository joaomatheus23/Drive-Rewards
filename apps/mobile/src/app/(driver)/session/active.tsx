/**
 * SessionScreen
 * Role: driver
 * Entry: session started from index sheet
 * Exit: summary screen after end
 */
import { useCallback, useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TripPurpose } from "@driven-rewards/shared";
import {
  EndSessionSheet,
  LiveStatsPanel,
  RouteMap,
  RoutineFloatingCard,
} from "../../../components/session";
import { useLocationTracking } from "../../../hooks/useLocationTracking";
import { useSession } from "../../../hooks/useSession";
import { useSessionStore } from "../../../store/sessionStore";
import { Colors, Spacing, Typography } from "../../../theme";

export default function SessionScreen() {
  const endSheetRef = useRef<BottomSheet>(null);
  const activeSession = useSessionStore((s) => s.activeSession);
  const routePoints = useSessionStore((s) => s.routePoints);
  const liveStats = useSessionStore((s) => s.liveStats);
  const isTracking = useSessionStore((s) => s.isTracking);

  const { loading, hydrateActiveSession, pauseSession, resumeSession, endSession } =
    useSession();

  useLocationTracking(Boolean(activeSession));

  useEffect(() => {
    if (!activeSession) {
      void hydrateActiveSession().then((session) => {
        if (!session) router.replace("/(driver)/session");
      });
    }
  }, [activeSession, hydrateActiveSession]);

  const openEndSheet = useCallback(() => {
    endSheetRef.current?.expand();
  }, []);

  const handlePause = useCallback(async () => {
    try {
      await pauseSession();
    } catch (error) {
      Alert.alert("Pause failed", error instanceof Error ? error.message : "Try again");
    }
  }, [pauseSession]);

  const handleResume = useCallback(async () => {
    try {
      await resumeSession();
    } catch (error) {
      Alert.alert("Resume failed", error instanceof Error ? error.message : "Try again");
    }
  }, [resumeSession]);

  const handleConfirmEnd = useCallback(
    async (grossEarnings: number, tripPurpose: TripPurpose) => {
      try {
        const session = await endSession({ grossEarnings, tripPurpose });
        endSheetRef.current?.close();
        router.replace({
          pathname: "/(driver)/session/summary",
          params: { sessionId: session?._id ?? "" },
        });
      } catch (error) {
        Alert.alert("End failed", error instanceof Error ? error.message : "Try again");
      }
    },
    [endSession],
  );

  if (!activeSession) {
    return <View style={styles.loading} />;
  }

  const isPaused = activeSession.status === "paused";

  return (
    <View style={styles.root}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <RouteMap points={routePoints} interactive showPulse={!isPaused} />
      <SafeAreaView edges={["top"]} style={styles.overlay}>
        <View style={styles.badge}>
          <View style={[styles.dot, isPaused ? styles.dotPaused : styles.dotActive]} />
          <Text style={styles.badgeText}>
            {isPaused ? "Session paused" : "Session active"}
          </Text>
        </View>
      </SafeAreaView>
      <RoutineFloatingCard
        partnerName="Tim Hortons"
        etaMinutes={4}
        onPress={() => router.push("/(driver)/coupons")}
      />
      <View style={styles.panel}>
        <LiveStatsPanel
          stats={liveStats}
          loading={loading}
          isPaused={isPaused}
          onPause={handlePause}
          onResume={handleResume}
          onEnd={openEndSheet}
        />
      </View>
      <EndSessionSheet
        ref={endSheetRef}
        stats={liveStats}
        loading={loading}
        onConfirm={handleConfirmEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  badge: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(17,17,39,0.72)",
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.green,
  },
  dotPaused: {
    backgroundColor: Colors.amber,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.t1,
  },
  panel: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 110,
  },
});
