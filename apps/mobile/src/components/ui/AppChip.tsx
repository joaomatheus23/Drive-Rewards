/**
 * AppChip
 * Role: shared
 * Entry: coupon filters, category tags
 * Exit: onPress selection toggle
 */
import { Pressable, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import { GlassSurface } from "./GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface AppChipProps {
  label: string;
  selected?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
}

export function AppChip({
  label,
  selected = false,
  fullWidth = false,
  onPress,
}: AppChipProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    void trigger("light");
    onPress();
  };

  const labelStyle = selected ? styles.labelSelected : styles.labelDefault;
  const borderColor = selected ? "rgba(196,132,252,0.55)" : "rgba(255,255,255,0.20)";
  const overlayColor = selected ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.08)";

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <GlassSurface
          borderRadius={Radius.full}
          borderColor={borderColor}
          overlayColor={overlayColor}
          style={[styles.shell, fullWidth && styles.shellFull]}
        >
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  shellFull: {
    width: "100%",
  },
  label: {
    ...Typography.caption,
    fontSize: 12,
  },
  labelDefault: {
    color: Colors.t2,
  },
  labelSelected: {
    color: Colors.purpleLt,
  },
});
