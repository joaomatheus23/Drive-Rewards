/**
 * CouponDetailScreen
 * Role: driver
 * Entry: CouponsScreen → coupon card press
 * Exit: → QRCodeScreen | ← back
 */
import { useCallback, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  IconClock,
  IconMapPin,
  IconShare2,
  IconStar,
} from "@tabler/icons-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AppButton,
  AppCard,
  PageHeader,
} from "../../components";
import { getCategoryIcon } from "../../components/coupons";
import { RoutineBadge } from "../../components/coupons/RoutineBadge";
import { useCouponDetail } from "../../hooks/useCouponDetail";
import { generateCouponQr } from "../../services/coupon.service";
import { useCouponStore } from "../../store/couponStore";
import { getApiErrorMessage } from "../../services/api";
import {
  CATEGORY_COLOR,
  displayValue,
  type Coupon,
  type CouponType,
} from "../../types/coupon";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useHaptic } from "../../hooks/useHaptic";
import { useDriverTabBarPadding } from "../../hooks/useDriverTabBarPadding";

export interface CouponDetailScreenProps {
  couponId: string;
}

function valueBadgeColors(type: CouponType): { bg: string; text: string } {
  if (type === "free_item") return { bg: "rgba(16,185,129,0.18)", text: Colors.greenLt };
  if (type === "bogo") return { bg: "rgba(234,179,8,0.18)", text: Colors.amberLt };
  return { bg: "rgba(124,58,237,0.22)", text: Colors.purpleLt };
}

function formatDistance(km?: number): string {
  if (km === undefined) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function formatExpiry(expiresAt: string): string {
  return new Date(expiresAt).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CouponDetailScreen({ couponId }: CouponDetailScreenProps) {
  const tabBarPadding = useDriverTabBarPadding();
  const { trigger } = useHaptic();
  const currentLocation = useCouponStore((s) => s.currentLocation);
  const setActiveRedemption = useCouponStore((s) => s.setActiveRedemption);
  const { coupon, isLoading, error } = useCouponDetail(couponId);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleGenerateQr = useCallback(async () => {
    if (!coupon?.isEligible) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const result = await generateCouponQr(
        coupon.id,
        currentLocation?.lat,
        currentLocation?.lng,
      );
      setActiveRedemption({
        redemptionId: result.redemptionId,
        qrToken: result.qrToken,
        expiresAt: result.expiresAt,
        bonusPoints: result.bonusPoints,
        partnerName: coupon.partnerName,
        title: coupon.title,
        type: coupon.type,
        value: coupon.value,
      });
      router.push("/(driver)/coupons/qr");
    } catch (err) {
      setGenerateError(getApiErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }, [coupon, currentLocation, setActiveRedemption]);

  const handleShare = useCallback(async () => {
    if (!coupon) return;
    void trigger("light");
    const value = displayValue(coupon.type, coupon.value);
    const url = Linking.createURL(`/(driver)/coupons/${coupon.id}`);
    await Share.share({
      title: coupon.title,
      message: `${coupon.title} at ${coupon.partnerName} — ${value}\n${url}`,
      url,
    });
  }, [coupon, trigger]);

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.purpleLt} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !coupon) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <PageHeader title="Coupon detail" onBack={() => router.back()} />
        <View style={styles.loading}>
          <Text style={styles.errorText}>{getApiErrorMessage(error)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <PageHeader
        title="Coupon detail"
        onBack={() => router.back()}
        rightSlot={
          <Pressable onPress={() => void handleShare()} hitSlop={12} style={styles.shareButton}>
            <IconShare2 size={20} color={Colors.t2} strokeWidth={2} />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection coupon={coupon} />

        <View style={styles.infoRow}>
          <InfoCard
            icon={<IconMapPin size={16} color={Colors.purpleLt} strokeWidth={2} />}
            label="Distance"
            value={formatDistance(coupon.distanceKm)}
          />
          <InfoCard
            icon={<IconClock size={16} color={Colors.t2} strokeWidth={2} />}
            label="Uses left"
            value={
              coupon.usesRemaining === null ? "∞" : String(coupon.usesRemaining)
            }
          />
          <InfoCard
            icon={<IconStar size={16} color={Colors.amberLt} strokeWidth={2} />}
            label="Bonus"
            value={`+${coupon.bonusPoints}`}
          />
        </View>

        <AppCard variant="outline" padding="md" style={styles.expiryCard}>
          <Text style={styles.expiryLabel}>Expires</Text>
          <Text style={styles.expiryValue}>{formatExpiry(coupon.expiresAt)}</Text>
        </AppCard>

        {coupon.isRoutine ? (
          <AppCard variant="glass" padding="md" style={styles.routineCard}>
            <RoutineBadge etaMinutes={coupon.routineEtaMinutes} />
            <Text style={styles.routineCopy}>
              This offer is along your current route. Stop by before it expires.
            </Text>
          </AppCard>
        ) : null}

        {coupon.minDriverLevel !== "any" ? (
          <AppCard variant="outline" padding="md">
            <Text style={styles.sectionLabel}>Level requirement</Text>
            <Text style={styles.sectionValue}>
              {coupon.minDriverLevel.charAt(0).toUpperCase()}
              {coupon.minDriverLevel.slice(1)} or higher
            </Text>
          </AppCard>
        ) : null}

        {coupon.availableHoursStart && coupon.availableHoursEnd ? (
          <AppCard variant="outline" padding="md">
            <Text style={styles.sectionLabel}>Available hours</Text>
            <Text style={styles.sectionValue}>
              {coupon.availableHoursStart} – {coupon.availableHoursEnd}
            </Text>
          </AppCard>
        ) : null}

        <AppCard variant="outline" padding="lg" style={styles.termsCard}>
          <Text style={styles.sectionLabel}>Terms</Text>
          {(coupon.terms.length > 0 ? coupon.terms : ["Standard partner terms apply."]).map(
            (term) => (
              <Text key={term} style={styles.termBullet}>
                • {term}
              </Text>
            ),
          )}
        </AppCard>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: tabBarPadding }]}>
        {generateError ? <Text style={styles.generateError}>{generateError}</Text> : null}
        {!coupon.isEligible && coupon.ineligibleReason ? (
          <Text style={styles.ineligible}>{coupon.ineligibleReason}</Text>
        ) : null}
        <AppButton
          label="Generate QR Code"
          onPress={() => void handleGenerateQr()}
          variant="glassPrimary"
          haptic="heavy"
          fullWidth
          size="lg"
          loading={generating}
          disabled={!coupon.isEligible}
        />
      </View>
    </SafeAreaView>
  );
}

function HeroSection({ coupon }: { coupon: Coupon }) {
  const categoryColor = CATEGORY_COLOR[coupon.category];
  const badge = valueBadgeColors(coupon.type);
  const heroStyle = coupon.isRoutine ? styles.heroRoutine : styles.heroDefault;

  return (
    <View style={heroStyle}>
      <View
        style={[
          styles.heroIcon,
          { backgroundColor: `${categoryColor}22`, borderColor: `${categoryColor}44` },
        ]}
      >
        {getCategoryIcon(coupon.category, 30, categoryColor)}
      </View>
      <Text style={styles.heroPartner}>{coupon.partnerName}</Text>
      <Text style={styles.heroTitle}>{coupon.title}</Text>
      <View style={[styles.valueBadge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.valueBadgeText, { color: badge.text }]}>
          {displayValue(coupon.type, coupon.value)}
        </Text>
      </View>
    </View>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <AppCard variant="glass" padding="md" style={styles.infoCard}>
      {icon}
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    color: Colors.red,
    textAlign: "center",
  },
  shareButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  heroRoutine: {
    backgroundColor: Colors.surface3,
    borderRadius: Radius.cardLg,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
  },
  heroDefault: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.cardLg,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.20)",
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  heroPartner: {
    ...Typography.label,
    color: Colors.t3,
    textTransform: "uppercase",
  },
  heroTitle: {
    ...Typography.heading2,
    textAlign: "center",
  },
  valueBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  valueBadgeText: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  infoRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  infoCard: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.t3,
  },
  infoValue: {
    ...Typography.title,
    fontSize: 15,
  },
  expiryCard: {
    backgroundColor: "rgba(234,179,8,0.08)",
    borderColor: "rgba(234,179,8,0.22)",
  },
  expiryLabel: {
    ...Typography.label,
    color: Colors.amberLt,
    marginBottom: Spacing.xs,
  },
  expiryValue: {
    ...Typography.title,
  },
  routineCard: {
    gap: Spacing.sm,
  },
  routineCopy: {
    ...Typography.body,
    lineHeight: 22,
  },
  sectionLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  sectionValue: {
    ...Typography.title,
  },
  termsCard: {
    gap: Spacing.sm,
  },
  termBullet: {
    ...Typography.body,
    color: Colors.t2,
    lineHeight: 22,
  },
  footer: {
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  ineligible: {
    ...Typography.caption,
    color: Colors.amberLt,
    textAlign: "center",
  },
  generateError: {
    ...Typography.caption,
    color: Colors.red,
    textAlign: "center",
  },
});
