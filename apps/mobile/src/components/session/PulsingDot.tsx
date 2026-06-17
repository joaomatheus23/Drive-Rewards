/**
 * PulsingDot
 * Role: mobile
 * Entry: RouteMap current position marker
 * Exit: animated purple pulse at driver location
 */
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";
import { CURRENT_POSITION_COLOR } from "../../constants/mapStyle";
import { SpringConfig } from "../../theme";

export function PulsingDot() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withSpring(1.8, SpringConfig), -1, true);
  }, [scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 2 - scale.value,
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <View style={styles.core} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: CURRENT_POSITION_COLOR,
  },
  core: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: CURRENT_POSITION_COLOR,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
