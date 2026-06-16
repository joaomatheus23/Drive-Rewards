/**
 * AuthProgressBar
 * Role: public
 * Entry: register steps header
 * Exit: display-only progress (1–3)
 */
import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export interface AuthProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export function AuthProgressBar({
  currentStep,
  totalSteps = 3,
}: AuthProgressBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.segments}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const segmentStyle =
            step <= currentStep ? styles.segmentActive : styles.segmentInactive;
          return <View key={step} style={[styles.segment, segmentStyle]} />;
        })}
      </View>
      <Text style={styles.label}>
        {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  segments: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginRight: Spacing.sm,
  },
  segment: {
    width: 28,
    height: 4,
    borderRadius: Radius.full,
  },
  segmentActive: {
    backgroundColor: Colors.purple,
  },
  segmentInactive: {
    backgroundColor: Colors.borderMd,
  },
  label: {
    ...Typography.caption,
    color: Colors.t3,
  },
});
