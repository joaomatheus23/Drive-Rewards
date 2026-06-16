/**
 * PasswordStrength
 * Role: public
 * Entry: register step 1 password field
 * Exit: visual strength indicator
 */
import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import {
  getPasswordStrength,
  type PasswordStrengthLevel,
} from "../../utils/password-strength";

export interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const result = getPasswordStrength(password);

  if (!password) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.segments}>
        {[1, 2, 3, 4].map((segment) => {
          const style = getSegmentStyle(segment, result.level, result.score);
          return <View key={segment} style={[styles.segment, style]} />;
        })}
      </View>
      <Text style={getLabelStyle(result.level)}>{result.label}</Text>
    </View>
  );
}

function getSegmentStyle(
  segment: number,
  level: PasswordStrengthLevel,
  score: number,
): object {
  if (score < segment) return styles.segmentEmpty;
  if (level === "weak" || level === "fair") return styles.segmentFair;
  return styles.segmentStrong;
}

function getLabelStyle(level: PasswordStrengthLevel): object {
  if (level === "strong" || level === "good") return styles.labelStrong;
  if (level === "fair") return styles.labelFair;
  return styles.labelWeak;
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  segments: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.xs,
    marginRight: Spacing.md,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
  },
  segmentEmpty: {
    backgroundColor: Colors.borderMd,
  },
  segmentFair: {
    backgroundColor: Colors.amber,
  },
  segmentStrong: {
    backgroundColor: Colors.green,
  },
  labelWeak: {
    ...Typography.caption,
    color: Colors.red,
  },
  labelFair: {
    ...Typography.caption,
    color: Colors.amberLt,
  },
  labelStrong: {
    ...Typography.caption,
    color: Colors.greenLt,
  },
});
