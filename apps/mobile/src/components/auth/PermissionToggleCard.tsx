/**
 * PermissionToggleCard
 * Role: public
 * Entry: register permissions step
 * Exit: toggle onChange
 */
import { StyleSheet, Switch, Text, View } from "react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export interface PermissionToggleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (value: boolean) => void;
}

export function PermissionToggleCard({
  title,
  description,
  icon,
  enabled,
  disabled = false,
  onToggle,
}: PermissionToggleCardProps) {
  return (
    <GlassSurface
      borderRadius={Radius.card}
      borderColor={enabled ? "rgba(196,132,252,0.40)" : "rgba(255,255,255,0.20)"}
      overlayColor={enabled ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.08)"}
      style={[styles.card, disabled && styles.cardDisabled]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: Colors.borderMd, true: Colors.purple }}
        thumbColor={Colors.t1}
        ios_backgroundColor={Colors.borderMd}
      />
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.input,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.title,
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.caption,
    lineHeight: 16,
  },
});
