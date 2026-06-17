/**
 * EmptyCouponsState
 * Role: driver
 * Entry: coupons list with no results
 * Exit: optional start session CTA for routine filter
 */
import { StyleSheet, View } from "react-native";
import { IconTicketOff } from "@tabler/icons-react-native";
import { router } from "expo-router";
import type { CouponFilterKey } from "../../types/coupon";
import { AppButton } from "../ui/AppButton";
import { AppText } from "../ui/AppText";
import { Colors, Spacing } from "../../theme";

export interface EmptyCouponsStateProps {
  filter: CouponFilterKey;
}

function getCopy(filter: CouponFilterKey): { title: string; subtitle: string } {
  switch (filter) {
    case "routine":
      return {
        title: "No routine offers nearby",
        subtitle: "Start a session to discover coupons along your route.",
      };
    case "nearby":
      return {
        title: "Nothing close by",
        subtitle: "Try widening your search or check back later.",
      };
    case "cafe":
      return {
        title: "No café coupons",
        subtitle: "New partner offers appear throughout the day.",
      };
    case "gas":
      return {
        title: "No gas coupons",
        subtitle: "Fuel partners update offers weekly.",
      };
    case "restaurant":
      return {
        title: "No restaurant coupons",
        subtitle: "Check again during lunch and dinner hours.",
      };
    case "repair":
      return {
        title: "No repair coupons",
        subtitle: "Maintenance partners join the network regularly.",
      };
    default:
      return {
        title: "No coupons available",
        subtitle: "Pull to refresh or adjust your filters.",
      };
  }
}

export function EmptyCouponsState({ filter }: EmptyCouponsStateProps) {
  const copy = getCopy(filter);

  return (
    <View style={styles.container}>
      <IconTicketOff size={48} color={Colors.t4} strokeWidth={1.5} />
      <AppText variant="heading2" tone="primary" align="center" style={styles.title}>
        {copy.title}
      </AppText>
      <AppText variant="body" tone="secondary" align="center" style={styles.subtitle}>
        {copy.subtitle}
      </AppText>
      {filter === "routine" ? (
        <View style={styles.action}>
          <AppButton
            label="Start a session"
            variant="ghost"
            onPress={() => router.push("/(driver)/session")}
            fullWidth
          />
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
  title: {
    marginTop: Spacing.lg,
  },
  subtitle: {
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  action: {
    width: "100%",
    marginTop: Spacing.xl,
  },
});
