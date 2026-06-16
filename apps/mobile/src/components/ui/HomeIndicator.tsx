/**
 * HomeIndicator
 * Role: shared
 * Entry: bottom of SafeScreen on iOS-style layouts
 * Exit: display-only home indicator pill
 */
import { Platform, StyleSheet, View } from "react-native";

export interface HomeIndicatorProps {
  visible?: boolean;
}

export function HomeIndicator({ visible = true }: HomeIndicatorProps) {
  if (!visible || Platform.OS !== "ios") {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.pill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.38)",
  },
});
