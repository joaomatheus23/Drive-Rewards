/**
 * NearbyCouponRow
 * Role: driver
 * Entry: driver home coupons list
 * Exit: onPress → coupon detail
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { IconTicket } from "@tabler/icons-react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface NearbyCouponRowProps {
  title: string;
  partnerName: string;
  valueLabel: string;
  distanceKm: number;
  onPress: () => void;
}

export function NearbyCouponRow({
  title,
  partnerName,
  valueLabel,
  distanceKm,
  onPress,
}: NearbyCouponRowProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    void trigger("light");
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <GlassSurface borderRadius={Radius.card} style={styles.row}>
          <View style={styles.iconWrap}>
            <IconTicket size={22} color={Colors.purpleLt} strokeWidth={2} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.partner}>{partnerName}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{valueLabel}</Text>
            <Text style={styles.distance}>{distanceKm.toFixed(1)}km</Text>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.input,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.title,
    fontSize: 15,
    marginBottom: Spacing.xs,
  },
  partner: {
    ...Typography.caption,
  },
  right: {
    alignItems: "flex-end",
  },
  value: {
    ...Typography.title,
    color: Colors.purpleLt,
    marginBottom: Spacing.xs,
  },
  distance: {
    ...Typography.caption,
  },
});
