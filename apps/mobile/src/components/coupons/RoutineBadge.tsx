/**
 * RoutineBadge
 * Role: driver
 * Entry: coupon cards on routine offers
 * Exit: inline routine label with optional ETA
 */
import { StyleSheet, Text, View } from "react-native";
import { IconRoute } from "@tabler/icons-react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export interface RoutineBadgeProps {
  etaMinutes?: number;
}

export function RoutineBadge({ etaMinutes }: RoutineBadgeProps) {
  return (
    <View style={styles.badge}>
      <IconRoute size={12} color={Colors.greenLt} strokeWidth={2.2} />
      <Text style={styles.label}>
        On your route
        {etaMinutes !== undefined ? ` · ~${etaMinutes}min` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: "rgba(16,185,129,0.14)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.greenLt,
    fontWeight: "700",
  },
});
