/**
 * PageHeader
 * Role: shared
 * Entry: top of driver/staff screens
 * Exit: optional back action and right slot
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { IconChevronLeft } from "@tabler/icons-react-native";
import { Colors, Spacing, Typography } from "../../theme";
import { usePressScale } from "../../hooks/usePressScale";
import { useHaptic } from "../../hooks/useHaptic";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export function PageHeader({ title, subtitle, onBack, rightSlot }: PageHeaderProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handleBack = () => {
    if (!onBack) return;
    void trigger("light");
    onBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack ? (
          <Animated.View style={animatedStyle}>
            <Pressable
              onPress={handleBack}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={styles.backButton}
              hitSlop={12}
            >
              <IconChevronLeft size={22} color={Colors.t1} strokeWidth={2.5} />
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.side}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    minHeight: 52,
  },
  side: {
    width: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...Typography.heading2,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
});
