/**
 * AppDivider
 * Role: shared
 * Entry: sections, lists, sheets
 * Exit: display-only separator
 */
import { StyleSheet, View } from "react-native";
import { Colors, Spacing } from "../../theme";

export interface AppDividerProps {
  inset?: boolean;
  spacing?: keyof typeof SPACING_MAP;
}

const SPACING_MAP = {
  none: 0,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
} as const;

export function AppDivider({ inset = false, spacing = "md" }: AppDividerProps) {
  return (
    <View
      style={[
        styles.base,
        inset && styles.inset,
        styles[`spacing_${spacing}`],
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    height: 1,
    backgroundColor: Colors.border,
  },
  inset: {
    marginLeft: Spacing.lg,
  },
  spacing_none: {
    marginVertical: SPACING_MAP.none,
  },
  spacing_sm: {
    marginVertical: SPACING_MAP.sm,
  },
  spacing_md: {
    marginVertical: SPACING_MAP.md,
  },
  spacing_lg: {
    marginVertical: SPACING_MAP.lg,
  },
});
