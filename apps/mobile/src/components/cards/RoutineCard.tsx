/**
 * RoutineCard
 * Role: driver
 * Entry: home smart routines section, notifications context
 * Exit: onPress → routine detail (optional)
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { IconRoute } from "@tabler/icons-react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { usePressScale } from "../../hooks/usePressScale";
import { useHaptic } from "../../hooks/useHaptic";

export interface RoutineCardProps {
  partnerName: string;
  timeWindowLabel: string;
  daysLabel: string;
  isActive: boolean;
  onPress?: () => void;
}

export function RoutineCard({
  partnerName,
  timeWindowLabel,
  daysLabel,
  isActive,
  onPress,
}: RoutineCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    if (!onPress) return;
    void trigger("light");
    onPress();
  };

  const content = (
    <>
      <LinearGradient
        colors={["rgba(124,58,237,0.35)", "rgba(124,58,237,0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glow}
      />
      <View style={styles.inner}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <IconRoute size={22} color={Colors.purpleLt} strokeWidth={2} />
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>Smart Routine</Text>
            <Text style={styles.partner}>{partnerName}</Text>
            <Text style={styles.meta}>
              {timeWindowLabel} · {daysLabel}
            </Text>
          </View>
          <View style={[styles.statusDot, isActive ? styles.statusActive : styles.statusInactive]} />
        </View>
      </View>
    </>
  );

  if (!onPress) {
    return (
      <GlassSurface
        borderRadius={Radius.cardLg}
        borderColor="rgba(124,58,237,0.30)"
        overlayColor="rgba(124,58,237,0.08)"
        style={styles.card}
      >
        {content}
      </GlassSurface>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <GlassSurface
          borderRadius={Radius.cardLg}
          borderColor="rgba(124,58,237,0.30)"
          overlayColor="rgba(124,58,237,0.08)"
          style={styles.card}
        >
          {content}
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  inner: {
    padding: Spacing.lg,
    position: "relative",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.button,
    backgroundColor: "rgba(124,58,237,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    ...Typography.label,
    color: Colors.purpleLt,
    marginBottom: Spacing.xs,
  },
  partner: {
    ...Typography.title,
    marginBottom: Spacing.xs,
  },
  meta: {
    ...Typography.caption,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    marginLeft: Spacing.sm,
  },
  statusActive: {
    backgroundColor: Colors.green,
  },
  statusInactive: {
    backgroundColor: Colors.t4,
  },
});
