/**
 * DriverProfile
 * Role: driver
 * Entry: tab bar Perfil / avatar home
 * Exit: logout → login
 */
import { StyleSheet, Text, View } from "react-native";
import {
  IconLogout,
  IconMail,
  IconCar,
} from "@tabler/icons-react-native";
import {
  AppButton,
  GlassSurface,
  HomeIndicator,
  LevelPill,
  SafeScreen,
} from "../../components";
import { useAuthStore } from "../../store/auth.store";
import type { DriverLevel } from "@driven-rewards/shared";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export default function DriverProfile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const level = (user?.level ?? "bronze") as DriverLevel;
  const initial = user?.name.charAt(0).toUpperCase() ?? "?";

  return (
    <SafeScreen showHomeIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <LevelPill level={level} />
        </View>

        <GlassSurface borderRadius={Radius.cardLg} style={styles.infoCard}>
          <View style={styles.infoRow}>
            <IconMail size={20} color={Colors.t3} strokeWidth={2} />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          {user?.vehicleType ? (
            <View style={styles.infoRow}>
              <IconCar size={20} color={Colors.t3} strokeWidth={2} />
              <Text style={styles.infoText}>{user.vehicleType}</Text>
            </View>
          ) : null}
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Total points</Text>
            <Text style={styles.pointsValue}>{user?.points ?? 0}</Text>
          </View>
        </GlassSurface>

        <View style={styles.bottom}>
          <AppButton
            label="Sign out"
            onPress={() => void logout()}
            variant="glass"
            haptic="medium"
            fullWidth
            size="lg"
            icon={<IconLogout size={20} color={Colors.t1} strokeWidth={2} />}
          />
        </View>
      </View>
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  avatarText: {
    ...Typography.display,
    fontSize: 32,
  },
  name: {
    ...Typography.heading1,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  infoCard: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  infoText: {
    ...Typography.body,
    color: Colors.t1,
    flex: 1,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  pointsLabel: {
    ...Typography.body,
  },
  pointsValue: {
    ...Typography.heading2,
    color: Colors.purpleLt,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
