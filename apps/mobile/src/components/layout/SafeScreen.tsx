/**
 * SafeScreen
 * Role: shared
 * Entry: wrapper for every screen
 * Exit: renders children with safe areas and status bar
 */
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../theme";
import { HomeIndicator } from "../ui/HomeIndicator";

export interface SafeScreenProps {
  children: React.ReactNode;
  showHomeIndicator?: boolean;
}

export function SafeScreen({ children, showHomeIndicator = true }: SafeScreenProps) {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={styles.content}>{children}</View>
      <HomeIndicator visible={showHomeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
  },
});
