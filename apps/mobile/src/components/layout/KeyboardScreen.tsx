/**
 * KeyboardScreen
 * Role: shared
 * Entry: forms and inputs on driver screens
 * Exit: wraps children with keyboard avoidance
 */
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Colors } from "../../theme";

export interface KeyboardScreenProps {
  children: React.ReactNode;
  offset?: number;
}

export function KeyboardScreen({ children, offset = 12 }: KeyboardScreenProps) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? offset : 0}
    >
      <View style={styles.flex}>{children}</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
});
