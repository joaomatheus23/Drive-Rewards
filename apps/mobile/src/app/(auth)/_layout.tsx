/**
 * AuthLayout
 * Role: public
 * Entry: auth route group
 * Exit: login, register screens
 */
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.screen,
        animation: "fade",
      }}
    >
      <Stack.Screen name="splash" options={{ animation: "none" }} />
      <Stack.Screen name="login" options={{ animation: "none" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.bg,
  },
});
