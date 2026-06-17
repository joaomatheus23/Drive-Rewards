/**
 * SessionStartSheet
 * Role: mobile
 * Entry: session tab idle screen
 * Exit: starts session and navigates to active screen
 */
import { forwardRef, useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SessionPlatform } from "@driven-rewards/shared";
import { AppButton } from "../ui/AppButton";
import { AppChip } from "../ui/AppChip";
import { AppInput } from "../ui/AppInput";
import { Colors, Spacing, Typography } from "../../theme";
import { useAuthStore } from "../../store/auth.store";

const PLATFORMS: Array<{ key: SessionPlatform; label: string }> = [
  { key: "uber", label: "Uber" },
  { key: "lyft", label: "Lyft" },
  { key: "doordash", label: "DoorDash" },
  { key: "skip", label: "Skip" },
  { key: "ubereats", label: "UberEats" },
  { key: "manual", label: "Manual" },
];

export interface SessionStartSheetProps {
  loading?: boolean;
  onStart: (platform: SessionPlatform, grossEarnings?: number) => void;
}

export const SessionStartSheet = forwardRef<BottomSheet, SessionStartSheetProps>(
  function SessionStartSheet({ loading = false, onStart }, ref) {
    const user = useAuthStore((s) => s.user);
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["82%"], []);
    const [platform, setPlatform] = useState<SessionPlatform>("manual");
    const [earnings, setEarnings] = useState("");

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

    const handleStart = () => {
      const parsed = earnings.trim() ? Number(earnings) : undefined;
      onStart(platform, Number.isFinite(parsed) ? parsed : undefined);
    };

    const vehicleLabel = user?.vehicleType
      ? `${user.vehicleType}${user.vehicle?.licensePlate ? ` · ${user.vehicle.licensePlate}` : ""}`
      : "Vehicle not set";

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, Spacing.xl) + Spacing.xxxl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>New session</Text>
          <Text style={styles.subtitle}>
            Pick your platform and optional expected earnings for today.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Platform</Text>
            <View style={styles.platformGrid}>
              {PLATFORMS.map((item) => (
                <View key={item.key} style={styles.platformCell}>
                  <AppChip
                    label={item.label}
                    selected={platform === item.key}
                    fullWidth
                    onPress={() => setPlatform(item.key)}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <AppInput
              label="Expected earnings (optional)"
              value={earnings}
              onChangeText={setEarnings}
              placeholder="0.00"
              keyboardType="decimal-pad"
              containerStyle={styles.fullWidth}
            />
          </View>

          <View style={styles.vehicleCard}>
            <Text style={styles.vehicleLabel}>Selected vehicle</Text>
            <Text style={styles.vehicleValue}>{vehicleLabel}</Text>
          </View>

          <AppButton
            label="Start tracking"
            onPress={handleStart}
            variant="glassPrimary"
            haptic="heavy"
            fullWidth
            size="lg"
            loading={loading}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.surface2,
  },
  handle: {
    backgroundColor: Colors.borderMd,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.lg,
    width: "100%",
  },
  title: {
    ...Typography.heading1,
  },
  subtitle: {
    ...Typography.body,
    lineHeight: 22,
  },
  section: {
    width: "100%",
    gap: Spacing.md,
  },
  sectionLabel: {
    ...Typography.label,
  },
  platformGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: Spacing.sm,
    width: "100%",
  },
  platformCell: {
    width: "48%",
  },
  fullWidth: {
    width: "100%",
  },
  vehicleCard: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vehicleLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  vehicleValue: {
    ...Typography.title,
  },
});
