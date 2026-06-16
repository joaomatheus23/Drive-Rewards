/**
 * TabBar
 * Role: driver
 * Entry: bottom navigation in (driver) layout
 * Exit: onTabPress → route change
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SpringConfig, Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";

export interface TabBarItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
}

export interface TabBarProps {
  tabs: TabBarItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
}

interface TabButtonProps {
  tab: TabBarItem;
  active: boolean;
  onPress: () => void;
}

function TabButton({ tab, active, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);
  const { trigger } = useHaptic();
  const Icon = tab.icon;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, SpringConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfig);
  };

  const handlePress = () => {
    void trigger("light");
    onPress();
  };

  const iconColor = active ? Colors.purpleLt : Colors.t3;
  const labelStyle = active ? styles.labelActive : styles.labelInactive;

  return (
    <Animated.View style={[styles.tab, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.tabPressable}
      >
        <Icon size={24} color={iconColor} strokeWidth={2} />
        {active ? <View style={styles.activeIndicator} /> : null}
        <Text style={[styles.label, labelStyle]}>{tab.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function TabBar({ tabs, activeKey, onTabPress }: TabBarProps) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={85} tint="dark" style={styles.blur}>
        <View style={styles.row}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={tab.key === activeKey}
              onPress={() => onTabPress(tab.key)}
            />
          ))}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.lg,
  },
  blur: {
    borderRadius: Radius.sheet,
    overflow: "hidden",
    backgroundColor: "rgba(17,17,39,0.55)",
  },
  row: {
    flexDirection: "row",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    flex: 1,
  },
  tabPressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.button,
  },
  activeIndicator: {
    width: 20,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.purple,
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  label: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    fontSize: 11,
  },
  labelActive: {
    color: Colors.purpleLt,
  },
  labelInactive: {
    color: Colors.t3,
  },
});
