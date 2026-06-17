/**
 * SessionStackLayout
 * Role: driver
 * Entry: session tab navigation
 * Exit: session index, active and summary screens
 */
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Colors } from "../../../theme";

export default function SessionStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.screen,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="active" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="summary" options={{ animation: "fade" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.bg,
  },
});
