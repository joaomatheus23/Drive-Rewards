/**
 * StatCard
 * Role: driver
 * Entry: home dashboard, session summary, profile
 * Exit: display-only metric card
 */
import { StyleSheet, Text, View } from "react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export type StatAccent = "purple" | "green" | "amber" | "default";

export interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: StatAccent;
}

export function StatCard({
  label,
  value,
  icon,
  accent = "default",
}: StatCardProps) {
  const valueStyle =
    accent === "purple"
      ? styles.valuePurple
      : accent === "green"
        ? styles.valueGreen
        : accent === "amber"
          ? styles.valueAmber
          : styles.valueDefault;

  return (
    <GlassSurface borderRadius={Radius.card} style={styles.card}>
      <View style={styles.header}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.lg,
    minHeight: 96,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: Spacing.sm,
  },
  label: {
    ...Typography.label,
  },
  value: {
    ...Typography.heading2,
    marginTop: Spacing.md,
  },
  valueDefault: {
    color: Colors.t1,
  },
  valuePurple: {
    color: Colors.purpleLt,
  },
  valueGreen: {
    color: Colors.greenLt,
  },
  valueAmber: {
    color: Colors.amberLt,
  },
});
