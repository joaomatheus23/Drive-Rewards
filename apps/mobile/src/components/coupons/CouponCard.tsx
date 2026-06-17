/**
 * CouponCard
 * Role: driver
 * Entry: coupons list
 * Exit: onPress navigates to coupon detail
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { IconChevronRight } from "@tabler/icons-react-native";
import type { Coupon } from "../../types/coupon";
import { CATEGORY_COLOR, displayValue } from "../../types/coupon";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { usePressScale } from "../../hooks/usePressScale";
import { useHaptic } from "../../hooks/useHaptic";
import { getCategoryIcon } from "./categoryIcon";
import { RoutineBadge } from "./RoutineBadge";

export interface CouponCardProps {
  coupon: Coupon;
  onPress: () => void;
}

function formatExpiry(expiresAt: string): { label: string; tone: "default" | "amber" | "red" } {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  const hours = diffMs / (1000 * 60 * 60);

  if (hours <= 0) return { label: "Expired", tone: "red" };
  if (hours < 2) {
    const mins = Math.max(1, Math.round(hours * 60));
    return { label: `${mins}m left`, tone: "red" };
  }
  if (hours < 24) {
    return { label: `${Math.round(hours)}h left`, tone: "amber" };
  }
  return {
    label: new Date(expiresAt).toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    }),
    tone: "default",
  };
}

function formatDistance(km?: number): string {
  if (km === undefined) return "—";
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}

export function CouponCard({ coupon, onPress }: CouponCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();
  const categoryColor = CATEGORY_COLOR[coupon.category];
  const expiry = formatExpiry(coupon.expiresAt);

  const containerStyle = coupon.isRoutine
    ? styles.containerRoutine
    : coupon.isFeatured
      ? styles.containerFeatured
      : styles.containerDefault;

  const expiryStyle =
    expiry.tone === "red"
      ? styles.expiryRed
      : expiry.tone === "amber"
        ? styles.expiryAmber
        : styles.expiryDefault;

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
        style={containerStyle}
      >
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: `${categoryColor}22`,
              borderColor: `${categoryColor}44`,
            },
          ]}
        >
          {getCategoryIcon(coupon.category, 24, categoryColor)}
        </View>

        <View style={styles.center}>
          {coupon.isRoutine ? (
            <RoutineBadge etaMinutes={coupon.routineEtaMinutes} />
          ) : null}
          <Text style={styles.partner}>{coupon.partnerName}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {coupon.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{formatDistance(coupon.distanceKm)}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={[styles.meta, expiryStyle]}>{expiry.label}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={[styles.value, { color: categoryColor }]}>
            {displayValue(coupon.type, coupon.value)}
          </Text>
          <View style={styles.arrowButton}>
            <IconChevronRight size={16} color={Colors.t2} strokeWidth={2.5} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerDefault: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  containerFeatured: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface2,
    borderRadius: Radius.cardLg,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.25)",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  containerRoutine: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface3,
    borderRadius: Radius.cardLg,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    minWidth: 0,
  },
  partner: {
    ...Typography.label,
    color: Colors.t3,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Colors.t1,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    ...Typography.caption,
    color: Colors.t3,
  },
  metaDot: {
    ...Typography.caption,
    color: Colors.t4,
  },
  expiryDefault: {
    color: Colors.t3,
  },
  expiryAmber: {
    color: Colors.amberLt,
  },
  expiryRed: {
    color: Colors.red,
    fontWeight: "700",
  },
  right: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  value: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
});
