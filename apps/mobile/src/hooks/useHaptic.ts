import * as Haptics from "expo-haptics";
import { useCallback } from "react";

export type HapticStyle = "light" | "medium" | "heavy";

export function useHaptic() {
  const trigger = useCallback(async (style: HapticStyle = "light") => {
    const map = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    } as const;

    await Haptics.impactAsync(map[style]);
  }, []);

  return { trigger };
}
