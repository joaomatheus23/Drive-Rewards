/**
 * AuthBackButton
 * Role: public
 * Entry: register steps
 * Exit: router.back()
 */
import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { IconChevronLeft } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface AuthBackButtonProps {
  onPress?: () => void;
}

export function AuthBackButton({ onPress }: AuthBackButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    void trigger("light");
    if (onPress) {
      onPress();
      return;
    }
    router.back();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={8}
      >
        <GlassSurface borderRadius={Radius.input} style={styles.button}>
          <IconChevronLeft size={20} color={Colors.t1} strokeWidth={2.5} />
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
