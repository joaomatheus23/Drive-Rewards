/**
 * EndSessionSheet
 * Role: mobile
 * Entry: active session end flow
 * Exit: confirms earnings and trip purpose, ends session
 */
import { forwardRef, useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import type { SessionLiveStats, TripPurpose } from "@driven-rewards/shared";
import { AppButton } from "../ui/AppButton";
import { AppChip } from "../ui/AppChip";
import { AppInput } from "../ui/AppInput";
import { Colors, Spacing, Typography } from "../../theme";

const PURPOSES: Array<{ key: TripPurpose; label: string }> = [
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "mixed", label: "Mixed" },
];

export interface EndSessionSheetProps {
  stats: SessionLiveStats;
  loading?: boolean;
  onConfirm: (grossEarnings: number, tripPurpose: TripPurpose) => void;
}

export const EndSessionSheet = forwardRef<BottomSheet, EndSessionSheetProps>(
  function EndSessionSheet({ stats, loading = false, onConfirm }, ref) {
    const snapPoints = useMemo(() => ["62%"], []);
    const [earnings, setEarnings] = useState("");
    const [purpose, setPurpose] = useState<TripPurpose>("work");

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

    const handleConfirm = () => {
      const value = Number(earnings);
      if (!Number.isFinite(value) || value < 0) return;
      onConfirm(value, purpose);
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>End session</Text>
          <Text style={styles.subtitle}>Enter your actual earnings and trip purpose for CRA.</Text>

          <AppInput
            label="Actual earnings (CAD)"
            value={earnings}
            onChangeText={setEarnings}
            placeholder="125.00"
            keyboardType="decimal-pad"
          />

          <View style={styles.chips}>
            {PURPOSES.map((item) => (
              <AppChip
                key={item.key}
                label={item.label}
                selected={purpose === item.key}
                onPress={() => setPurpose(item.key)}
              />
            ))}
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewLine}>{stats.distanceKm.toFixed(1)} km driven</Text>
            <Text style={styles.previewLine}>{stats.durationMinutes} min total</Text>
            <Text style={styles.previewLine}>{stats.pointsEarned} pts earned</Text>
            <Text style={styles.previewProfit}>
              Est. profit ${stats.estimatedProfitCAD.toFixed(2)}
            </Text>
          </View>

          <AppButton
            label="Confirm and end"
            onPress={handleConfirm}
            variant="glassPrimary"
            haptic="heavy"
            fullWidth
            size="lg"
            loading={loading}
          />
        </BottomSheetView>
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
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  title: {
    ...Typography.heading1,
  },
  subtitle: {
    ...Typography.body,
    lineHeight: 22,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  preview: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  previewLine: {
    ...Typography.body,
    color: Colors.t2,
  },
  previewProfit: {
    ...Typography.title,
    color: Colors.greenLt,
    marginTop: Spacing.sm,
  },
});
