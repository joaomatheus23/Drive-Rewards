/**
 * StaffScanner
 * Role: partner_staff | partner_owner
 * Entry: login as partner staff/owner
 * Exit: confirms driver QR redemptions via camera scan
 */
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import * as Haptics from "expo-haptics";
import { IconCircleCheck, IconQrcode, IconRefresh } from "@tabler/icons-react-native";
import { AppButton, GlassSurface, PageHeader, SafeScreen } from "../../components";
import { scanRedemptionQr } from "../../services/coupon.service";
import { getApiErrorMessage } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { ScanRedemptionResult } from "../../types/coupon";
import { Colors, Radius, Spacing, Typography } from "../../theme";

type ScanPhase = "idle" | "scanning" | "success" | "error";

export default function StaffScanner() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [result, setResult] = useState<ScanRedemptionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const processingRef = useRef(false);

  const resetScanner = useCallback(() => {
    processingRef.current = false;
    setPhase("idle");
    setResult(null);
    setErrorMessage(null);
  }, []);

  const handleBarcodeScanned = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (processingRef.current || phase !== "idle") return;
      processingRef.current = true;
      setPhase("scanning");
      setErrorMessage(null);

      try {
        const scanResult = await scanRedemptionQr(data);
        setResult(scanResult);
        setPhase("success");
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (err) {
        setErrorMessage(getApiErrorMessage(err));
        setPhase("error");
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => {
          resetScanner();
        }, 2500);
      }
    },
    [phase, resetScanner],
  );

  const handleRequestPermission = useCallback(() => {
    void requestPermission();
  }, [requestPermission]);

  return (
    <SafeScreen>
      <PageHeader
        title="QR Scanner"
        subtitle={user?.name}
        rightSlot={
          <Text style={styles.logout} onPress={() => void logout()}>
            Sign out
          </Text>
        }
      />

      <View style={styles.body}>
        {!permission ? (
          <GlassSurface borderRadius={Radius.cardLg} style={styles.placeholder}>
            <ActivityIndicator color={Colors.purpleLt} />
          </GlassSurface>
        ) : !permission.granted ? (
          <GlassSurface borderRadius={Radius.cardLg} style={styles.placeholder}>
            <IconQrcode size={56} color={Colors.purpleLt} strokeWidth={1.5} />
            <Text style={styles.hint}>
              Camera access is required to scan driver QR codes at checkout.
            </Text>
            <AppButton
              label="Allow camera"
              onPress={handleRequestPermission}
              variant="glassPrimary"
              haptic="medium"
              fullWidth
            />
          </GlassSurface>
        ) : phase === "success" && result ? (
          <GlassSurface borderRadius={Radius.cardLg} style={styles.resultCard}>
            <View style={styles.successIcon}>
              <IconCircleCheck size={48} color={Colors.greenLt} strokeWidth={1.8} />
            </View>
            <Text style={styles.successTitle}>Redemption confirmed</Text>
            <Text style={styles.successDriver}>{result.driverName}</Text>
            <Text style={styles.successCoupon}>{result.couponTitle}</Text>
            {result.bonusPoints > 0 ? (
              <Text style={styles.successBonus}>+{result.bonusPoints} bonus pts</Text>
            ) : null}
            <AppButton
              label="Scan next"
              onPress={resetScanner}
              variant="glassPrimary"
              haptic="light"
              fullWidth
            />
          </GlassSurface>
        ) : (
          <View style={styles.cameraWrap}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={phase === "idle" ? handleBarcodeScanned : undefined}
            />
            <View style={styles.overlay}>
              <View style={styles.frame} />
              <Text style={styles.overlayHint}>
                {phase === "scanning"
                  ? "Confirming redemption…"
                  : phase === "error"
                    ? errorMessage ?? "Invalid QR code"
                    : "Point at the driver's QR code"}
              </Text>
              {phase === "scanning" ? (
                <ActivityIndicator color={Colors.purpleLt} style={styles.scanSpinner} />
              ) : phase === "error" ? (
                <Pressable onPress={resetScanner} style={styles.retryRow}>
                  <IconRefresh size={16} color={Colors.purpleLt} />
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: "center",
  },
  placeholder: {
    padding: Spacing.xxxl,
    alignItems: "center",
    gap: Spacing.lg,
  },
  hint: {
    ...Typography.body,
    textAlign: "center",
    color: Colors.t2,
  },
  cameraWrap: {
    flex: 1,
    borderRadius: Radius.cardLg,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    minHeight: 420,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    backgroundColor: "rgba(13,13,26,0.35)",
  },
  frame: {
    width: 220,
    height: 220,
    borderRadius: Radius.card,
    borderWidth: 2,
    borderColor: Colors.purpleLt,
    backgroundColor: "transparent",
  },
  overlayHint: {
    ...Typography.body,
    color: Colors.t1,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  scanSpinner: {
    marginTop: Spacing.md,
  },
  retryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  retryText: {
    ...Typography.caption,
    color: Colors.purpleLt,
  },
  resultCard: {
    padding: Spacing.xxxl,
    alignItems: "center",
    gap: Spacing.sm,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: "rgba(16,185,129,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  successTitle: {
    ...Typography.heading2,
    color: Colors.greenLt,
  },
  successDriver: {
    ...Typography.title,
    textAlign: "center",
  },
  successCoupon: {
    ...Typography.body,
    color: Colors.t2,
    textAlign: "center",
  },
  successBonus: {
    ...Typography.caption,
    color: Colors.amberLt,
    marginBottom: Spacing.md,
  },
  logout: {
    ...Typography.caption,
    color: Colors.purpleLt,
  },
});
