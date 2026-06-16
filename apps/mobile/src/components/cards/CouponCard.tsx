/**
 * CouponCard
 * Role: driver
 * Entry: coupons list, home offers section
 * Exit: onPress → coupon detail
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { IconTicket } from "@tabler/icons-react-native";
import type { CouponType } from "@driven-rewards/shared";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { usePressScale } from "../../hooks/usePressScale";
import { useHaptic } from "../../hooks/useHaptic";

export interface CouponCardProps {
  title: string;
  partnerName: string;
  type: CouponType;
  value: number;
  expiresAt: Date;
  onPress: () => void;
}

function formatDiscount(type: CouponType, value: number): string {
  if (type === "percentage") return `${value}% OFF`;
  if (type === "fixed") return `$${(value / 100).toFixed(2)} OFF`;
  if (type === "bogo") return "BOGO";
  return "FREE ITEM";
}

function formatExpiry(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CouponCard({
  title,
  partnerName,
  type,
  value,
  expiresAt,
  onPress,
}: CouponCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();

  const handlePress = () => {
    void trigger("light");
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <GlassSurface borderRadius={Radius.card} style={styles.card}>
          <View style={styles.iconWrap}>
            <IconTicket size={22} color={Colors.purpleLt} strokeWidth={2} />
          </View>
          <View style={styles.content}>
            <Text style={styles.partner}>{partnerName}</Text>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.footer}>
              <Text style={styles.discount}>{formatDiscount(type, value)}</Text>
              <Text style={styles.expiry}>Exp {formatExpiry(expiresAt)}</Text>
            </View>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: Spacing.lg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.button,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  partner: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.title,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discount: {
    ...Typography.caption,
    color: Colors.greenLt,
  },
  expiry: {
    ...Typography.caption,
  },
});
