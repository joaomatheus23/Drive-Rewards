/**
 * AppSkeleton
 * Role: shared
 * Entry: loading placeholders for cards and lists
 * Exit: display-only shimmer block
 */
import { useEffect } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";
import { Colors, Radius, SpringConfig } from "../../theme";

export type AppSkeletonVariant = "line" | "title" | "card" | "avatar";

export interface AppSkeletonProps {
  variant?: AppSkeletonVariant;
  style?: StyleProp<ViewStyle>;
}

export function AppSkeleton({ variant = "line", style }: AppSkeletonProps) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(withSpring(0.75, SpringConfig), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.base, styles[`variant_${variant}`], animatedStyle, style]} />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.borderMd,
    overflow: "hidden",
  },
  variant_line: {
    width: "100%",
    height: 14,
    borderRadius: Radius.input,
  },
  variant_title: {
    width: "60%",
    height: 22,
    borderRadius: Radius.input,
  },
  variant_card: {
    width: "100%",
    height: 120,
    borderRadius: Radius.card,
  },
  variant_avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
});
