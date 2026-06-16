/**
 * HomeRoutineCard
 * Role: driver
 * Entry: driver home — detected routine
 * Exit: onPress CTA
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { IconClock, IconRoute } from "@tabler/icons-react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface HomeRoutineCardProps {
  partnerName: string;
  address: string;
  etaMinutes: number;
  scheduleLabel: string;
  onPress: () => void;
}

export function HomeRoutineCard({
  partnerName,
  address,
  etaMinutes,
  scheduleLabel,
  onPress,
}: HomeRoutineCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    void trigger("medium");
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <GlassSurface
          borderRadius={Radius.cardLg}
          borderColor="rgba(16,185,129,0.30)"
          overlayColor="rgba(16,185,129,0.06)"
          style={styles.wrap}
        >
          <LinearGradient
            colors={["rgba(16,185,129,0.18)", "rgba(16,185,129,0.04)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glow}
          />
          <View style={styles.inner}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <IconRoute size={16} color={Colors.greenLt} strokeWidth={2} />
              <Text style={styles.badge}>ROUTINE DETECTED</Text>
            </View>
            <View style={styles.etaBadge}>
              <IconClock size={12} color={Colors.greenLt} strokeWidth={2} />
              <Text style={styles.etaText}>~{etaMinutes} min</Text>
            </View>
          </View>
          <Text style={styles.partner}>
            {partnerName} • {address}
          </Text>
          <Text style={styles.schedule}>{scheduleLabel}</Text>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>View available coupon</Text>
          </View>
        </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  inner: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badge: {
    ...Typography.label,
    color: Colors.greenLt,
    fontSize: 10,
  },
  etaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(16,185,129,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  etaText: {
    ...Typography.caption,
    color: Colors.greenLt,
    fontSize: 11,
  },
  partner: {
    ...Typography.title,
    marginBottom: Spacing.xs,
  },
  schedule: {
    ...Typography.body,
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  cta: {
    backgroundColor: Colors.green,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  ctaText: {
    ...Typography.title,
    fontSize: 15,
    color: Colors.t1,
  },
});
