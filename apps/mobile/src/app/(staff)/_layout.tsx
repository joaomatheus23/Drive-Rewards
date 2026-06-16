/**
 * StaffLayout
 * Role: partner_staff
 * Entry: login as partner_staff
 * Exit: scanner screen
 */
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default function StaffLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: styles.screen }} />
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.bg,
  },
});
