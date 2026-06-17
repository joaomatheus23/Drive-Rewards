/**
 * CouponsStackLayout
 * Role: driver
 * Entry: coupons tab
 * Exit: list, detail and QR screens
 */
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Colors } from "../../../theme";

export default function CouponsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.screen,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="qr" options={{ animation: "slide_from_bottom" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.bg,
  },
});
