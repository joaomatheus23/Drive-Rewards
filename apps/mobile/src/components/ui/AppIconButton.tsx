/**
 * AppIconButton
 * Role: shared
 * Entry: headers, toolbars, inline actions
 * Exit: triggers onPress callback
 */
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { GlassSurface } from "./GlassSurface";
import { Colors, Layout, Radius } from "../../theme";
import { useHaptic, type HapticStyle } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export type AppIconButtonVariant = "ghost" | "solid" | "glass";

export interface AppIconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: AppIconButtonVariant;
  haptic?: HapticStyle;
  disabled?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export function AppIconButton({
  icon,
  onPress,
  variant = "glass",
  haptic = "light",
  disabled = false,
  accessibilityLabel,
  style,
}: AppIconButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    if (disabled) return;
    void trigger(haptic);
    onPress();
  };

  const content = (
    <Animated.View
      style={[
        styles.shell,
        variant === "solid" && styles.solid,
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      {icon}
    </Animated.View>
  );

  if (variant === "glass") {
    return (
      <Animated.View style={style}>
        <Pressable
          onPress={handlePress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          hitSlop={8}
        >
          <GlassSurface borderRadius={Radius.input} style={styles.glassShell}>
            {content}
          </GlassSurface>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={style}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        hitSlop={8}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: Layout.iconButtonSize,
    height: Layout.iconButtonSize,
    alignItems: "center",
    justifyContent: "center",
  },
  glassShell: {
    width: Layout.iconButtonSize,
    height: Layout.iconButtonSize,
  },
  solid: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.input,
  },
  disabled: {
    opacity: 0.45,
  },
});
