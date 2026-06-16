/**
 * GlassSurface
 * Role: shared
 * Entry: frosted-glass containers (auth, overlays)
 * Exit: renders children on blur + translucent overlay
 */
import { BlurView } from "expo-blur";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export type GlassTint = "light" | "dark" | "default";

export interface GlassSurfaceProps {
  children: React.ReactNode;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: GlassTint;
  overlayColor?: string;
  borderColor?: string;
}

export function GlassSurface({
  children,
  borderRadius = 14,
  style,
  intensity = 55,
  tint = "dark",
  overlayColor = "rgba(255,255,255,0.08)",
  borderColor = "rgba(255,255,255,0.20)",
}: GlassSurfaceProps) {
  return (
    <View
      style={[
        styles.shell,
        { borderRadius, borderColor },
        style,
      ]}
    >
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFillObject} />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: overlayColor }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderWidth: 1,
  },
});
