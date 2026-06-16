import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

const DROP_SPRING = {
  damping: 17,
  stiffness: 155,
  mass: 0.82,
} as const;

export function useDropInEntrance(enabled: boolean, delayMs = 0, dropDistance = 200) {
  const progress = useSharedValue(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) return;
    progress.value = withDelay(delayMs, withSpring(1, DROP_SPRING));
  }, [delayMs, enabled, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -dropDistance }],
  }));
}
