/**
 * QrCodeView
 * Role: mobile
 * Entry: QR redemption screen
 * Exit: renders scannable QR using react-native-svg (no extra native module)
 */
import { useMemo } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
// Direct core import — avoids node canvas/server entry in Metro.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const createQrMatrix = require("qrcode/lib/core/qrcode").create as (
  value: string,
  options?: { errorCorrectionLevel?: "L" | "M" | "Q" | "H" },
) => { modules: { size: number; get: (row: number, col: number) => boolean } };
import Svg, { Path, Rect } from "react-native-svg";
import { Colors, Typography } from "../../theme";

export interface QrCodeViewProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

function buildQrPath(
  modules: { size: number; get: (row: number, col: number) => boolean },
  size: number,
): string {
  const count = modules.size;
  const cell = size / count;
  const parts: string[] = [];

  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!modules.get(row, col)) continue;
      const x = col * cell;
      const y = row * cell;
      parts.push(`M${x},${y}h${cell}v${cell}h-${cell}z`);
    }
  }

  return parts.join("");
}

export function QrCodeView({
  value,
  size = 220,
  backgroundColor = "#FFFFFF",
  color = "#0D0D1A",
  style,
}: QrCodeViewProps) {
  const qrPath = useMemo(() => {
    if (!value) return null;
    try {
      const matrix = createQrMatrix(value, { errorCorrectionLevel: "M" });
      return buildQrPath(matrix.modules, size);
    } catch {
      return null;
    }
  }, [size, value]);

  if (!value || !qrPath) {
    return (
      <View style={[styles.fallback, { width: size, height: size }, style]}>
        <Text style={styles.fallbackText}>QR unavailable</Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Rect x={0} y={0} width={size} height={size} fill={backgroundColor} />
        <Path d={qrPath} fill={color} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  fallbackText: {
    ...Typography.caption,
    color: Colors.t3,
    textAlign: "center",
  },
});
