/**
 * StaffScanner
 * Role: partner_staff
 * Entry: login as partner_staff
 * Exit: QR scan flow (next iteration)
 */
import { StyleSheet, Text, View } from "react-native";
import { IconQrcode } from "@tabler/icons-react-native";
import { SafeScreen, PageHeader, GlassSurface } from "../../components";
import { useAuthStore } from "../../store/auth.store";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export default function StaffScanner() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <SafeScreen>
      <PageHeader
        title="QR Scanner"
        subtitle={user?.name}
        rightSlot={
          <Text style={styles.logout} onPress={() => void logout()}>
            Sign out
          </Text>
        }
      />
      <View style={styles.body}>
        <GlassSurface borderRadius={Radius.cardLg} style={styles.scanArea}>
          <IconQrcode size={64} color={Colors.purpleLt} strokeWidth={1.5} />
          <Text style={styles.hint}>Point the camera at the driver's QR code</Text>
        </GlassSurface>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "center",
  },
  scanArea: {
    padding: Spacing.xxxl,
    alignItems: "center",
  },
  hint: {
    ...Typography.body,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  logout: {
    ...Typography.caption,
    color: Colors.purpleLt,
  },
});
