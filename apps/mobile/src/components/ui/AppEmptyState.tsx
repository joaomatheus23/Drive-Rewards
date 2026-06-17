/**
 * AppEmptyState
 * Role: shared
 * Entry: empty lists, search with no results
 * Exit: optional CTA via onAction
 */
import { StyleSheet, View } from "react-native";
import { AppButton } from "./AppButton";
import { AppText } from "./AppText";
import { Spacing } from "../../theme";

export interface AppEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AppEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: AppEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>{icon}</View>
      <AppText variant="heading2" tone="primary" align="center">
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" align="center" style={styles.description}>
        {description}
      </AppText>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <AppButton label={actionLabel} onPress={onAction} variant="glassPrimary" fullWidth />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  iconWrap: {
    marginBottom: Spacing.lg,
  },
  description: {
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  action: {
    width: "100%",
    marginTop: Spacing.xl,
  },
});
