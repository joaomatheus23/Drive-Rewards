/**
 * DriverHome
 * Role: driver
 * Entry: login / onboarding complete
 * Exit: tabs — session, coupons, profile
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconBell } from "@tabler/icons-react-native";
import { router } from "expo-router";
import type { DriverLevel } from "@driven-rewards/shared";
import {
  HomeIndicator,
  HomeRoutineCard,
  GlassSurface,
  NearbyCouponRow,
  PointsHomeCard,
  SafeScreen,
  StatCard,
} from "../../components";
import { useAuthStore } from "../../store/auth.store";
import { useHaptic } from "../../hooks/useHaptic";
import { Colors, Radius, Spacing, Typography } from "../../theme";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const NEARBY_COUPONS = [
  {
    id: "1",
    title: "15% OFF hot drinks",
    partner: "Tim Hortons",
    value: "15%",
    distance: 0.3,
  },
  {
    id: "2",
    title: "$10 OFF pedidos +$30",
    partner: "Earls Kitchen",
    value: "$10",
    distance: 1.2,
  },
];

export default function DriverHome() {
  const user = useAuthStore((s) => s.user);
  const { trigger } = useHaptic();

  const firstName = user?.name.split(" ")[0] ?? "Driver";
  const initial = firstName.charAt(0).toUpperCase();
  const level = (user?.level ?? "bronze") as DriverLevel;
  const points = user?.points ?? 0;

  return (
    <SafeScreen showHomeIndicator={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => void trigger("light")}
              hitSlop={8}
            >
              <GlassSurface borderRadius={Radius.input} style={styles.bellButton}>
                <IconBell size={20} color={Colors.t1} strokeWidth={2} />
                <View style={styles.bellDot} />
              </GlassSurface>
            </Pressable>
            <Pressable
              style={styles.avatar}
              onPress={() => {
                void trigger("light");
                router.push("/(driver)/profile");
              }}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </Pressable>
          </View>
        </View>

        <PointsHomeCard points={points} level={level} todayPoints={47} />

        <View style={styles.section}>
          <HomeRoutineCard
            partnerName="Tim Hortons"
            address="Portage Ave"
            etaMinutes={4}
            scheduleLabel="You usually pass here at 8 AM on weekday mornings"
            onPress={() => router.push("/(driver)/coupons")}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Today" value="2h14" accent="default" />
          <View style={styles.statGap} />
          <StatCard label="Distance" value="43km" accent="default" />
          <View style={styles.statGap} />
          <StatCard label="Saved" value="$8.40" accent="green" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby coupons</Text>
          <Pressable onPress={() => router.push("/(driver)/coupons")} hitSlop={8}>
            <Text style={styles.sectionLink}>See all</Text>
          </Pressable>
        </View>

        {NEARBY_COUPONS.map((coupon) => (
          <NearbyCouponRow
            key={coupon.id}
            title={coupon.title}
            partnerName={coupon.partner}
            valueLabel={coupon.value}
            distanceKm={coupon.distance}
            onPress={() => router.push("/(driver)/coupons")}
          />
        ))}
      </ScrollView>
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxl,
  },
  greeting: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  name: {
    ...Typography.display,
    fontSize: 32,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  bellButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.amber,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...Typography.title,
    color: Colors.t1,
  },
  section: {
    marginTop: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: Spacing.xl,
  },
  statGap: {
    width: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading2,
    fontSize: 20,
  },
  sectionLink: {
    ...Typography.body,
    color: Colors.purpleLt,
    fontWeight: "700",
  },
});
