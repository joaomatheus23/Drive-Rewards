/**
 * DriverSession
 * Role: driver
 * Entry: tab bar Sessão
 * Exit: start driving session (next iteration)
 */
import { StyleSheet, Text, View } from "react-native";
import { IconMap } from "@tabler/icons-react-native";
import { AppButton, GlassSurface, HomeIndicator, SafeScreen } from "../../components";
import { Colors, Radius, Spacing, Typography } from "../../theme";

export default function DriverSession() {
  return (
    <SafeScreen showHomeIndicator={false}>
      <View style={styles.body}>
        <GlassSurface borderRadius={Radius.cardLg} style={styles.iconWrap}>
          <IconMap size={48} color={Colors.purpleLt} strokeWidth={1.5} />
        </GlassSurface>
        <Text style={styles.title}>Start session</Text>
        <Text style={styles.subtitle}>
          Start driving to earn points and detect routines.
        </Text>
        <AppButton label="Start now" onPress={() => undefined} fullWidth haptic="medium" />
      </View>
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrap: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.heading1,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.xxxl,
    lineHeight: 22,
  },
});
