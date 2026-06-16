/**
 * RegisterStep3 — Permissões
 * Role: public
 * Entry: register step 2
 * Exit: permissions granted → /(driver)/
 */
import { useEffect, useState } from "react";
import { Alert, Linking, Platform, StyleSheet, Text, View } from "react-native";
import {
  IconBell,
  IconCamera,
  IconMapPin,
} from "@tabler/icons-react-native";
import {
  AppButton,
  AuthBackButton,
  AuthProgressBar,
  HomeIndicator,
  PermissionToggleCard,
  PrivacyNotice,
  SafeScreen,
} from "../../../components";
import { useHaptic } from "../../../hooks/useHaptic";
import {
  applyPermissions,
  getPermissionStatus,
  requestPermission,
  type PermissionFlags,
} from "../../../hooks/usePermissions";
import { useAuthStore } from "../../../store/auth.store";
import { Colors, Spacing, Typography } from "../../../theme";

const PERMISSION_LABELS: Record<keyof PermissionFlags, string> = {
  location: "Location",
  notifications: "Notifications",
  camera: "Camera",
};

export default function RegisterStep3() {
  const navigateByRole = useAuthStore((s) => s.navigateByRole);
  const user = useAuthStore((s) => s.user);
  const { trigger } = useHaptic();

  const [permissions, setPermissions] = useState<PermissionFlags>({
    location: false,
    notifications: false,
    camera: false,
  });
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState<keyof PermissionFlags | null>(
    null,
  );

  useEffect(() => {
    void getPermissionStatus().then(setPermissions);
  }, []);

  const handleToggle = async (key: keyof PermissionFlags, value: boolean) => {
    if (requesting) return;

    if (!value) {
      setPermissions((prev) => ({ ...prev, [key]: false }));
      return;
    }

    setRequesting(key);
    void trigger("light");

    try {
      const granted = await requestPermission(key);
      setPermissions((prev) => ({ ...prev, [key]: granted }));

      if (!granted) {
        Alert.alert(
          `${PERMISSION_LABELS[key]} denied`,
          Platform.OS === "ios"
            ? "You can enable it later in iPhone Settings."
            : "You can enable it later in the app settings.",
          [
            { text: "Not now", style: "cancel" },
            { text: "Open Settings", onPress: () => void Linking.openSettings() },
          ],
        );
      }
    } finally {
      setRequesting(null);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    void trigger("heavy");

    try {
      const granted = await applyPermissions(permissions);
      setPermissions(granted);

      const denied = (Object.keys(granted) as (keyof PermissionFlags)[]).filter(
        (key) => permissions[key] && !granted[key],
      );

      if (denied.length > 0) {
        Alert.alert(
          "Some permissions were denied",
          "You can enable them later in Settings.",
          [{ text: "Continue", onPress: () => navigateByRole(user?.role ?? "driver") }],
        );
        return;
      }

      navigateByRole(user?.role ?? "driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen showHomeIndicator={false}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <AuthBackButton />
          <AuthProgressBar currentStep={3} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Permissions</Text>
          <Text style={styles.subtitle}>
            Enable each permission below. Your phone will ask you to confirm.
          </Text>
        </View>

        <View style={styles.list}>
          <PermissionToggleCard
            title="Location"
            description="Only during sessions you start. Never in the background without explicit permission."
            icon={<IconMapPin size={22} color={Colors.purpleLt} strokeWidth={2} />}
            enabled={permissions.location}
            disabled={requesting !== null}
            onToggle={(v) => void handleToggle("location", v)}
          />
          <PermissionToggleCard
            title="Notifications"
            description="Coupons from your routine and points updates. Configurable at any time."
            icon={<IconBell size={22} color={Colors.purpleLt} strokeWidth={2} />}
            enabled={permissions.notifications}
            disabled={requesting !== null}
            onToggle={(v) => void handleToggle("notifications", v)}
          />
          <PermissionToggleCard
            title="Camera"
            description="Required only to scan QR codes when redeeming coupons at partners."
            icon={<IconCamera size={22} color={Colors.purpleLt} strokeWidth={2} />}
            enabled={permissions.camera}
            disabled={requesting !== null}
            onToggle={(v) => void handleToggle("camera", v)}
          />
        </View>

        <View style={styles.bottom}>
          <PrivacyNotice />
          <View style={styles.buttonWrap}>
            <AppButton
              label="Continue"
              onPress={handleContinue}
              haptic="heavy"
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.heading1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    lineHeight: 20,
  },
  list: {
    flex: 1,
  },
  bottom: {
    paddingTop: Spacing.lg,
  },
  buttonWrap: {
    marginTop: Spacing.xl,
  },
});
