/**
 * RegisterStep2
 * Role: public
 * Entry: register step 1 success
 * Exit: success → /(auth)/register/step3
 */
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import type { VehicleType } from "@driven-rewards/shared";
import {
  AppButton,
  AppInput,
  AuthBackButton,
  AuthProgressBar,
  HomeIndicator,
  ProfilePhotoPicker,
  SafeScreen,
  VehicleTypeGrid,
} from "../../../components";
import { useHaptic } from "../../../hooks/useHaptic";
import { useAuthStore } from "../../../store/auth.store";
import { Colors, Spacing, Typography } from "../../../theme";

export default function RegisterStep2() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { trigger } = useHaptic();

  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plateError, setPlateError] = useState<string | undefined>();

  const handleContinue = async () => {
    if (!vehicleType) {
      Alert.alert(
        "Select a vehicle",
        "Choose the vehicle type you use day to day.",
      );
      void trigger("light");
      return;
    }

    if (licensePlate.trim() && licensePlate.trim().length < 5) {
      setPlateError("Invalid license plate");
      void trigger("light");
      return;
    }

    setLoading(true);
    void trigger("medium");

    try {
      await updateProfile({
        vehicleType,
        licensePlate: licensePlate.trim() || undefined,
        profilePhotoUrl: photoUri ?? undefined,
      });
      router.push("/(auth)/register/step3");
    } catch (error) {
      Alert.alert(
        "Error saving",
        error instanceof Error ? error.message : "Try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen showHomeIndicator={false}>
      <View style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        >
          <View style={styles.topBar}>
            <AuthBackButton />
            <AuthProgressBar currentStep={2} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Your vehicle</Text>
              <Text style={styles.subtitle}>
                Choose the vehicle type you use day to day.
              </Text>
            </View>

            <VehicleTypeGrid
              selected={vehicleType}
              onSelect={setVehicleType}
              compact
            />

            <View style={styles.plateSection}>
              <AppInput
                label="License plate"
                labelVariant="auth"
                value={licensePlate}
                onChangeText={(v) => {
                  setLicensePlate(v.toUpperCase());
                  setPlateError(undefined);
                }}
                placeholder="E.g. ABC-1234"
                autoCapitalize="characters"
                error={plateError}
              />
            </View>

            <ProfilePhotoPicker uri={photoUri} onPick={setPhotoUri} compact />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <AppButton
            label="Continue"
            onPress={handleContinue}
            haptic="medium"
            loading={loading}
            fullWidth
            size="lg"
          />
        </View>
      </View>
      <HomeIndicator />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  plateSection: {
    marginTop: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
