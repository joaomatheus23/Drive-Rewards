/**
 * AuthDivider
 * Role: public
 * Entry: login / register social section
 * Exit: display-only divider
 */
import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

export interface AuthDividerProps {
  compact?: boolean;
}

export function AuthDivider({ compact = false }: AuthDividerProps) {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={styles.line} />
      <Text style={styles.text}>or continue with</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  rowCompact: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  text: {
    ...Typography.caption,
    marginHorizontal: Spacing.md,
  },
});
