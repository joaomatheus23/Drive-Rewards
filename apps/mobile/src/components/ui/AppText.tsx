/**
 * AppText
 * Role: shared
 * Entry: any screen needing typed typography
 * Exit: renders styled Text node
 */
import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";
import { Colors, Typography, type TypographyVariant } from "../../theme";

export type AppTextTone = "primary" | "secondary" | "muted" | "faint" | "accent" | "danger" | "success";

export interface AppTextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  tone?: AppTextTone;
  align?: "left" | "center" | "right";
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

export function AppText({
  variant = "body",
  children,
  tone,
  align = "left",
  numberOfLines,
  style,
}: AppTextProps) {
  const toneStyle = tone ? styles[`tone_${tone}`] : null;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[Typography[variant], styles[`align_${align}`], toneStyle, style]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  align_left: {
    textAlign: "left",
  },
  align_center: {
    textAlign: "center",
  },
  align_right: {
    textAlign: "right",
  },
  tone_primary: {
    color: Colors.t1,
  },
  tone_secondary: {
    color: Colors.t2,
  },
  tone_muted: {
    color: Colors.t3,
  },
  tone_faint: {
    color: Colors.t4,
  },
  tone_accent: {
    color: Colors.purpleLt,
  },
  tone_danger: {
    color: Colors.red,
  },
  tone_success: {
    color: Colors.greenLt,
  },
});
