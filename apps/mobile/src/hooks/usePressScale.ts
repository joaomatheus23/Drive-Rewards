import { useCallback } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SpringConfig } from "../theme";

export function usePressScale() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.97, SpringConfig);
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, SpringConfig);
  }, [scale]);

  return { animatedStyle, onPressIn, onPressOut };
}
