/**
 * CouponFilterBar
 * Role: driver
 * Entry: CouponsScreen below search
 * Exit: updates couponStore filter
 */
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import {
  IconCoffee,
  IconFilter,
  IconGasStation,
  IconMapPin,
  IconRoute,
  IconTool,
  IconToolsKitchen2,
} from "@tabler/icons-react-native";
import type { CouponFilterKey } from "../../types/coupon";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { usePressScale } from "../../hooks/usePressScale";
import { useHaptic } from "../../hooks/useHaptic";

const FILTERS: Array<{
  key: CouponFilterKey;
  label: string;
  icon: ReactNode;
}> = [
  { key: "all", label: "All", icon: <IconFilter size={14} color={Colors.t2} strokeWidth={2} /> },
  { key: "routine", label: "Routine", icon: <IconRoute size={14} color={Colors.t2} strokeWidth={2} /> },
  { key: "nearby", label: "Nearby", icon: <IconMapPin size={14} color={Colors.t2} strokeWidth={2} /> },
  { key: "cafe", label: "Café", icon: <IconCoffee size={14} color={Colors.t2} strokeWidth={2} /> },
  { key: "gas", label: "Gas", icon: <IconGasStation size={14} color={Colors.t2} strokeWidth={2} /> },
  { key: "restaurant", label: "Food", icon: <IconToolsKitchen2 size={14} color={Colors.t2} strokeWidth={2} /> },
  { key: "repair", label: "Repair", icon: <IconTool size={14} color={Colors.t2} strokeWidth={2} /> },
];

export interface CouponFilterBarProps {
  active: CouponFilterKey;
  onChange: (filter: CouponFilterKey) => void;
}

function FilterChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: ReactNode;
  selected: boolean;
  onPress: () => void;
}) {
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
        style={[styles.chip, selected ? styles.chipActive : styles.chipInactive]}
      >
        <View style={styles.chipIcon}>{icon}</View>
        <Text style={[styles.chipLabel, selected ? styles.chipLabelActive : styles.chipLabelInactive]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function CouponFilterBar({ active, onChange }: CouponFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((item) => (
        <FilterChip
          key={item.key}
          label={item.label}
          icon={item.icon}
          selected={active === item.key}
          onPress={() => onChange(item.key)}
        />
      ))}
      <View style={styles.trailingSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    alignItems: "center",
  },
  trailingSpace: {
    width: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  chipActive: {
    backgroundColor: Colors.purple,
  },
  chipInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipIcon: {
    opacity: 0.9,
  },
  chipLabel: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: "700",
  },
  chipLabelActive: {
    color: Colors.t1,
  },
  chipLabelInactive: {
    color: Colors.t2,
  },
});
