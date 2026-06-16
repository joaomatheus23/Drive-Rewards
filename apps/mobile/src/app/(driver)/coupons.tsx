/**
 * DriverCoupons
 * Role: driver
 * Entry: tab bar Cupons / home ver todos
 * Exit: coupon detail (next iteration)
 */
import { StyleSheet, Text, View } from "react-native";
import { CouponCard, HomeIndicator, SafeScreen } from "../../components";
import { Spacing, Typography } from "../../theme";

export default function DriverCoupons() {
  return (
    <SafeScreen showHomeIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Coupons</Text>
      </View>
      <View style={styles.list}>
        <CouponCard
          title="20% off any drink"
          partnerName="The Forks Cafe"
          type="percentage"
          value={20}
          expiresAt={new Date("2026-12-31")}
          onPress={() => undefined}
        />
      </View>
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading1,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },
});
