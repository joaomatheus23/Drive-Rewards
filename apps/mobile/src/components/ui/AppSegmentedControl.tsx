/**
 * AppSegmentedControl
 * Role: shared
 * Entry: tab-like filters within a screen
 * Exit: onChange selected segment key
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { GlassSurface } from "./GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface AppSegmentOption {
  key: string;
  label: string;
}

export interface AppSegmentedControlProps {
  options: AppSegmentOption[];
  value: string;
  onChange: (key: string) => void;
}

interface SegmentButtonProps {
  option: AppSegmentOption;
  selected: boolean;
  onPress: () => void;
}

function SegmentButton({ option, selected, onPress }: SegmentButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    void trigger("light");
    onPress();
  };

  const pressableStyle = selected ? styles.segmentSelected : styles.segmentDefault;

  return (
    <Animated.View style={[styles.segmentWrap, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.segmentPressable, pressableStyle]}
      >
        <Text style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function AppSegmentedControl({
  options,
  value,
  onChange,
}: AppSegmentedControlProps) {
  return (
    <GlassSurface borderRadius={Radius.button} style={styles.shell}>
      <View style={styles.row}>
        {options.map((option) => (
          <SegmentButton
            key={option.key}
            option={option}
            selected={option.key === value}
            onPress={() => onChange(option.key)}
          />
        ))}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  shell: {
    padding: Spacing.xs,
  },
  row: {
    flexDirection: "row",
  },
  segmentWrap: {
    flex: 1,
  },
  segmentPressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.button,
  },
  segmentDefault: {
    backgroundColor: "transparent",
  },
  segmentSelected: {
    backgroundColor: "rgba(124,58,237,0.22)",
  },
  label: {
    ...Typography.caption,
    fontSize: 12,
  },
  labelDefault: {
    color: Colors.t3,
  },
  labelSelected: {
    color: Colors.purpleLt,
    fontWeight: "700",
  },
});
