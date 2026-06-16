/**
 * VehicleTypeGrid
 * Role: public
 * Entry: register step 2
 * Exit: onSelect vehicle type
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import {
  IconBike,
  IconCar,
  IconMotorbike,
  IconScooter,
  IconTruck,
  IconWalk,
} from "@tabler/icons-react-native";
import type { VehicleType } from "@driven-rewards/shared";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { usePressScale } from "../../hooks/usePressScale";

export interface VehicleOption {
  type: VehicleType;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { type: "car", label: "Car", icon: IconCar },
  { type: "motorcycle", label: "Motorcycle", icon: IconMotorbike },
  { type: "bike", label: "Bike", icon: IconBike },
  { type: "van", label: "Van", icon: IconTruck },
  { type: "scooter", label: "Scooter", icon: IconScooter },
  { type: "walk", label: "Walking", icon: IconWalk },
];

export interface VehicleTypeGridProps {
  selected: VehicleType | null;
  onSelect: (type: VehicleType) => void;
  compact?: boolean;
}

interface VehicleCardProps {
  option: VehicleOption;
  selected: boolean;
  compact: boolean;
  onPress: () => void;
}

function VehicleCard({ option, selected, compact, onPress }: VehicleCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const { trigger } = useHaptic();
  const Icon = option.icon;

  const handlePress = () => {
    void trigger("light");
    onPress();
  };

  const labelStyle = selected ? styles.labelSelected : styles.labelDefault;
  const iconColor = selected ? Colors.purpleLt : Colors.t3;
  const dotStyle = selected ? styles.dotSelected : styles.dotDefault;

  return (
    <Animated.View style={[styles.cardWrap, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <GlassSurface
          borderRadius={Radius.card}
          borderColor={selected ? "rgba(196,132,252,0.55)" : "rgba(255,255,255,0.20)"}
          overlayColor={selected ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.08)"}
          style={[styles.card, compact && styles.cardCompact]}
        >
          <Icon size={compact ? 22 : 28} color={iconColor} strokeWidth={1.8} />
          <Text style={[styles.label, compact && styles.labelCompact, labelStyle]}>
            {option.label}
          </Text>
          <View style={[styles.dot, dotStyle]} />
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

export function VehicleTypeGrid({
  selected,
  onSelect,
  compact = false,
}: VehicleTypeGridProps) {
  return (
    <View style={[styles.grid, compact && styles.gridCompact]}>
      {VEHICLE_OPTIONS.map((option) => (
        <VehicleCard
          key={option.type}
          option={option}
          compact={compact}
          selected={selected === option.type}
          onPress={() => onSelect(option.type)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridCompact: {
    gap: Spacing.sm,
  },
  cardWrap: {
    width: "47%",
  },
  card: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  cardCompact: {
    paddingVertical: Spacing.md,
    minHeight: 92,
  },
  label: {
    ...Typography.body,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  labelCompact: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    fontSize: 14,
  },
  labelDefault: {
    color: Colors.t2,
  },
  labelSelected: {
    color: Colors.purpleLt,
    fontWeight: "700",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  dotDefault: {
    borderWidth: 1.5,
    borderColor: Colors.t4,
    backgroundColor: "transparent",
  },
  dotSelected: {
    backgroundColor: Colors.purple,
    borderWidth: 0,
  },
});
