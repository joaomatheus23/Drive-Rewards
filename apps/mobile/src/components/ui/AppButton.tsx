/**
 * AppButton
 * Role: shared
 * Entry: any screen requiring primary/secondary actions
 * Exit: triggers onPress callback
 */
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { GlassSurface } from "./GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic, type HapticStyle } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "glass"
  | "glassPrimary";
export type AppButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  haptic?: HapticStyle;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const GLASS_VARIANTS = {
  glass: {
    borderColor: "rgba(255,255,255,0.22)",
    overlayColor: "rgba(255,255,255,0.10)",
    labelColor: Colors.t1,
    spinnerColor: Colors.t1,
  },
  glassPrimary: {
    borderColor: "rgba(196,132,252,0.45)",
    overlayColor: "rgba(124,58,237,0.28)",
    labelColor: Colors.t1,
    spinnerColor: Colors.t1,
  },
} as const;

export function AppButton({
  label,
  onPress,
  variant = "glassPrimary",
  size = "md",
  haptic = "light",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}: AppButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const isDisabled = disabled || loading;
  const isGlass = variant === "glass" || variant === "glassPrimary";
  const glassConfig = isGlass ? GLASS_VARIANTS[variant] : null;

  const handlePress = () => {
    if (isDisabled) return;
    void trigger(haptic);
    onPress();
  };

  const content = loading ? (
    <ActivityIndicator
      color={
        isGlass
          ? glassConfig!.spinnerColor
          : variant === "ghost"
            ? Colors.purpleLt
            : Colors.t1
      }
      size="small"
    />
  ) : (
    <View style={styles.content}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      {label ? (
        <Text
          style={[
            styles.label,
            isGlass
              ? { color: glassConfig!.labelColor }
              : styles[`label_${variant}`],
            styles[`labelSize_${size}`],
          ]}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );

  if (isGlass) {
    return (
      <Animated.View style={[fullWidth && styles.fullWidth, animatedStyle]}>
        <Pressable
          onPress={handlePress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={isDisabled}
          style={[fullWidth && styles.fullWidth, isDisabled && styles.disabled]}
        >
          <GlassSurface
            borderRadius={Radius.button}
            intensity={65}
            tint="dark"
            borderColor={glassConfig!.borderColor}
            overlayColor={glassConfig!.overlayColor}
            style={[styles[`size_${size}`], fullWidth && styles.fullWidth]}
          >
            {content}
          </GlassSurface>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={[
          styles.base,
          styles[`size_${size}`],
          styles[`variant_${variant}`],
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    marginRight: Spacing.sm,
  },
  label: {
    ...Typography.title,
    fontSize: 16,
  },
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  size_md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  size_lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  labelSize_sm: {
    fontSize: 14,
  },
  labelSize_md: {
    fontSize: 16,
  },
  labelSize_lg: {
    fontSize: 17,
  },
  variant_primary: {
    backgroundColor: Colors.purple,
  },
  variant_secondary: {
    backgroundColor: Colors.surface2,
  },
  variant_ghost: {
    backgroundColor: "transparent",
  },
  variant_danger: {
    backgroundColor: Colors.red,
  },
  label_primary: {
    color: Colors.t1,
  },
  label_secondary: {
    color: Colors.t1,
  },
  label_ghost: {
    color: Colors.purpleLt,
  },
  label_danger: {
    color: Colors.t1,
  },
  disabled: {
    opacity: 0.45,
  },
});
