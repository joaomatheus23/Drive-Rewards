/**
 * CouponsScreen
 * Role: driver
 * Entry: Tab bar (Coupons tab)
 * Exit: → CouponDetailScreen
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { router } from "expo-router";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";
import {
  CouponCard,
  CouponFilterBar,
  CouponSearchBar,
  EmptyCouponsState,
  HomeIndicator,
} from "../../components";
import { useCoupons } from "../../hooks/useCoupons";
import { useCouponStore } from "../../store/couponStore";
import { getApiErrorMessage } from "../../services/api";
import { Colors, Spacing, SpringConfig, Typography } from "../../theme";
import type { Coupon } from "../../types/coupon";

function CouponSkeletonItem() {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(withSpring(0.75, SpringConfig), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeleton, animatedStyle]} />;
}

function CouponSkeletonList() {
  return (
    <View style={styles.skeletonList}>
      {Array.from({ length: 4 }).map((_, index) => (
        <CouponSkeletonItem key={`skeleton-${index}`} />
      ))}
    </View>
  );
}

export function CouponsScreen() {
  const filter = useCouponStore((s) => s.filter);
  const search = useCouponStore((s) => s.search);
  const setFilter = useCouponStore((s) => s.setFilter);
  const setSearch = useCouponStore((s) => s.setSearch);
  const setCurrentLocation = useCouponStore((s) => s.setCurrentLocation);

  const [searchDraft, setSearchDraft] = useState(search);

  const {
    coupons,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useCoupons();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchDraft);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchDraft, setSearch]);

  useEffect(() => {
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    })();
  }, [setCurrentLocation]);

  const handleCouponPress = useCallback((coupon: Coupon) => {
    router.push(`/(driver)/coupons/${coupon.id}`);
  }, []);

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.subtitle}>Available now</Text>
            <Text style={styles.title}>Coupons</Text>
          </View>
          <Pressable style={styles.filterButton} hitSlop={8}>
            <IconAdjustmentsHorizontal size={20} color={Colors.t2} strokeWidth={2} />
          </Pressable>
        </View>
        <CouponSearchBar value={searchDraft} onChangeText={setSearchDraft} />
        <CouponFilterBar active={filter} onChange={setFilter} />
      </View>
    ),
    [filter, searchDraft, setFilter],
  );

  const listEmpty = useMemo(() => {
    if (isLoading) return <CouponSkeletonList />;
    if (error) {
      return (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{getApiErrorMessage(error)}</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </Pressable>
        </View>
      );
    }
    return <EmptyCouponsState filter={filter} />;
  }, [error, filter, isLoading, refetch]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CouponCard coupon={item} onPress={() => handleCouponPress(item)} />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={Colors.purpleLt} style={styles.footerLoader} />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
      />
      <HomeIndicator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  listContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  listHeader: {
    gap: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.t3,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.heading1,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  skeleton: {
    height: 108,
    borderRadius: 18,
    backgroundColor: Colors.borderMd,
  },
  errorWrap: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
    alignItems: "center",
    gap: Spacing.md,
  },
  errorText: {
    ...Typography.body,
    color: Colors.red,
    textAlign: "center",
  },
  retryText: {
    ...Typography.body,
    color: Colors.purpleLt,
    fontWeight: "700",
  },
  footerLoader: {
    marginVertical: Spacing.lg,
  },
});
