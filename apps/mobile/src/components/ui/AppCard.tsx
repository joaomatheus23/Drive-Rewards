/**
 * AppCard
 * Role: shared
 * Entry: lists, dashboards, detail sections
 * Exit: renders children inside a surface container
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { GlassSurface } from "./GlassSurface";
import { Colors, Radius, Shadows, Spacing } from "../../theme";

export type AppCardVariant = "solid" | "glass" | "elevated" | "outline";

export interface AppCardProps {
  children: React.ReactNode;
  variant?: AppCardVariant;
  padding?: keyof typeof PADDING_MAP;
  style?: StyleProp<ViewStyle>;
}

const PADDING_MAP = {
  none: 0,
  sm: Spacing.md,
  md: Spacing.lg,
  lg: Spacing.xl,
} as const;

export function AppCard({
  children,
  variant = "solid",
  padding = "md",
  style,
}: AppCardProps) {
  const paddingStyle = styles[`padding_${padding}`];

  if (variant === "glass") {
    return (
      <GlassSurface borderRadius={Radius.card} style={[paddingStyle, style]}>
        {children}
      </GlassSurface>
    );
  }

  const variantStyle =
    variant === "elevated"
      ? styles.elevated
      : variant === "outline"
        ? styles.outline
        : styles.solid;

  return <View style={[styles.base, variantStyle, paddingStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.card,
    overflow: "hidden",
  },
  solid: {
    backgroundColor: Colors.surface,
  },
  elevated: {
    backgroundColor: Colors.surface2,
    ...Shadows.card,
  },
  outline: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  padding_none: {
    padding: PADDING_MAP.none,
  },
  padding_sm: {
    padding: PADDING_MAP.sm,
  },
  padding_md: {
    padding: PADDING_MAP.md,
  },
  padding_lg: {
    padding: PADDING_MAP.lg,
  },
});
