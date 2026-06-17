/**
 * PressableScale
 * Role: shared
 * Entry: custom tappable surfaces needing press feedback
 * Exit: forwards press events with spring scale
 */
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { usePressScale } from "../../hooks/usePressScale";

export interface PressableScaleProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function PressableScale({
  children,
  style,
  disabled = false,
  onPress,
  ...rest
}: PressableScaleProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        {...rest}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
