/**
 * AppSpinner
 * Role: shared
 * Entry: loading states, screen overlays
 * Exit: display-only activity indicator
 */
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors, Spacing } from "../../theme";

export type AppSpinnerSize = "sm" | "md" | "lg";

export interface AppSpinnerProps {
  size?: AppSpinnerSize;
  centered?: boolean;
}

const SIZE_MAP: Record<AppSpinnerSize, "small" | "large"> = {
  sm: "small",
  md: "small",
  lg: "large",
};

export function AppSpinner({ size = "md", centered = true }: AppSpinnerProps) {
  const indicator = (
    <ActivityIndicator size={SIZE_MAP[size]} color={Colors.purpleLt} />
  );

  if (!centered) {
    return indicator;
  }

  return <View style={styles.centered}>{indicator}</View>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
});
