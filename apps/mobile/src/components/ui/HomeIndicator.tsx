/**
 * HomeIndicator
 * Role: shared
 * Entry: bottom of SafeScreen on iOS-style layouts
 * Exit: display-only home indicator pill
 */
import { Platform, StyleSheet, View } from "react-native";
import { Layout } from "../../theme";

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
    height: Layout.homeIndicator.containerHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    width: Layout.homeIndicator.width,
    height: Layout.homeIndicator.height,
    borderRadius: Layout.homeIndicator.borderRadius,
    backgroundColor: Layout.homeIndicator.color,
  },
});
