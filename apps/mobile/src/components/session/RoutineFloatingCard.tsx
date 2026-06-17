/**
 * RoutineFloatingCard
 * Role: mobile
 * Entry: active session map overlay
 * Exit: partner routine detected CTA
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { IconRoute } from "@tabler/icons-react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface RoutineFloatingCardProps {
  partnerName: string;
  etaMinutes: number;
  onPress: () => void;
}

export function RoutineFloatingCard({
  partnerName,
  etaMinutes,
  onPress,
}: RoutineFloatingCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    void trigger("light");
    onPress();
  };

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <GlassSurface
          borderRadius={Radius.card}
          borderColor="rgba(16,185,129,0.35)"
          overlayColor="rgba(16,185,129,0.10)"
          style={styles.card}
        >
          <View style={styles.row}>
            <IconRoute size={18} color={Colors.greenLt} strokeWidth={2} />
            <View style={styles.textWrap}>
              <Text style={styles.badge}>ROUTINE DETECTED</Text>
              <Text style={styles.title}>{partnerName}</Text>
              <Text style={styles.subtitle}>~{etaMinutes} min ahead</Text>
            </View>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  badge: {
    ...Typography.label,
    color: Colors.greenLt,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.title,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
  },
});
