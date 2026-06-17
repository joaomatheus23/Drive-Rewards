/**
 * QRCodeScreen
 * Role: driver
 * Entry: CouponDetailScreen → generateQR success
 * Exit: → home after confirmation | ← back (invalidates token)
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconCircleCheck } from "@tabler/icons-react-native";
import { AppButton, HomeIndicator, PageHeader } from "../../components";
import { QrCodeView } from "../../components/coupons/QrCodeView";
import {
  fetchRedemptionStatus,
  invalidateRedemption,
} from "../../services/coupon.service";
import { useCouponStore } from "../../store/couponStore";
import { encodeRedemptionQrPayload, routeParam } from "../../utils/qrRedemption";
import { displayValue, type CouponType } from "../../types/coupon";
import { BlurIntensity, Colors, Radius, Spacing, SpringConfig, Typography } from "../../theme";

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function countdownTone(ms: number): "green" | "amber" | "red" {
  const min = ms / 60000;
  if (min <= 1) return "red";
  if (min <= 5) return "amber";
  return "green";
}

export function QRCodeScreen() {
  const params = useLocalSearchParams();
  const activeRedemption = useCouponStore((s) => s.activeRedemption);
  const setActiveRedemption = useCouponStore((s) => s.setActiveRedemption);

  const redemptionId =
    activeRedemption?.redemptionId ?? routeParam(params.redemptionId);
  const qrToken = activeRedemption?.qrToken ?? routeParam(params.qrToken);
  const expiresAt =
    activeRedemption?.expiresAt ??
    (routeParam(params.expiresAt) || new Date().toISOString());
  const bonusPoints =
    activeRedemption?.bonusPoints ?? Number(routeParam(params.bonusPoints) || 0);
  const partnerName =
    activeRedemption?.partnerName ?? (routeParam(params.partnerName) || "Partner");
  const title = activeRedemption?.title ?? (routeParam(params.title) || "Coupon");
  const couponType = (
    activeRedemption?.type ?? (routeParam(params.type) || "percent_off")
  ) as CouponType;
  const couponValue =
    activeRedemption?.value ?? Number(routeParam(params.value) || 0);

  const [remainingMs, setRemainingMs] = useState(
    () => new Date(expiresAt).getTime() - Date.now(),
  );
  const [confirmed, setConfirmed] = useState(false);
  const [expired, setExpired] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shake = useSharedValue(0);
  const overlayScale = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: overlayScale.value }],
    opacity: overlayScale.value,
  }));

  const tone = countdownTone(remainingMs);
  const countdownStyle =
    tone === "red"
      ? styles.countdownRed
      : tone === "amber"
        ? styles.countdownAmber
        : styles.countdownGreen;

  const qrPayload = useMemo(
    () => (qrToken ? encodeRedemptionQrPayload(qrToken) : ""),
    [qrToken],
  );
  const hasQrSession = Boolean(redemptionId && qrToken);

  const typeDescription = useMemo(() => {
    if (couponType === "percent_off") return "Percentage discount";
    if (couponType === "fixed_off") return "Fixed amount off";
    if (couponType === "free_item") return "Free item";
    return "Buy one get one";
  }, [couponType]);

  const handleBack = useCallback(() => {
    if (redemptionId && !confirmed) {
      void invalidateRedemption(redemptionId);
    }
    setActiveRedemption(null);
    router.back();
  }, [confirmed, redemptionId, setActiveRedemption]);

  const handleRegenerate = useCallback(() => {
    setActiveRedemption(null);
    router.back();
  }, [setActiveRedemption]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const next = new Date(expiresAt).getTime() - Date.now();
      setRemainingMs(next);
      if (next <= 0) {
        setExpired(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
      if (next > 0 && next <= 60000) {
        shake.value = withRepeat(withSpring(4, SpringConfig), -1, true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [expiresAt, shake]);

  useEffect(() => {
    if (!redemptionId || confirmed || expired) return;

    pollRef.current = setInterval(() => {
      void fetchRedemptionStatus(redemptionId).then((status) => {
        if (status.status === "confirmed") {
          setConfirmed(true);
          overlayScale.value = withSpring(1, SpringConfig);
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(() => {
            setActiveRedemption(null);
            router.replace("/(driver)");
          }, 2500);
        }
        if (status.status === "expired") {
          setExpired(true);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      });
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [confirmed, expired, overlayScale, redemptionId, setActiveRedemption]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <PageHeader title="Your QR code" onBack={handleBack} />

      <View style={styles.body}>
        <View style={styles.partnerRow}>
          <Text style={styles.partnerName}>{partnerName}</Text>
          <Text style={styles.couponTitle}>{title}</Text>
        </View>

        <View style={styles.valueHero}>
          <Text style={styles.valueLarge}>{displayValue(couponType, couponValue)}</Text>
          <Text style={styles.valueDescription}>{typeDescription}</Text>
        </View>

        <Animated.View style={shakeStyle}>
          <View style={styles.qrWrap}>
            {!hasQrSession ? (
              <View style={styles.qrExpired}>
                <Text style={styles.qrExpiredText}>Could not load QR</Text>
                <Text style={styles.qrExpiredHint}>Go back and tap Generate QR Code again.</Text>
              </View>
            ) : expired ? (
              <View style={styles.qrExpired}>
                <Text style={styles.qrExpiredText}>QR expired</Text>
              </View>
            ) : (
              <QrCodeView value={qrPayload} size={220} backgroundColor="#FFFFFF" color="#0D0D1A" />
            )}
          </View>
        </Animated.View>

        <Text style={[styles.countdown, countdownStyle]}>
          {expired ? "00:00" : formatCountdown(remainingMs)}
        </Text>

        <Text style={styles.bonusNote}>+{bonusPoints} bonus points on confirmation</Text>

        {expired ? (
          <AppButton
            label="Generate again"
            onPress={handleRegenerate}
            variant="glassPrimary"
            haptic="medium"
            fullWidth
          />
        ) : null}
      </View>

      <BlurView intensity={BlurIntensity.tabBar} tint="dark" style={styles.noteBar}>
        <Text style={styles.noteText}>
          Show this code to the partner staff. It refreshes automatically and expires after 15
          minutes.
        </Text>
      </BlurView>

      {confirmed ? (
        <View style={styles.confirmedOverlay}>
          <Animated.View style={[styles.confirmedCard, overlayStyle]}>
            <View style={styles.checkCircle}>
              <IconCircleCheck size={52} color={Colors.greenLt} strokeWidth={1.8} />
            </View>
            <Text style={styles.confirmedTitle}>+{bonusPoints} pts added</Text>
            <Text style={styles.confirmedSubtitle}>Redemption confirmed</Text>
          </Animated.View>
        </View>
      ) : null}

      <HomeIndicator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    gap: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  partnerRow: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  partnerName: {
    ...Typography.label,
    color: Colors.t3,
    textTransform: "uppercase",
  },
  couponTitle: {
    ...Typography.title,
    textAlign: "center",
  },
  valueHero: {
    alignItems: "center",
    gap: 4,
  },
  valueLarge: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
    color: Colors.purpleLt,
  },
  valueDescription: {
    ...Typography.caption,
    color: Colors.t3,
  },
  qrWrap: {
    width: 240,
    height: 240,
    borderRadius: Radius.card,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  qrExpired: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
  },
  qrExpiredText: {
    ...Typography.title,
    color: Colors.red,
    textAlign: "center",
  },
  qrExpiredHint: {
    ...Typography.caption,
    color: Colors.t3,
    textAlign: "center",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  countdown: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  countdownGreen: {
    color: Colors.greenLt,
  },
  countdownAmber: {
    color: Colors.amberLt,
  },
  countdownRed: {
    color: Colors.red,
  },
  bonusNote: {
    ...Typography.body,
    color: Colors.t2,
  },
  noteBar: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  noteText: {
    ...Typography.caption,
    color: Colors.t3,
    textAlign: "center",
    lineHeight: 18,
  },
  confirmedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,13,26,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmedCard: {
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    backgroundColor: "rgba(16,185,129,0.16)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmedTitle: {
    ...Typography.heading1,
    color: Colors.greenLt,
  },
  confirmedSubtitle: {
    ...Typography.body,
    color: Colors.t2,
  },
});
