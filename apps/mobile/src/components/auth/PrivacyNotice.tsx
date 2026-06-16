/**
 * PrivacyNotice
 * Role: public
 * Entry: register permissions step
 * Exit: display-only privacy reassurance
 */
import { StyleSheet, Text } from "react-native";
import { IconShieldCheck } from "@tabler/icons-react-native";
import { GlassSurface } from "../ui/GlassSurface";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export function PrivacyNotice() {
  return (
    <GlassSurface
      borderRadius={Radius.card}
      borderColor="rgba(16,185,129,0.30)"
      overlayColor="rgba(16,185,129,0.08)"
      style={styles.box}
    >
      <IconShieldCheck size={20} color={Colors.greenLt} strokeWidth={2} />
      <Text style={styles.text}>
        Your data is never sold or shared with third parties. In accordance with
        PIPEDA (Canada's Privacy Act).
      </Text>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  text: {
    ...Typography.caption,
    color: Colors.greenLt,
    flex: 1,
    lineHeight: 18,
  },
});
